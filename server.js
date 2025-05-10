const express = require('express');
const bodyParser = require('body-parser');
const { ExpressAdapter } = require('ask-sdk-express-adapter');
const skill = require('./index').handler;

const app = express();
const port = process.env.PORT || 3000;

const adapter = new ExpressAdapter(skill, false, false);

app.use(bodyParser.json());

// Logging detallado de cada solicitud entrante
app.post('/alexa', (req, res, next) => {
  console.log('📥 Solicitud recibida en /alexa:');
  console.log(JSON.stringify(req.body, null, 2));

  res.on('finish', () => {
    console.log(`📤 Respuesta enviada con código HTTP ${res.statusCode}`);
  });

  next(); // pasa al handler de Alexa
}, adapter.getRequestHandlers());

app.use((err, req, res, next) => {
  console.error('❌ Error no controlado:', err.stack);
  res.status(500).send('Error interno del servidor');
});

app.listen(port, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${port}`);
});
