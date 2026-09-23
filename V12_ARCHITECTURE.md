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


## V12.6 — UI desacoplada
Se extrajeron tres responsabilidades del orquestador web:
- `src/ui/accounts.js`: cuentas, edición, eliminación, vista previa y detección visual de tarjetas.
- `src/ui/profile.js`: renderizado, guardado y foto del perfil.
- `src/ui/auth.js`: login, registro, recuperación, restablecimiento de contraseña y Enter para iniciar sesión.

`src/web/app.js` conserva la coordinación general, Supabase, estado de sesión y eventos de negocio. La UI extraída recibe funciones de acceso al estado actual para evitar referencias obsoletas cuando el estado se normaliza después de cargar datos.


## V12.7 — Eventos desacoplados
Se extrajo la conexión de eventos de la interfaz hacia `src/ui/events.js`. Este módulo concentra las acciones de usuario sobre compromisos, gastos, ahorro, ingresos, configuración, cierre mensual, navegación y cierre de sesión, recibiendo el estado y las operaciones necesarias desde el orquestador.


## V12.8 — Persistencia desacoplada
Se extrajo el acceso a `budget_data` hacia `src/services/budgetRepository.js`. El orquestador conserva el estado, mientras el repositorio gestiona carga/guardado en Supabase y respaldo local.

## V12.9 — Sesión desacoplada
Se extrajo la gestión del ciclo de sesión hacia `src/services/session.js`. El módulo concentra la escucha de cambios de autenticación, recuperación y arranque de sesión.

## V12.10 — Revisión estructural
Se revisaron las dependencias de la capa UI y se corrigió el import explícito de `monthLabel` en `src/ui/renderBudget.js`. La base queda preparada para comenzar la integración de Capacitor sin cambiar deliberadamente la interfaz ni las reglas financieras.


## V12.12 — Salida web para Capacitor
Se agregó un build web reproducible en `scripts/build-web.mjs`. La aplicación estática se copia a `dist/` conservando `src/` y `cards/`, y `capacitor.config.ts` utiliza `dist` como `webDir`. Se actualizó el caché del Service Worker a `mesada-v12.12`. Todavía no se agregan las plataformas nativas Android/iOS.
