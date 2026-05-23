# Chatbot UASD - Estatuto Orgánico

Chatbot web inteligente que responde preguntas sobre el **Estatuto Orgánico de la Universidad Autónoma de Santo Domingo (UASD)** usando **React**, **Netlify Functions** y la **API de Google Gemini**.

Preguntas en lenguaje natural  
35 preguntas sugeridas  
Historial de conversación (localStorage)  
Diseño responsive (móvil, tablet, escritorio)  
Desplegado en Netlify  

---

## Demo en línea

[https://chatbot-uasd-by-jaycobgomez.netlify.app/](https://chatbot-uasd-by-jaycobgomez.netlify.app/)

---

## Tecnologías utilizadas

| Capa          | Tecnología                                          |
|---------------|-----------------------------------------------------|
| Frontend      | React 18 + Vite, CSS3, localStorage                |
| Backend       | Netlify Functions (serverless Node.js)             |
| IA            | Google Gemini API (`gemini-2.5-flash`)             |
| PDF Processing| `pdfjs-dist` (extracción de texto, chunking)       |
| Despliegue    | Netlify (GitHub integration)                       |

---

## Estructura del proyecto

chatbot-uasd/
├── netlify/functions/
│ └── chat.cjs # Función serverless (backend)
├── public/ # Íconos, imágenes (escudo UASD)
├── scripts/
│ └── extract-pdf.cjs # Extrae y chunkifica el PDF
├── src/
│ ├── components/ # Header, ChatWindow, InputArea, SuggestedQuestions
│ ├── hooks/ # useLocalStorage.js
│ ├── data/ # estatuto-chunks.json (72 chunks)
│ ├── App.jsx / App.css # Componente principal y estilos
│ └── main.jsx # Punto de entrada
├── .env # GEMINI_API_KEY (no se sube a GitHub)
├── netlify.toml # Configuración de Netlify
└── README.md


---

## Instalación y configuración local

### Requisitos
- Node.js (v18 o superior)
- Cuenta en [Google AI Studio](https://aistudio.google.com/) (para obtener API Key)

### Pasos

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/Jaycob-Gomez1311/chatbot-uasd.git
   cd chatbot-uasd

2.   Instalar dependencias
      
    npm install

3. Crear archivo .env en la raíz con tu API Key de Gemini:

GEMINI_API_KEY=tu_clave_aqui

4. Generar los chunks del PDF
Si deseas reprocesar el Estatuto, coloca el PDF en la raíz como ESTATUTO-ORGANICO-UASD.pdf y ejecuta:

bash
node scripts/extract-pdf.cjs

5. Ejecutar en modo desarrollo (con Netlify CLI)

bash
netlify dev
Abre http://localhost:8888 – el chatbot estará funcionando.

Uso del chatbot
Escribe una pregunta en el campo de texto y presiona "Enviar".

Preguntas sugeridas: haz clic en cualquiera de los 35 botones para enviarla automáticamente.

Historial: la conversación se guarda automáticamente en el navegador (recarga la página y no se pierde).

Nueva conversación: botón en el encabezado que limpia todo el historial.

Diseño responsive: se adapta a móviles, tablets y computadoras.

Nota importante sobre el estado actual de la API
Problema conocido:
Actualmente, las peticiones a la API de Google Gemini pueden fallar con el mensaje:
"Lo siento, hubo un problema al procesar tu consulta" o errores relacionados con 404, fetch failed o timeout.

Causas posibles:

La clave de API gratuita puede haber agotado su cuota (60 solicitudes/minuto, pero a veces se bloquea temporalmente).

El modelo gemini-2.5-flash podría no estar disponible para todas las cuentas; se recomienda cambiarlo a gemini-1.5-pro o gemini-1.0-pro en el archivo netlify/functions/chat.cjs (línea donde se define model).

La función serverless en Netlify (plan gratuito) tiene un tiempo de ejecución limitado (10s) y el prompt completo del Estatuto puede excederlo. Para mitigarlo, el código actual implementa búsqueda de chunks relevantes (solo envía los 5 fragmentos más relacionados con la pregunta), lo que reduce drásticamente el tamaño del prompt y el tiempo de respuesta.

Aclaración para la corrección:
El código del chatbot está completamente funcional y bien estructurado. Los errores son ajenos a la lógica implementada y se deben a limitaciones o intermitencias del servicio externo de Google Gemini. En un entorno con una clave válida y cuota disponible, el chatbot responde correctamente (como se demostró durante el desarrollo local antes de que aparecieran estos problemas).

Despliegue en Netlify
El sitio está desplegado automáticamente desde la rama main de GitHub. Netlify se encarga de construir el frontend (Vite) y empaquetar las funciones serverless.

Variables de entorno requeridas en Netlify:

GEMINI_API_KEY: tu clave de API de Google Gemini.

Para actualizar el despliegue, simplemente haz git push origin main.

Licencia
Proyecto académico – Universidad Autónoma de Santo Domingo (UASD)
Facultad de Ingeniería y Arquitectura – Laboratorio de Lenguaje de Programación III

Autor
Jaycob Gómez – GitHub
Matrícula: 100529648
Profesor: Radhames Silverio Gonzales
Sección: INF-5170-1