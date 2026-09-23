# V12.14 — Identidad y preparación Android

Esta etapa deja definida la identidad de la aplicación Mesada para Android y prepara los comandos de trabajo de la plataforma nativa, sin modificar la interfaz web ni las reglas financieras.

## Identidad Android

- Nombre visible: **Mesada**
- Identificador de aplicación: `com.mesada.app`
- Runtime: Capacitor 8
- Fuente web: `dist/`
- Backend: Supabase existente
- Rama de trabajo: `mesada-v12`

Capacitor está diseñado para incorporar una aplicación web existente dentro de un runtime nativo y permite agregar posteriormente las plataformas Android e iOS.

## Comandos preparados

Después de instalar Node.js, dependencias de npm y Android Studio/SDK en el equipo de desarrollo:

```bash
npm install
npm run build
npm run android:setup
npm run android:sync
npm run android:open
```

### Qué hace cada comando

- `npm run build`: genera el paquete web en `dist/`.
- `npm run android:setup`: genera la plataforma Android de Capacitor por primera vez y la sincroniza con el contenido web.
- `npm run android:sync`: vuelve a construir la web y sincroniza cambios con Android.
- `npm run android:open`: abre el proyecto Android en Android Studio.

## Branding

La identidad web existente de Mesada se conserva. El archivo `logo.png` continúa siendo el recurso visual principal de la aplicación web/PWA.

La generación de los recursos nativos definitivos de Android (iconos adaptativos, iconos de launcher y splash nativo) queda para el momento en que exista la plataforma `android/` real. No se crean archivos Gradle ni recursos nativos simulados en GitHub.

## Seguridad de cambios

Esta etapa no:

- modifica `main`;
- modifica Supabase;
- modifica las tablas o políticas RLS;
- cambia las reglas de ingresos, gastos, compromisos o ahorro;
- cambia deliberadamente la interfaz web;
- crea una plataforma Android ficticia.

## Verificación oficial

La documentación oficial de Capacitor confirma que puede incorporarse a un proyecto JavaScript existente y que Android se agrega mediante `@capacitor/android` y `npx cap add android`.

Fuente: https://capacitorjs.com/docs

## Siguiente etapa

**V12.15 — Generación real de Android**: ejecutar la preparación en un entorno con Node.js + Android Studio/SDK, crear la carpeta nativa `android/`, sincronizar `dist/` y revisar el proyecto en Android Studio.
