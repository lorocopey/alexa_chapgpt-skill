const Alexa = require('ask-sdk-core');
const { getChatGPTResponse } = require('./openai-client');

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
  },
  handle(handlerInput) {
    const speechText = 'Bienvenido a chapi asistente. Pregúntame lo que quieras.';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Chapi, tu asistente', speechText)
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
    const respuesta = await getChatGPTResponse(userInput);
    return handlerInput.responseBuilder
      .speak(respuesta)
      .getResponse();
  }
};

module.exports = Alexa.SkillBuilders.custom()
  .addRequestHandlers(
    LaunchRequestHandler,
    ChatGPTIntentHandler
  )
  .create();
