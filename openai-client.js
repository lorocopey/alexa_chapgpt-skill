const { OpenAI } = require('openai');
require('dotenv').config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function getChatGPTResponse(prompt) {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }]
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('❌ Error consultando OpenAI:', error);
    return 'Lo siento, no pude obtener una respuesta en este momento.';
  }
}

module.exports = { getChatGPTResponse };
