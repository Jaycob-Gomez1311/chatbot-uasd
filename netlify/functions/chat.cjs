const chunks = require('../../src/data/estatuto-chunks.json');

// Función para buscar los chunks más relevantes
function searchRelevantChunks(question, chunksData, limit = 5) {
  const questionLower = question.toLowerCase();
  // Eliminar palabras muy comunes y cortas
  const keywords = questionLower.split(/\s+/).filter(w => w.length > 3);
  
  const scored = chunksData.map(chunk => {
    const textLower = chunk.text.toLowerCase();
    let score = 0;
    // Coincidencia exacta de la frase completa (mucho peso)
    if (textLower.includes(questionLower)) {
      score += 100;
    }
    // Coincidencia de palabras clave
    for (const kw of keywords) {
      const regex = new RegExp(`\\b${kw}\\b`, 'i');
      if (regex.test(textLower)) {
        score += 20;
      } else if (textLower.includes(kw)) {
        score += 10;
      }
    }
    return { text: chunk.text, score };
  });
  
  // Ordenar por puntaje
  scored.sort((a, b) => b.score - a.score);
  const relevant = scored.filter(c => c.score > 0);
  
  // Si no encontró nada, devolver los primeros 3 chunks (para tener algo de contexto)
  if (relevant.length === 0) {
    return chunksData.slice(0, 3);
  }
  return relevant.slice(0, limit);
}

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: JSON.stringify({ error: 'Método no permitido' }) };
    }

    const { question } = JSON.parse(event.body);
    if (!question) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Pregunta requerida' }) };
    }

    // Buscar chunks relevantes (máximo 5)
    const relevantChunks = searchRelevantChunks(question, chunks, 5);
    const context = relevantChunks.map(c => c.text).join('\n\n---\n\n');

    // Prompt más eficiente y permisivo para saludos
    const prompt = `
Eres un asistente virtual especializado en la Universidad Autónoma de Santo Domingo (UASD). Tu función es responder preguntas sobre el Estatuto Orgánico de la UASD.

REGLAS OBLIGATORIAS:
1. Si el usuario te saluda (hola, buenos días, qué tal, etc.), responde cordialmente y ofrece ayuda sobre el Estatuto. Ejemplo: "¡Hola! Estoy aquí para resolver tus dudas sobre el Estatuto Orgánico de la UASD. ¿Qué te gustaría consultar?"
2. Si el usuario pregunta sobre la UASD en general (por ejemplo: "¿Qué es la UASD?", "Háblame de la UASD"), usa la información del Estatuto que se te proporciona (las primeras páginas describen la universidad). Responde de manera clara y resumida.
3. Para preguntas específicas del Estatuto, responde SOLO usando el contexto que se te da. NO inventes información.
4. Si la pregunta no tiene respuesta en el contexto del Estatuto (ejemplo: preguntas sobre deportes, clima, política externa), responde: "No tengo información suficiente en el Estatuto Orgánico para responder esa pregunta. Por favor, consulta solo temas relacionados con la UASD y su Estatuto."
5. Mantén un tono amable, académico y útil.

CONTEXTO (texto del Estatuto Orgánico de la UASD):
${textoCompleto}

PREGUNTA DEL USUARIO:
${question}

RESPUESTA:
`;

    const API_KEY = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;
    
    const requestBody = {
      contents: [{ parts: [{ text: prompt }] }]
    };
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error de Gemini:', errorText);
      throw new Error(`Gemini API error: ${response.status}`);
    }
    
    const data = await response.json();
    let answer = data.candidates[0].content.parts[0].text;
    
    // Corregir acentos
    answer = answer
      .replace(/Ã¡/g, 'á')
      .replace(/Ã©/g, 'é')
      .replace(/Ã­/g, 'í')
      .replace(/Ã³/g, 'ó')
      .replace(/Ãº/g, 'ú')
      .replace(/Ã±/g, 'ñ')
      .replace(/Ã‘/g, 'Ñ');
    
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answer })
    };
  } catch (error) {
    console.error('Error en la función chat:', error);
    return {
      statusCode: 200, // Importante: devolver 200 para que el frontend no muestre error genérico
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        answer: 'Ocurrió un error técnico. Por favor, intenta de nuevo en unos momentos.' 
      })
    };
  }
};