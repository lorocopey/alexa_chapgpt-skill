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

module.exports = { ChatGPTIntentHandler };