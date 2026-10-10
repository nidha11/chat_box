import "dotenv/config";
import express from "express";
import OpenAI from "openai";

const app = express();
const port = 3000;

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.use(express.json());
app.use(express.static("."));

app.post("/api/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!userMessage) {
      return res.status(400).json({
        error: "Message is required"
      });
    }

    const response = await client.responses.create({
      model: "gpt-5",
      instructions:
        "You are a helpful, friendly AI chatbot. Answer the user's questions clearly and naturally.",
      input: userMessage
    });

    res.json({
      reply: response.output_text
    });

  } catch (error) {
    console.error("OpenAI Error:", error);

    res.status(500).json({
      error: "AI response failed"
    });
  }
});

app.listen(port, () => {
  console.log(`Chatbot running at http://localhost:${port}`);
});