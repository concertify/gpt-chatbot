import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.get("/", (req, res) => {
  res.send("✅ Servidor GPT-3.5-Turbo activo en Render con ESM y Node 24");
});

app.post("/webhook", async (req, res) => {
  try {
    const userInput = req.body.queryResult.queryText;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Responde en español con claridad, ejemplos o listas si es útil.",
        },
        {
          role: "user",
          content: userInput,
        },
      ],
    });

    const reply = response.choices[0].message.content.trim();
    res.json({ fulfillmentText: reply });

  } catch (error) {
    console.error("❌ ERROR GPT:", error);
    res.json({
      fulfillmentText: "Ocurrió un error al procesar tu mensaje con GPT.",
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
