# Felicitación de Nico & Yoel — cómo subirla a Render + Neon

Necesitas hacerlo una sola vez, mejor desde el ordenador. Después todo funciona solo, sin tu PC encendido.

## 1. Neon (donde se guardan las firmas)

1. Entra en https://neon.tech e inicia sesión.
2. Crea un proyecto nuevo (el nombre da igual, por ejemplo `cumple`). Elige la región de Europa (Frankfurt).
3. En el panel del proyecto pulsa **Connect** y copia la **Connection string**. Es una línea que empieza por `postgresql://...`. Guárdala, la usarás en el paso 3.

No hace falta crear tablas: la web crea la suya sola la primera vez que arranca.

## 2. GitHub (donde Render coge el código)

1. Entra en https://github.com (crea una cuenta si no tienes).
2. Pulsa **New repository**, ponle de nombre `cumple-nico-yoel` y márcalo como **Private**. Créalo.
3. En el repositorio vacío pulsa **uploading an existing file**.
4. Descomprime el zip y arrastra a la página **todo su contenido**: `server.js`, `package.json`, `LEEME.md` y la carpeta `public` entera.
5. Pulsa **Commit changes**.

## 3. Render (donde vive la web)

1. Entra en https://render.com e inicia sesión con tu cuenta de GitHub.
2. Pulsa **New → Web Service** y elige el repositorio `cumple-nico-yoel`.
3. Rellena:
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free
4. En **Environment Variables** añade una:
   - **Key:** `DATABASE_URL`
   - **Value:** la Connection string de Neon del paso 1
5. Pulsa **Create Web Service** y espera un par de minutos a que ponga **Live**.
6. Arriba verás tu enlace, algo como `https://cumple-nico-yoel.onrender.com`.

## 4. Firmar y enviar

1. Abre el enlace en tu móvil, baja hasta **De mi parte**, pulsa **Pintar**, firma con el dedo y pulsa **Guardar firma**.
2. Manda el enlace a Nico y Yoel por WhatsApp. Cada uno firma en su muro y lo guarda; el último verá las otras dos firmas.

## A tener en cuenta

- **Primera carga lenta:** en el plan gratis de Render la web se "duerme" si nadie entra en un rato, y la primera visita tarda unos segundos en despertarla (a veces casi un minuto). Truco: ábrela tú justo antes de mandar el enlace.
- **Quien tenga el enlace puede firmar:** cualquiera con el enlace podría pintar encima de un muro y guardarlo. Pásalo solo a ellos dos.
- **Cambiar algo:** si quieres modificar textos o fotos, sube los archivos nuevos al repositorio de GitHub y Render actualiza la web solo.
