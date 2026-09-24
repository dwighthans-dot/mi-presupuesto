# Mesada V12.17 — Compilación APK Android

V12.17 pasa de la preparación de la plataforma Android a la **compilación real de un APK Debug** mediante GitHub Actions.

## Flujo

El workflow:

1. usa la rama `mesada-v12`;
2. configura Java 21 y Node.js 22;
3. instala las dependencias;
4. genera `dist/`;
5. genera Android si todavía no existe;
6. ejecuta `npx cap sync android`;
7. compila `app-debug.apk`;
8. publica el APK como artefacto descargable del workflow;
9. guarda la plataforma Android en la rama si hubo cambios.

Capacitor documenta el uso de Android como plataforma nativa dentro de una aplicación web existente. citeturn0search0turn0search1

## Importante

Esta versión todavía produce un **APK Debug para pruebas**. No es todavía el paquete firmado de producción para Google Play.

No se modifica:

- `main`;
- V11;
- Supabase;
- SMTP;
- reglas financieras;
- funcionamiento web.

## Cómo ejecutar

En GitHub:

**Actions → V12.17 - Compilar APK Android → Run workflow → mesada-v12**

Al finalizar correctamente aparecerá el artefacto:

`mesada-v12.17-debug-apk`

Dentro estará:

`app-debug.apk`

## Próximo paso

Después de comprobar el APK en un teléfono Android, V12.18 puede preparar la configuración de publicación: nombre final, icono definitivo, firma de release y generación AAB para Google Play.
