import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(bodyParser.json());

// Inicializa el modelo Gemini 2.0 Flash
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "models/gemini-2.0-flash" });

app.get("/", (req, res) => {
  res.send("✅ Servidor Gemini 2.0 Flash activo y listo para responder");
});

app.post("/webhook", async (req, res) => {
  try {
    const userInput = req.body.queryResult.queryText;

    const result = await model.generateContent(userInput);
    const reply = result.response.text().trim();

    res.json({ fulfillmentText: reply });

  } catch (error) {
    console.error("❌ ERROR GEMINI:", error);
    res.json({
      fulfillmentText: "Ocurrió un error al procesar tu mensaje con Gemini.",
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor Gemini escuchando en puerto ${PORT}`);
});
