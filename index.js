const Alexa = require('ask-sdk-core');
const { getChatGPTResponse } = require('./openai-client');

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
  },
  handle(handlerInput) {
    const speakOutput = 'Hola, soy Chapi. ¿Qué quieres saber?';
    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt('¿Tienes alguna otra pregunta?')
      .getResponse();
  }
};

const ChatGPTIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
           Alexa.getIntentName(handlerInput.requestEnvelope) === 'ChatGPTIntent';
  },
  async handle(handlerInput) {
    const userInput = handlerInput.requestEnvelope.request.intent.slots?.question?.value || 'Hola';
    console.log("📥 Pregunta recibida:", userInput);

    try {
      const respuesta = await getChatGPTResponse(userInput);
      console.log("📤 Respuesta de ChatGPT:", respuesta);

      return handlerInput.responseBuilder
        .speak(respuesta)
        .getResponse();
    } catch (error) {
      console.error("❌ Error al obtener respuesta de ChatGPT:", error);
      return handlerInput.responseBuilder
        .speak('Lo siento, ocurrió un error al procesar tu pregunta.')
        .getResponse();
    }
  }
};


const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.error('⚠️ Error no controlado:', error);
    return handlerInput.responseBuilder
      .speak('Ocurrió un error inesperado.')
      .getResponse();
  }
};

// 👇 Exportamos una instancia creada, NO .lambda()
module.exports = Alexa.SkillBuilders.custom()
  .addRequestHandlers(
    LaunchRequestHandler,
    ChatGPTIntentHandler
  )
  .addErrorHandlers(ErrorHandler)
  .create();
