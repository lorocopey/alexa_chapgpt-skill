const { getChatGPTResponse } = require('./openai-client');

(async () => {
  const respuesta = await getChatGPTResponse("¿Qué es Alexa?");
  console.log("Respuesta de ChatGPT:", respuesta);
})();
