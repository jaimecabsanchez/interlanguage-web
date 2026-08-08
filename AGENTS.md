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
**no inventes datos reales** de un alumno (los datos de muestra solo en la cuenta demo). El personaje es **Nemo**, un zorro viajero. Más contexto en `docs/`.
