const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();

app.use(bodyParser.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ULTRAMSG_INSTANCE = process.env.ULTRAMSG_INSTANCE;
const ULTRAMSG_TOKEN = process.env.ULTRAMSG_TOKEN;

// Ruta principal del bot - versión de prueba sin Gemini
app.post('/webhook', async (req, res) => {
  console.log('📩 LLEGÓ AL WEBHOOK:', JSON.stringify(req.body, null, 2));

  const from = req.body.message?.from;

  if (!from) {
    console.log('⚠️ No se recibió un número válido');
    return res.sendStatus(400);
  }

  try {
    // Enviar respuesta simple sin usar Gemini
    await axios.post(`https://api.ultramsg.com/${ULTRAMSG_INSTANCE}/messages/chat`, {
      token: ULTRAMSG_TOKEN,
      to: from,
      body: '✅ ¡Recibí tu mensaje!',
      priority: 1,
      referenceId: '',
    });

    console.log(`✅ Respondido a ${from}`);
    res.sendStatus(200);
  } catch (error) {
    console.error('❌ Error al responder:', error.response?.data || error.message);
    res.sendStatus(500);
  }
});

// Ruta de test GET y POST para debug
app.get('/test', (req, res) => {
  res.send('✅ GET /test funcionando');
});

app.post('/test', (req, res) => {
  console.log('🧪 POST recibido en /test:', JSON.stringify(req.body, null, 2));
  res.send('✅ POST /test recibido correctamente');
});

// Ruta base
app.get('/', (req, res) => {
  res.send('Bot funcionando 😎');
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));
