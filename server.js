import express from "express";
import bodyParser from "body-parser";
import { Configuration, OpenAIApi } from "openai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(bodyParser.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.get("/", (req, res) => {
  res.send("✅ Servidor GPT-3.5-Turbo activo en Render con Node 24");
});

app.post("/webhook", async (req, res) => {
  try {
    const userInput = req.body.queryResult.queryText;

    const response = await openai.createChatCompletion({
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

    const reply = response.data.choices[0].message.content.trim();
    res.json({ fulfillmentText: reply });
  } catch (error) {
    console.error("❌ ERROR GPT:", error.message);
    res.json({
      fulfillmentText: "Ocurrió un error al procesar tu mensaje con GPT.",
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
