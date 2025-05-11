/**
 * Utilidades para preparar texto para ser leu00eddo por Alexa
 */

/**
 * Sanitiza y prepara una respuesta de ChatGPT para ser leu00edda por voz
 * 
 * @param {string} text - Texto original de la respuesta de ChatGPT
 * @param {Object} options - Opciones de sanitizaciu00f3n
 * @param {number} options.maxLength - Longitud mu00e1xima de la respuesta (por defecto 7900 caracteres)
 * @returns {string} - Texto optimizado para voz
 */
function sanitizeForVoice(text, options = {}) {
  if (!text) return '';
  
  const { maxLength = 7900 } = options;
  let result = text;

  // 1. Limitar longitud (Alexa tiene lu00edmite cercano a 8000 caracteres)
  if (result.length > maxLength) {
    // Cortar en la u00faltima oraciu00f3n completa antes del lu00edmite
    const lastSentence = result.substring(0, maxLength).lastIndexOf('.');
    if (lastSentence > 0) {
      result = result.substring(0, lastSentence + 1);
    } else {
      result = result.substring(0, maxLength);
    }
    result += ' Lo siento, la respuesta es demasiado larga para continuar.';
  }

  // 2. Reemplazar URLs
  result = result.replace(/https?:\/\/\S+/g, 'un enlace web');

  // 3. Eliminar bloques de cu00f3digo con formato markdown
  result = result.replace(/```[\s\S]*?```/g, 'un bloque de cu00f3digo');
  result = result.replace(/`([^`]+)`/g, '$1');

  // 4. Reemplazar su00edmbolos especiales y caracteres que no se leen bien
  const symbolMap = {
    '*': '',
    '#': 'numeral',
    '&': 'y',
    '+': 'mu00e1s',
    '=': 'igual',
    '/': ' o ',
    '\\': '',
    '>': '',
    '<': '',
    '|': '',
    '_': ' ',
    '~': ''
  };

  Object.entries(symbolMap).forEach(([symbol, replacement]) => {
    result = result.replace(new RegExp('\\' + symbol, 'g'), replacement);
  });

  // 5. Reemplazar emojis comunes con su descripciu00f3n
  const emojiMap = {
    'ud83dude0a': 'sonrisa',
    'ud83dudc4d': 'pulgar arriba',
    'ud83dude42': 'sonrisa',
    'ud83dude01': 'gran sonrisa',
    'u2764ufe0f': 'corazu00f3n',
    'ud83eudd14': 'pensativo',
    'ud83dudc4b': 'saludo con la mano',
    'ud83cudf89': 'celebraciu00f3n',
    'u2705': 'correcto',
    'u2b50': 'estrella'
  };

  Object.entries(emojiMap).forEach(([emoji, description]) => {
    result = result.replace(new RegExp(emoji, 'g'), description);
  });

  // 6. Manejar listas
  // Convertir listas con guiones o nu00fameros a formato mu00e1s fluido para voz
  result = result.replace(/^\s*[-*]\s+(.+)$/gm, '$1');
  result = result.replace(/^\s*\d+\.\s+(.+)$/gm, '$1');

  // 7. Eliminar paru00e9ntesis vacu00edos y mu00faltiples espacios
  result = result.replace(/\(\s*\)/g, '');
  result = result.replace(/\s{2,}/g, ' ');

  // 8. Reemplazar abreviaturas comunes
  const abbreviations = {
    'p. ej.': 'por ejemplo',
    'etc.': 'etcu00e9tera',
    'Dr.': 'Doctor',
    'Dra.': 'Doctora',
    'Sr.': 'Seu00f1or',
    'Sra.': 'Seu00f1ora',
    'vs.': 'versus',
    'tel.': 'telu00e9fono',
    'nu00fam.': 'nu00famero',
    'aprox.': 'aproximadamente'
  };

  Object.entries(abbreviations).forEach(([abbr, full]) => {
    result = result.replace(new RegExp('\\b' + abbr + '\\b', 'g'), full);
  });

  // 9. Au00f1adir pausas naturales para mejorar la cadencia
  result = result.replace(/([.!?])\s+(\w)/g, '$1 <break time="0.5s"/> $2');
  
  // 10. Redondear grandes nu00fameros para facilitar la lectura
  result = result.replace(/\b\d{5,}\b/g, (match) => {
    return 'aproximadamente ' + parseInt(parseInt(match) / 1000) + ' mil';
  });

  return result.trim();
}

module.exports = {
  sanitizeForVoice
};
