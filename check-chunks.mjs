import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const chunksPath = path.join(__dirname, 'src', 'data', 'estatuto-chunks.json');
const chunks = JSON.parse(fs.readFileSync(chunksPath, 'utf8'));

console.log('Total chunks:', chunks.length);

const encontrados = chunks.filter(chunk => 
  chunk.text.toLowerCase().includes('claustro mayor')
);
console.log('Chunks con "Claustro Mayor":', encontrados.length);

if (encontrados.length > 0) {
  console.log('\n✅ Primer chunk encontrado (primeros 300 caracteres):');
  console.log(encontrados[0].text.substring(0, 300));
} else {
  console.log('\n❌ No se encontró "Claustro Mayor". Mostrando primer chunk:');
  console.log(chunks[0]?.text.substring(0, 500));
}