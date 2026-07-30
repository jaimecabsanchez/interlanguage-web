# Migraciones de base de datos

Cada cambio del esquema es **un archivo numerado** aquí, revisado en git. Es la única forma de tocar la BD
(nunca a mano en el panel de Supabase de producción).

## Convención de nombres
```
0001_init.sql                 # tablas base + RLS iniciales
0002_<descripcion-corta>.sql  # siguiente cambio
...
```
- Se aplican **en orden**: primero en local, luego staging, luego producción.
- Cada migración debe ser **reversible** (o llevar su plan de reversión comentado arriba).
- `../schema.sql` refleja el **estado actual** del modelo; estas migraciones son el **historial** de cómo se llegó.

Detalle del modelo: `docs/superpowers/specs/2026-07-29-modelo-datos-api.md`.
La primera migración (`0001_init.sql`) se crea en el **Bloque 1**.
