Mesada V11

MESADA V11 — CORRECCIÓN DE RECUPERACIÓN DE CONTRASEÑA

1. Reemplaza en GitHub: index.html, manifest.json, sw.js y logo.png.
2. En Supabase > Authentication > URL Configuration, mantén como Site URL:
   https://dwighthans-dot.github.io/mi-presupuesto/
3. En Redirect URLs agrega/mantén exactamente:
   https://dwighthans-dot.github.io/mi-presupuesto/

IMPORTANTE: esta versión ya NO usa ?reset=1 para recuperar la contraseña. El enlace vuelve a la dirección principal y Supabase activa el flujo PASSWORD_RECOVERY, mostrando automáticamente el panel Nueva contraseña. Esto evita el error de URL no permitida.

Si el envío falla, la aplicación ahora mostrará el mensaje real de Supabase en pantalla, lo que permitirá identificar si se trata de URL no permitida, límite de correo, proveedor SMTP u otro problema.

No ejecutes SQL nuevamente.
