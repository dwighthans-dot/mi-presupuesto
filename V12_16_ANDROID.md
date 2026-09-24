# Mesada V12.16 — Identidad nativa Android

## Objetivo

V12.16 continúa la preparación de Android sin tocar la versión web estable de V11 ni las reglas financieras de Mesada.

Esta versión añade al proceso reproducible de GitHub Actions:

- generación real de la plataforma Android con Capacitor 8;
- identidad nativa `Mesada`;
- versión nativa `12.16.0`;
- código de aplicación `com.mesada.app`;
- generación de iconos y splash nativos usando el logo existente de Mesada;
- fondo nativo oscuro coherente con la identidad visual;
- sincronización final de Capacitor.

Capacitor documenta que una aplicación web existente puede incorporar las plataformas nativas y que Android se genera con `npx cap add android`. citeturn0search1turn0search0

## Flujo

En GitHub:

1. Ir a **Actions**.
2. Abrir **V12.16 - Preparar Android nativo**.
3. Pulsar **Run workflow**.
4. Seleccionar la rama **mesada-v12**.
5. Esperar a que termine correctamente.

El workflow generará y guardará la carpeta `android/` en `mesada-v12`.

## Recursos

V12.16 utiliza `@capacitor/assets` para generar los recursos nativos desde el logo de Mesada. La documentación del proyecto indica que esta herramienta genera iconos y splash para Android y que puede trabajar desde un único logo en modo sencillo. citeturn2search1turn2search2

## Seguridad del proyecto

- **main:** no se modifica.
- **V11:** no se modifica.
- **Supabase:** no se modifica.
- **SMTP:** no se modifica.
- **Reglas financieras:** no se modifican.
- **Interfaz web:** no se rediseña en esta versión.
- **Rama de trabajo:** `mesada-v12`.

## Próximo paso

Después de ejecutar correctamente V12.16, se verifica la carpeta Android generada y se pasa a la etapa de compilación de APK/AAB y pruebas en dispositivo/emulador.
