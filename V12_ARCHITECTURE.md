# Mesada V12 — arquitectura inicial

V12 parte de V11 sin cambios visuales ni funcionales intencionales.

Estructura inicial: index.html, src/web/styles.css, src/web/app.js, cards/, manifest.json, sw.js y Supabase.

La siguiente etapa separará auth, budget, commitments, expenses, savings, accounts, profile, reports y supabase. Luego se incorporará Capacitor para Android/iOS.

## V12.4 — Capa de interfaz

Se agrega una capa UI independiente para reducir el acoplamiento del archivo principal:

- `src/ui/dom.js`: acceso al DOM y mensajes de interfaz.
- `src/ui/navigation.js`: navegación entre pestañas y paneles de autenticación.
- `src/web/app.js`: conserva la orquestación de la aplicación, pero consume las utilidades UI como módulos.

La etapa V12.4 no modifica el esquema de Supabase ni la rama `main`.
