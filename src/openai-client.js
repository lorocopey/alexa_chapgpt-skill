require('dotenv').config();
const { OpenAI } = require('openai');
const NodeCache = require('node-cache');

// Configuración de la caché
// stdTTL: tiempo en segundos (24 horas = 86400 segundos)
// checkperiod: cada cuánto tiempo revisar las claves expiradas (10 minutos = 600 segundos)
const conversationCache = new NodeCache({ stdTTL: 86400, checkperiod: 600 });

// Número máximo de mensajes a almacenar por usuario
const MAX_CONVERSATION_LENGTH = 10;

// Sistema de instrucciones para ChatGPT
const SYSTEM_INSTRUCTION = "Eres un asistente de Alexa llamado 'Chapi'. Responde de manera" + 
                         " concisa y conversacional. Hablas en español y debes ser amigable," + 
                         " servicial y breve en tus respuestas para hacerlas adecuadas para voz.";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Obtiene la conversación almacenada para un usuario específico
 * @param {string} userId - ID único del usuario
 * @returns {Array} - Array de mensajes de la conversación
 */
function getUserConversation(userId) {
  // Si no existe la conversación, crea una nueva con la instrucción del sistema
  if (!conversationCache.has(userId)) {
    const newConversation = [
      { role: 'system', content: SYSTEM_INSTRUCTION }
    ];
    conversationCache.set(userId, newConversation);
    return newConversation;
  }
  
  // Devuelve la conversación existente y actualiza su TTL
  return conversationCache.get(userId);
}

/**
 * Agrega un mensaje a la conversación de un usuario
 * @param {string} userId - ID único del usuario
 * @param {string} role - 'user' o 'assistant'
 * @param {string} content - Contenido del mensaje
 */
function addMessageToConversation(userId, role, content) {
  const conversation = getUserConversation(userId);
  
  // Añadir el nuevo mensaje
  conversation.push({ role, content });
  
  // Limitar el tamaño de la conversación (mantener el primer mensaje del sistema)
  if (conversation.length > MAX_CONVERSATION_LENGTH + 1) {
    // Eliminar el mensaje más antiguo después del mensaje del sistema
    conversation.splice(1, 1);
  }
  
  // Actualizar la conversación en la caché (esto también actualiza el TTL)
  conversationCache.set(userId, conversation);
}

/**
 * Obtiene una respuesta de ChatGPT basada en el contexto histórico del usuario
 * @param {string} prompt - Mensaje del usuario
 * @param {string} userId - ID único del usuario (puede ser userID de Alexa)
 * @returns {string} - Respuesta de ChatGPT
 */
async function getChatGPTResponse(prompt, userId = 'default-user') {
  try {
    // Agregar el mensaje del usuario a la conversación
    addMessageToConversation(userId, 'user', prompt);
    
    // Obtener la conversación completa para enviar a OpenAI
    const conversation = getUserConversation(userId);
    console.log(`🔵 Contexto de conversación para usuario ${userId}:`, JSON.stringify(conversation));
    
    // Llamar a la API de OpenAI con el contexto completo
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: conversation,
      max_tokens: 300,  // Limitar tokens para respuestas más concisas
      temperature: 0.7  // Un poco de creatividad pero manteniéndose coherente
    });

    const response = completion.choices[0].message.content;
    
    // Agregar la respuesta del asistente a la conversación
    addMessageToConversation(userId, 'assistant', response);
    
    return response;
  } catch (error) {
    console.error('❌ Error consultando OpenAI:', error);
    return 'Lo siento, no pude obtener una respuesta en este momento.';
  }
}

/**
 * Borra el contexto de conversación de un usuario específico
 * @param {string} userId - ID del usuario
 * @returns {boolean} - true si se borró exitosamente, false si no existía
 */
function clearUserConversation(userId) {
  return conversationCache.del(userId);
}

/**
 * Obtiene estadísticas sobre las conversaciones almacenadas
 * @returns {Object} - Objeto con métricas de la caché
 */
function getConversationStats() {
  return {
    totalUsers: conversationCache.keys().length,
    activeUsers: conversationCache.keys(),
    cacheStats: conversationCache.getStats()
  };
}

module.exports = { 
  getChatGPTResponse,
  clearUserConversation,
  getConversationStats
};
