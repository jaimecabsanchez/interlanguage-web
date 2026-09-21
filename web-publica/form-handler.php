<?php
/**
 * Interlanguage Studies — receptor de formularios de la web.
 * PHP puro, sin librerías ni servicios de terceros. Pensado para hosting Arsys.
 *
 * Recibe por POST los formularios "leadForm" (solicitud de info) y "campForm"
 * (inscripción a campamento), valida en servidor, y envía el aviso por email
 * a la dirección configurada abajo. Devuelve JSON { ok: true } / { ok: false }.
 *
 * ANTES DE PUBLICAR, revisar el bloque CONFIG:
 *   - LEAD_RECIPIENT: a dónde llegan los avisos (info@interlanguage.es).
 *   - FROM_ADDRESS: debe ser un buzón/dominio DEL PROPIO HOSTING (Arsys). Si el
 *     From es de otro dominio, el correo se irá a spam o lo rechazarán (SPF/DKIM).
 *
 * NOTA: esto necesita un hosting con PHP (Arsys). En Netlify (estático) NO se
 * ejecuta; el formulario mostraría el estado de error hasta desplegar en Arsys.
 */

// ================== CONFIG (revisar antes de publicar) ==================
const LEAD_RECIPIENT = 'info@interlanguage.es';                 // <-- CONFIRMAR dirección de destino
const FROM_ADDRESS   = 'no-reply@interlanguage.es';             // <-- debe ser un buzón real del hosting
const SITE_NAME      = 'Interlanguage Studies';
// =======================================================================

header('Content-Type: application/json; charset=utf-8');

// Solo aceptamos POST.
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'method']);
    exit;
}

// Honeypot: campo oculto que solo rellenan los bots. Si viene relleno,
// fingimos éxito y descartamos en silencio (no alertamos al spammer).
if (!empty($_POST['website'])) {
    echo json_encode(['ok' => true]);
    exit;
}

/** Devuelve un campo POST ya recortado. */
function field(string $k): string {
    return isset($_POST[$k]) ? trim((string) $_POST[$k]) : '';
}

/** Elimina saltos de línea: evita inyección de cabeceras en From/Reply-To/Subject. */
function oneline(string $s): string {
    return preg_replace('/[\r\n]+/', ' ', $s);
}

$type  = field('form_type');
$name  = field('fullName');
$email = field('email');
$phone = field('phone');

// Validación mínima en servidor (no confiamos solo en el JS del navegador).
if (!filter_var($email, FILTER_VALIDATE_EMAIL) || $name === '' || field('rgpd') === '') {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'validation']);
    exit;
}

// Cuerpo del email según el tipo de formulario.
if ($type === 'campamento') {
    $subject = 'Nueva inscripción campamento — ' . oneline($name);
    $lines = [
        'INSCRIPCIÓN · CAMPAMENTO DE VERANO',
        '----------------------------------',
        'Sede: '                 . field('sede'),
        'Semanas: '              . field('semanas'),
        'Comedor: '              . field('comedor'),
        'Total estimado: '       . field('total') . ' €',
        '',
        'ALUMNO/A: '             . field('alumnoNombre') . ' ' . field('alumnoApellidos'),
        'Colegio: '              . field('colegio'),
        'Alergias/necesidades: ' . field('alergias'),
        '',
        'CONTACTO (tutor/a)',
        'Nombre: '    . $name,
        'Email: '     . $email,
        'Teléfono: '  . $phone,
        'Comentarios: ' . field('comentarios'),
    ];
} else {
    $subject = 'Nueva solicitud web — ' . oneline($name);
    $lines = [
        'SOLICITUD DE INFORMACIÓN',
        '------------------------',
        'Servicio de interés: ' . field('service'),
        'Edad/curso alumno: '   . field('studentAge'),
        'Mensaje: '             . field('message'),
        '',
        'CONTACTO',
        'Nombre: '    . $name,
        'Email: '     . $email,
        'Teléfono: '  . $phone,
    ];
}
$body = implode("\n", $lines) . "\n\n— Enviado automáticamente desde el formulario de la web.";

// Cabeceras: From del propio dominio; Reply-To al usuario para poder responderle directamente.
$headers = [
    'From: ' . SITE_NAME . ' <' . FROM_ADDRESS . '>',
    'Reply-To: ' . oneline($name) . ' <' . $email . '>',
    'Content-Type: text/plain; charset=UTF-8',
    'X-Mailer: PHP/' . phpversion(),
];

// Asunto codificado en UTF-8 para que los acentos no se rompan.
$encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';

$sent = @mail(LEAD_RECIPIENT, $encodedSubject, $body, implode("\r\n", $headers));

if ($sent) {
    echo json_encode(['ok' => true]);
} else {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'send']);
}
