# V12.12 — Preparación del paquete web para Capacitor

Esta etapa mantiene intacta la aplicación web de Mesada y prepara una salida web limpia para que Capacitor pueda empaquetarla posteriormente como aplicación Android e iOS.

## Cambios

- Se agregó un proceso de build web reproducible mediante `scripts/build-web.mjs`.
- La salida de la aplicación queda en `dist/`.
- `capacitor.config.ts` ahora apunta a `webDir: "dist"`.
- `package.json` se actualizó a la versión `12.12.0`.
- Se actualizó el caché del Service Worker a `mesada-v12.12`.
- Se corrigió en el Service Worker el nombre real de la tarjeta empresarial de BanReservas: `.jpg`.
- La estructura `src/` y `cards/` se copia completa a `dist/`, conservando las rutas relativas actuales.
- No se agregaron todavía las plataformas `android/` ni `ios/`.
- No se modificó Supabase.
- No se modificaron las reglas financieras ni la interfaz de Mesada.
- `main` permanece sin cambios.

## Cómo se genera

En un equipo con Node.js instalado:

```bash
npm install
npm run build
npx cap sync
```

La salida web queda en `dist/`. Capacitor utilizará exclusivamente esa carpeta como contenido web empaquetable.

## Próxima etapa

V12.13 puede agregar la plataforma Android con:

```bash
npm install @capacitor/android
npx cap add android
```

La plataforma iOS se mantiene para una etapa posterior.
