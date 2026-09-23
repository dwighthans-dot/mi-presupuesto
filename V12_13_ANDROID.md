# V12.13 — Preparación Android

Esta etapa prepara Mesada para su primera plataforma nativa: Android.

## Base

Capacitor 8 utiliza la aplicación web existente como contenido de la aplicación nativa. La documentación oficial indica que, después de instalar Capacitor, se instala `@capacitor/android` y se ejecuta `npx cap add android` para crear la plataforma Android.

## Cambios realizados en el repositorio

- `package.json` pasa a `12.13.0`.
- Se agregó `@capacitor/android` como dependencia.
- Se agregó el comando `npm run android`.
- La aplicación web continúa construyéndose primero hacia `dist/`.
- `capacitor.config.ts` continúa usando `dist` como `webDir`.
- No se modificó `main`.
- No se modificó Supabase.
- No se modificaron las reglas financieras.
- No se modificó deliberadamente la interfaz.
- iOS todavía no se agrega.

## Generación de la plataforma Android

La creación real de la carpeta nativa requiere ejecutar en un equipo de desarrollo con Node.js y Android Studio/SDK:

```bash
npm install
npm run build
npx cap add android
npx cap sync android
```

Después:

```bash
npx cap open android
```

Esto abre el proyecto nativo en Android Studio para compilarlo y probarlo en un dispositivo o emulador.

También queda disponible:

```bash
npm run android
```

Este comando reconstruye la web y sincroniza los cambios con Android una vez que la plataforma `android/` ya haya sido creada.

## Estado de V12.13

El repositorio queda preparado para generar Android, pero la carpeta `android/` todavía no se fabrica automáticamente desde GitHub. No se crea una carpeta Android falsa o incompleta: debe ser generada por Capacitor con `npx cap add android` en un entorno con las herramientas Android instaladas.

## Siguiente etapa

Una vez creada y probada la plataforma Android, V12.14 podrá centrarse en adaptar detalles nativos de Android sin alterar la versión web ni las reglas financieras.
