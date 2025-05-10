const express = require('express');
const bodyParser = require('body-parser');
const { ExpressAdapter } = require('ask-sdk-express-adapter');
const skill = require('./index'); // 👈 debe exportar .create() o .lambda() en index.js

const app = express();
const port = process.env.PORT || 3000;

// Middleware de logging y compatibilidad con Alexa
app.use(bodyParser.json());

app.use((req, res, next) => {
  console.log('📥 Solicitud recibida en /alexa:');
  console.log(JSON.stringify(req.body, null, 2));
  res.setHeader('ngrok-skip-browser-warning', 'true');
  next();
});

// Adaptador de Alexa
const adapter = new ExpressAdapter(skill, false, false);
app.post('/alexa', adapter.getRequestHandlers());

// Middleware para errores no controlados
app.use((err, req, res, next) => {
  console.error('❌ Error no controlado:', err.stack);
  res.status(500).send('Error interno del servidor');
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${port}/alexa`);
});
