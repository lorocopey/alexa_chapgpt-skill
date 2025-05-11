const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

app.use((req, res, next) => {
  console.log('📥 Solicitud recibida:');
  console.log(JSON.stringify(req.body, null, 2));
  next();
});

app.use('/alexa', require('./routes/alexaRoute'));

app.listen(port, async() => {
    console.log(`Server is running on port ${port}`);
    console.log(`http://localhost:${port}/alexa`);
    console.log('Server started');
})