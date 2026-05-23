export function searchChunks(question, chunks, limit = 3) {

  // Convertir pregunta a minúsculas
  const questionLower = question.toLowerCase();

  // Separar palabras clave
  const keywords = questionLower
    .split(/\s+/)
    .filter(word => word.length > 3);

  // Puntuar chunks
  const scoredChunks = chunks.map(chunk => {

    const textLower = chunk.text.toLowerCase();

    let score = 0;

    keywords.forEach(keyword => {
      if (textLower.includes(keyword)) {
        score++;
      }
    });

    return {
      text: chunk.text,
      score
    };
  });

  // Ordenar por relevancia
  scoredChunks.sort((a, b) => b.score - a.score);

  // Filtrar chunks útiles
  const relevantChunks = scoredChunks
    .filter(chunk => chunk.score > 0)
    .slice(0, limit);

  return relevantChunks;
}