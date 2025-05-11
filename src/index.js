const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

app.use((req, res, next) => {
  console.log('📥 Solicitud recibida:');
  console.log(JSON.stringify(req.body, null, 2));
  next();
});

app.get('/privacy-policy', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Política de Privacidad - Chapi Asistente</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          max-width: 800px;
          margin: 2em auto;
          padding: 1em;
          line-height: 1.6;
        }
        h1 {
          color: #333;
        }
        h2 {
          color: #444;
          margin-top: 1.5em;
        }
      </style>
    </head>
    <body>
      <h1>Política de Privacidad de Chapi Asistente</h1>
      <p><strong>Fecha de entrada en vigor:</strong> 11 de mayo de 2025</p>

      <h2>1. Información que recopilamos</h2>
      <p>Esta skill no recopila ni almacena información personal identificable de los usuarios.</p>

      <h2>2. Información proporcionada por Alexa</h2>
      <p>La interacción se limita a comandos de voz procesados temporalmente para generar respuestas en tiempo real.</p>

      <h2>3. Uso de información</h2>
      <p>La información se utiliza exclusivamente para responder al usuario y no se conserva.</p>

      <h2>4. Compartición de datos</h2>
      <p>No compartimos, vendemos ni transferimos datos a terceros.</p>

      <h2>5. Cambios en esta política</h2>
      <p>Nos reservamos el derecho de modificar esta política. Cualquier cambio será publicado aquí.</p>

      <h2>6. Contacto</h2>
      <p>Si tienes preguntas, contáctanos en: <a href="mailto:lorocopey@gmail.com">lorocopey@gmail.com</a></p>
    </body>
    </html>
  `);
});

app.use('/alexa', require('./routes/alexaRoute'));

app.listen(port, async() => {
    console.log(`Server is running on port ${port}`);
    console.log(`http://localhost:${port}/alexa`);
    console.log('Server started');
})