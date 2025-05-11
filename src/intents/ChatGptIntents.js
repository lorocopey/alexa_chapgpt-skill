const ChatGPTIntentHandler = {
    canHandle(handlerInput) {
        const { request } = handlerInput.requestEnvelope;
        console.log('ChatGPTIntentHandler', request);
        return request.type === 'IntentRequest' && request.intent.name === 'ChatGPTIntent';
    },
    async handle(handlerInput) { // ChatGPTIntent
        const userInput = handlerInput.requestEnvelope.request.intent.slots?.question?.value || 'Hola';
        const respuesta = await getChatGPTResponse(userInput);
        console.log('respuesta', respuesta);
        if (respuesta === undefined) {
            return handlerInput.responseBuilder
                .speak('Lo siento, no pude obtener una respuesta de ChatGPT.')
                .getResponse();
        }
        return handlerInput.responseBuilder
            .speak(respuesta)
            .getResponse();
    }
};

module.exports = { ChatGPTIntentHandler };