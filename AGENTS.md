# Guía para agentes de IA (Codex / Claude) — Interlanguage

Este repo tiene **dos proyectos**. Trabaja en el que corresponda y no los mezcles.

| Carpeta | Proyecto | Guía específica |
|---|---|---|
| `web-publica/` | Web pública de Interlanguage Studies | `web-publica/AGENTS.md` |
| `plataforma/` | App de práctica "Interlanguage HOME" | `plataforma/AGENTS.md` |
| `supabase/` | Backend de la plataforma (BD + Edge Functions) | — |
| `docs/` | Diseño, specs y planes (contexto útil) | — |
| `material-fuente/`, `archivo/` | Material bruto / cosas viejas | **No editar** |

## Reglas generales (importan mucho)

- **No hay build ni bundler.** Es HTML/CSS/JS plano servido tal cual. No añadas webpack/vite/react ni `npm install` sin pedirlo. Node solo se usa para correr tests.
- **Nunca subas secretos.** `supabase-config.js` solo lleva la clave PÚBLICA (anon). La `service_role` jamás va en `plataforma/` (el CI falla si aparece). Los secretos van en `.env` (ignorado por git).
- **No rompas rutas al mover archivos.** La plataforma es autónoma (su favicon está en `plataforma/assets/`); no vuelvas a hacer que dependa de `../images`.
- **Despliegue:** Netlify publica `web-publica/` (ver `netlify.toml`). No metas la plataforma dentro de `web-publica/`.
- **`supabase/` no se renombra** (lo exige la CLI de Supabase).

## Colaboración entre agentes (Codex + Claude, a la vez)

Dos agentes editan este repo. Para no pisaros:

- **Sincroniza antes de empezar** (`git pull --rebase`) y **haz commits pequeños y frecuentes**, cada uno con una sola intención y un mensaje claro.
- **No dejes el árbol roto**: corre los tests y comprueba en el navegador antes de commitear.
- **Trabajad en zonas distintas** cuando sea posible (p. ej. uno en `web-publica/`, otro en `plataforma/`) para reducir conflictos.
- **`AGENTS.md` es la fuente única de reglas.** Si estableces una convención nueva, escríbela aquí en el mismo commit.
- Si cambias un `.js`/`.css`, **sube el `?v=`** en las páginas afectadas (si no, el otro verá versiones viejas por caché).
- Ante un conflicto de merge, **no borres el trabajo del otro**: integra ambos cambios.

## Cómo probar

```bash
# Tests (los mismos que el CI de GitHub corre en cada push a main):
node plataforma/smoke.test.js
node plataforma/auth-utils.test.js
node plataforma/motor/pedagogia.test.js
node plataforma/motor/motivacion.test.js
node plataforma/motor/matriz.test.js

# Ver en el navegador (sirve la raíz):
python3 -m http.server 8752
#  · Plataforma: http://localhost:8752/plataforma/index.html?demo=1   (login lucia / home1234)
#  · Web pública: http://localhost:8752/web-publica/index.html
```

## Principios de producto (no los violes)

Sin rankings ni comparaciones con otros niños · sin castigos por perder la racha · sin mensajes de culpa ·
sin exceso de monedas/animaciones · ESO debe sentirse maduro (no infantil) · respeta `prefers-reduced-motion` ·
**no inventes datos reales** de un alumno (los datos de muestra solo en la cuenta demo). El avión de papel es el símbolo de avance; la arquitectura admite una mascota futura, pero todavía no hay una mascota consolidada. Más contexto en `docs/`.
