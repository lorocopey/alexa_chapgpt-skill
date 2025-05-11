/**
 * Test para el sistema de caché de conversaciones
 * Simula múltiples usuarios interactuando con ChatGPT
 * 
 * Ejecutar con: node test-conversation-cache.js
 */

// Importar las funciones que queremos probar
const { getChatGPTResponse, clearUserConversation, getConversationStats } = require('./src/openai-client');

// Función para simular un delay (para hacer las pruebas más legibles)
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// Función para simular una conversación con un usuario
async function simulateUserConversation(userId, messages) {
  console.log(`\n🧪 INICIANDO TEST PARA USUARIO: ${userId}`);
  console.log('----------------------------------------');

  for (const message of messages) {
    console.log(`\n👤 [${userId}]: "${message}"`);
    
    try {
      // Enviar mensaje y obtener respuesta
      const response = await getChatGPTResponse(message, userId);
      console.log(`🤖 [Chapi]: "${response}"\n`);
      
      // Esperar un momento entre mensajes para mejor legibilidad
      await delay(500);
    } catch (error) {
      console.error(`❌ Error en test para usuario ${userId}:`, error);
    }
  }
  
  console.log('----------------------------------------\n');
}

// Función principal de prueba
async function runTests() {
  console.log('🔍 INICIANDO TESTS DE CACHÉ DE CONVERSACIONES');
  console.log('============================================');

  // Test 1: Usuario simple con múltiples mensajes para verificar contexto
  await simulateUserConversation('usuario-test-1', [
    'Hola, me llamo Carlos',
    '¿Recuerdas mi nombre?',
    'Cuéntame un dato curioso sobre las mariposas'
  ]);
  
  // Test 2: Otro usuario con una conversación diferente
  await simulateUserConversation('usuario-test-2', [
    'Soy Ana y estoy aprendiendo a programar en JavaScript',
    '¿Qué recursos me recomiendas?',
    '¿Y qué opinas sobre React?'
  ]);
  
  // Test 3: Volver al primer usuario para verificar si mantiene su contexto
  await simulateUserConversation('usuario-test-1', [
    '¿Qué te había preguntado antes?'
  ]);

  // Mostrar estadísticas de caché después de las pruebas
  console.log('📊 ESTADÍSTICAS DE CACHÉ:');
  console.log(JSON.stringify(getConversationStats(), null, 2));
  
  // Limpiar la caché del usuario de prueba 
  console.log('\n🧹 Limpiando caché para usuario-test-1...');
  const deleted = clearUserConversation('usuario-test-1');
  console.log(`Caché eliminada: ${deleted}`);

  // Verificar nuevamente las estadísticas
  console.log('\n📊 ESTADÍSTICAS DE CACHÉ DESPUÉS DE LIMPIAR:');
  console.log(JSON.stringify(getConversationStats(), null, 2));
}

// Ejecutar los tests
runTests().then(() => {
  console.log('\n✅ TESTS COMPLETADOS');
}).catch(error => {
  console.error('❌ ERROR EN LOS TESTS:', error);
});
