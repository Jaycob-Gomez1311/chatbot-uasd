const fs = require('fs-extra');
const path = require('path');

async function extractPDF() {
  const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');
  
  try {
    const pdfPath = path.join(__dirname, '..', 'ESTATUTO-ORGANICO-UASD.pdf');
    const pdfData = new Uint8Array(fs.readFileSync(pdfPath));
    const pdfDocument = await pdfjsLib.getDocument({ data: pdfData }).promise;

    let fullText = '';
    for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum++) {
      const page = await pdfDocument.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(' ');
      fullText += pageText + '\n';
    }

    // Limpiar caracteres raros
    fullText = fullText
      .replace(/\u0000/g, '').replace(/\r/g, '')
      .replace(/Ã¡/g, 'á').replace(/Ã©/g, 'é').replace(/Ã­/g, 'í')
      .replace(/Ã³/g, 'ó').replace(/Ãº/g, 'ú').replace(/Ã±/g, 'ñ')
      .replace(/Ã/g, 'Á').replace(/Ã‰/g, 'É').replace(/Ã/g, 'Í')
      .replace(/Ã“/g, 'Ó').replace(/Ãš/g, 'Ú').replace(/Ã‘/g, 'Ñ')
      .replace(/â€œ/g, '"').replace(/â€/g, '"').replace(/â€”/g, '-')
      .replace(/Â/g, '').replace(/ï¿½/g, '')
      .replace(/[ \t]+/g, ' ').trim();

    // Dividir en chunks: primero intentar por páginas (doble salto de línea)
    let chunks = [];
    const posiblesPaginas = fullText.split(/\n\s*\n/);
    
    if (posiblesPaginas.length > 1) {
      for (let i = 0; i < posiblesPaginas.length; i++) {
        const texto = posiblesPaginas[i].trim();
        if (texto.length > 100) {
          chunks.push({ text: `[Página ${i+1}] ${texto}` });
        }
      }
    }
    
    // Si no se pudo dividir por páginas, hacer chunks de 2000 caracteres
    if (chunks.length === 0) {
      const palabras = fullText.split(' ');
      let temp = '';
      for (let palabra of palabras) {
        if ((temp + palabra).length > 2000) {
          chunks.push({ text: temp.trim() });
          temp = '';
        }
        temp += palabra + ' ';
      }
      if (temp.trim()) chunks.push({ text: temp.trim() });
    }
    
    // Si aún así no hay chunks (por ejemplo texto muy corto), guarda todo en uno
    if (chunks.length === 0) {
      chunks.push({ text: fullText });
    }

    const outputPath = path.join(__dirname, '..', 'src', 'data', 'estatuto-chunks.json');
    await fs.ensureDir(path.dirname(outputPath));
    await fs.writeJson(outputPath, chunks, { spaces: 2 });
    
    console.log(`✅ PDF procesado correctamente`);
    console.log(`📄 Chunks generados: ${chunks.length}`);
    console.log(`📏 Tamaño promedio: ${Math.round(fullText.length / chunks.length)} caracteres por chunk`);
  } catch (error) {
    console.error('❌ Error procesando PDF:', error);
  }
}

extractPDF();