# V12.15 — Generación real de Android

Esta etapa convierte la preparación anterior en un procedimiento reproducible para generar la plataforma Android real de Mesada.

## Qué se agregó

Se agregó el workflow:

`.github/workflows/v12-15-android.yml`

El workflow:

1. toma la rama `mesada-v12`;
2. instala Node.js;
3. instala las dependencias de Mesada;
4. genera `dist/`;
5. ejecuta `npx cap add android`;
6. ejecuta `npx cap sync android`;
7. verifica archivos esenciales del proyecto Android;
8. guarda la plataforma `android/` en `mesada-v12`.

Esto sigue el flujo oficial de Capacitor para agregar Android a una aplicación web existente.

## Importante

Esta etapa **todavía no genera un APK ni un AAB para publicar**. Primero genera y guarda el proyecto Android nativo.

Tampoco modifica `main`.

## Cómo ejecutar

En GitHub:

**Actions → V12.15 - Generar Android → Run workflow → rama `mesada-v12`**

Al finalizar correctamente, la rama deberá contener la carpeta real:

`android/`

Entonces podremos pasar a la configuración nativa de:

- icono de aplicación;
- splash screen;
- nombre visible;
- orientación;
- permisos;
- versión;
- compilación APK/AAB;
- prueba en teléfono Android.

## Seguridad

No se modifican:

- Supabase;
- tablas;
- políticas RLS;
- reglas financieras;
- interfaz web;
- `main`.

La plataforma Android se genera únicamente en `mesada-v12`.
