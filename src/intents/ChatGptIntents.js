const { getChatGPTResponse } = require('../openai-client');
const { sanitizeForVoice } = require('../utils/voiceUtils');

const ChatGPTIntentHandler = {
    canHandle(handlerInput) {
        // Registrar solo información relevante y no sensible
        const { request } = handlerInput.requestEnvelope;
        console.log('ChatGPTIntentHandler - Tipo de solicitud:', request.type);
        console.log('ChatGPTIntentHandler - Nombre del intent:', request.intent?.name);
        
        // Registrar información de sesión limitada si existe
        if (handlerInput.requestEnvelope.session) {
            console.log('ChatGPTIntentHandler - ID de sesión:', handlerInput.requestEnvelope.session.sessionId);
            console.log('ChatGPTIntentHandler - Es nueva sesión:', handlerInput.requestEnvelope.session.new);
        }
        
        return request.type === 'IntentRequest' && request.intent.name === 'ChatGPTIntent';
    },
    async handle(handlerInput) {
        const userInput = handlerInput.requestEnvelope.request.intent.slots?.question?.value || 'Hola';
        console.log('🔹 Pregunta recibida:', userInput);
        
        // Obtener el ID del usuario para mantener conversaciones separadas
        const userId = handlerInput.requestEnvelope.session.user.userId;
        console.log('🔹 ID del usuario:', userId.substring(0, 15) + '...');  // Truncar ID por seguridad en logs
        
        let respuesta;
        try {
            // Pasar el ID del usuario junto con la pregunta para mantener el contexto
            let respuestaOriginal = await getChatGPTResponse(userInput, userId);
            console.log('🔹 Respuesta original de ChatGPT:', respuestaOriginal);
            
            // Sanitizar la respuesta para hacerla más adecuada para voz
            respuesta = sanitizeForVoice(respuestaOriginal);
            console.log('🔹 Respuesta sanitizada para voz:', respuesta);
        } catch (error) {
            console.error(' Error al llamar a ChatGPT:', error);
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
            .reprompt('¿Tienes otra pregunta para Chapi?') // Esto mantiene la sesión activa
            .getResponse();
    }

};

module.exports = { ChatGPTIntentHandler };