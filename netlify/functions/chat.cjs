// Cargar todos los chunks y unirlos en un solo texto
const chunks = require('../../src/data/estatuto-chunks.json');
const textoCompleto = chunks.map(c => c.text).join(' ');

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: JSON.stringify({ error: 'Método no permitido' }) };
    }

    const { question } = JSON.parse(event.body);
    if (!question) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Pregunta requerida' }) };
    }

    // Prompt con el texto completo del Estatuto
    const prompt = `
Eres un asistente especializado EXCLUSIVAMENTE en el Estatuto Orgánico de la UASD.

REGLAS OBLIGATORIAS:
- Responde SOLO usando la información del Estatuto que se te proporciona a continuación.
- NO inventes datos ni uses conocimientos externos.
- Si la pregunta no se responde con el texto del Estatuto, di: "No tengo información suficiente en el Estatuto Orgánico para responder esa pregunta."

TEXTO COMPLETO DEL ESTATUTO ORGÁNICO:
${textoCompleto}

PREGUNTA DEL USUARIO:
${question}

RESPUESTA (basada única y exclusivamente en el texto anterior):
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
    const answer = data.candidates[0].content.parts[0].text;

    // Después de obtener 'answer', agregar:
const answerCorregida = answer
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
    
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answer })
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ answer: 'Ocurrió un error procesando la consulta.' })
    };
  }
};