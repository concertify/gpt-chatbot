const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();

app.use(bodyParser.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ULTRAMSG_INSTANCE = process.env.ULTRAMSG_INSTANCE;
const ULTRAMSG_TOKEN = process.env.ULTRAMSG_TOKEN;

app.post('/webhook', async (req, res) => {
  const message = req.body.message?.body;
  const from = req.body.message?.from;

  if (!message || !from) return res.sendStatus(400);

  try {
    // Paso 1: Llamar a Gemini API
    const geminiRes = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: message }] }]
      }
    );

    const reply =
      geminiRes.data.candidates?.[0]?.content?.parts?.[0]?.text || 'Lo siento, no tengo una respuesta.';

    // Paso
