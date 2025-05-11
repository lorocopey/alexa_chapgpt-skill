const HelloWorldIntentHandler = {
    canHandle(handlerInput) {
        const { request } = handlerInput.requestEnvelope;
        return request.type === 'IntentRequest' && request.intent.name === 'HelloWorldIntent';
    },
    handle(handlerInput) {
        const speechText = 'Hola mundo.';

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt('Hello world', speechText)
            .getResponse();
    }
}

/* const ChatGPTIntentHandler = {
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
}; */


module.exports = { HelloWorldIntentHandler };