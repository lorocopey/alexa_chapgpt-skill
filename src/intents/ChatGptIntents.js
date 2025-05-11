const { getChatGPTResponse } = require('../openai-client');

const ChatGPTIntentHandler = {
    canHandle(handlerInput) {
        console.log('ChatGPTIntentHandler - handlerInput', JSON.stringify(handlerInput));
        const { request } = handlerInput.requestEnvelope;
        console.log('ChatGPTIntentHandler - request', request);
        return request.type === 'IntentRequest' && request.intent.name === 'ChatGPTIntent';
    },
    async handle(handlerInput) {
        const userInput = handlerInput.requestEnvelope.request.intent.slots?.question?.value || 'Hola';
        console.log('🔹 Pregunta recibida:', userInput);
        let respuesta;
        try {
            respuesta = await getChatGPTResponse(userInput);
            console.log('🔹 Respuesta de ChatGPT:', respuesta);
        } catch (error) {
            console.error('❌ Error al llamar a ChatGPT:', error);
            return handlerInput.responseBuilder
                .speak('Lo siento, ocurrió un error al obtener la respuesta.')
                .getResponse();
        }

        if (!respuesta) {
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