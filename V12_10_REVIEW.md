# Mesada V12 — revisión estructural

## V12.10 — Preparación previa a Capacitor

Esta etapa revisa la separación alcanzada durante V12 y corrige dependencias internas detectadas antes de comenzar la adaptación móvil.

### Capas actuales

- `src/core/`: estado y lógica financiera.
- `src/services/`: Supabase, catálogo de tarjetas, persistencia y sesión.
- `src/ui/`: navegación, eventos, autenticación y renderizado.
- `src/web/`: entrada/orquestación de la aplicación web.
- `cards/`: recursos visuales de tarjetas.
- `manifest.json`: configuración PWA existente.
- `sw.js`: service worker existente de la versión web.

### Corrección realizada

`src/ui/renderBudget.js` utilizaba `monthLabel()` sin importar explícitamente esa dependencia. V12.10 incorpora el import correspondiente desde `src/core/calculations.js`.

### Límite de esta etapa

V12.10 no instala Capacitor, no modifica Supabase y no cambia deliberadamente la interfaz ni las reglas financieras.

La siguiente etapa puede iniciar la preparación de Capacitor sobre esta base, manteniendo la aplicación web como objetivo existente y dejando Android/iOS como empaquetados de la misma aplicación.
