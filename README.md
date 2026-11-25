# Panel de APIs — BNH Medical (General y Gerencial)

Proyecto listo para subir a **GitHub** y desplegar en **Vercel**, con paletas de colores basadas en la identidad visual de **BNH Medical**.

## Paletas de colores incluidas (`styles.css`)
- **BNH Medical (por defecto):** Azul petróleo `#006085`, verde médico `#72AE8F` y gris pizarra `#68708A`.
- **Clínico Claro:** Verde médico `#72AE8F` como color principal con acento `#006085` y fondo claro.
- **Ejecutivo Oscuro:** Fondo oscuro `#0B1922` con tarjetas `#122633` y acentos en `#72AE8F`.

## Archivos incluidos
- `index.html`: estructura del panel con logo, selector de paleta, sección de usuarios normales y sección gerencial.
- `styles.css`: variables CSS (`:root` y `[data-paleta]`) y estilos en cuadrícula.
- `app.js`: datos de APIs, clave gerencial, selector de paletas y lógica de bloqueo/desbloqueo.
- `assets/bnh-medical-logo.png`: logotipo incluido en el encabezado.
- `vercel.json`: configuración base para Vercel.

## Cómo subir a GitHub y desplegar en Vercel
1. Extrae este ZIP en una carpeta local.
2. Crea un repositorio en GitHub (por ejemplo, `panel-apis-bnh`).
3. Ejecuta en la terminal dentro de la carpeta del proyecto:
   ```bash
   git init
   git add .
   git commit -m "Panel de APIs con paletas de BNH Medical"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/panel-apis-bnh.git
   git push -u origin main
   ```
4. En **Vercel**, importa el repositorio desde **Add New... -> Project** y haz clic en **Deploy**.
