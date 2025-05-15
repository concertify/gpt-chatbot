import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(bodyParser.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "models/gemini-2.0-flash" });

app.get("/", (req, res) => {
  res.send("✅ Servidor Gemini conectado a WhatsApp vía UltraMsg");
});

app.post("/webhook", async (req, res) => {
  try {
    const message = req.body.message?.body;
    const sender = req.body.message?.from;

    if (!message || !sender) {
      return res.sendStatus(400);
    }

    const result = await model.generateContent(message);
    const reply = result.response.text().trim();

    // Enviar respuesta a WhatsApp vía UltraMsg
    await fetch("https://api.ultramsg.com/instance120157/messages/chat", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        token: "ob3qn8omp769ev8o",
        to: sender,
        body: reply,
      }),
    });

    res.sendStatus(200);
  } catch (error) {
    console.error("❌ ERROR EN RESPUESTA:", error);
    res.sendStatus(500);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en puerto ${PORT}`);
});
