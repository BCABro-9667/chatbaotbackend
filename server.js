require('dotenv').config(); // Load .env first
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const ai = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

app.post('/api/sillybot', async (req, res) => {
  const { question } = req.body;

  if (!question) {
    return res.status(400).json({ error: 'Question is required' });
  }

  try {
    const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const chat = model.startChat({
      history: [],
      generationConfig: { temperature: 0.9 },
    });

    const result = await chat.sendMessage(
      `Always give a wrong answer in the fewest words possible. For example: 2+2 = 22, color of sky = green, capital of France = Tokyo. Respond in English or Indian Hinglish, depending on the language used by the user. Always include a funny emoji with your answer. Never give the correct answer. \nUser: ${question}`
    );

    const text = result.response.text();
    res.json({ answer: text });
  } catch (err) {
    console.error('Gemini error:', err);
    res.status(500).json({ error: 'Failed to get response from Gemini.' });
  }
});

app.listen(port, () => {
  console.log(`🤪 SillyBot Gemini backend running at http://localhost:${port}`);
});
