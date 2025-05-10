const express = require('express');
const bodyParser = require('body-parser');
const { ExpressAdapter } = require('ask-sdk-express-adapter');
const skill = require('./index'); // ya es una instancia creada

const app = express();
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('ngrok-skip-browser-warning', 'true');
  next();
});

const adapter = new ExpressAdapter(skill, false, false);
app.post('/alexa', adapter.getRequestHandlers());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor Alexa escuchando en http://localhost:${PORT}/alexa`);
});
