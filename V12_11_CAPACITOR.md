# V12.11 — Preparación Capacitor

Esta etapa inicia la preparación del proyecto Mesada para empaquetarlo posteriormente como aplicación Android e iOS mediante Capacitor.

## Base elegida

Mesada mantiene su aplicación web existente como fuente de la interfaz. Capacitor funcionará como runtime nativo alrededor de esa aplicación, permitiendo reutilizar HTML, CSS y JavaScript y añadir APIs nativas cuando sean necesarias.

La documentación oficial de Capacitor indica que puede incorporarse a una aplicación web existente y posteriormente añadir las plataformas Android e iOS.

## Cambios de V12.11

- Se agregó `package.json`.
- Se agregó `capacitor.config.ts`.
- Se fijó la base del proyecto a Capacitor 8.
- Se definió el identificador inicial `com.mesada.app`.
- Se mantuvo `main` sin cambios.
- Todavía no se agregaron las carpetas nativas `android/` ni `ios/`.
- Todavía no se instalaron plugins nativos.
- No se modificó el esquema de Supabase.
- No se modificó la interfaz ni las reglas financieras.

## Próxima fase

V12.12 podrá realizar la instalación/sincronización de Capacitor y crear primero Android, manteniendo la web como referencia. Después se podrá preparar iOS.

> Nota: la ejecución de `npm install`, `npx cap add android` y la compilación nativa requiere un entorno de desarrollo local con Node.js y las herramientas correspondientes. Esta etapa solamente deja el repositorio preparado.
