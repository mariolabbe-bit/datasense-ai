import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Inicialización de Gemini
const genAI = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || ''
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.post('/api/chat', async (req, res) => {
    const { message, context } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    try {
        const chat = genAI.chats.create({
            model: 'gemini-1.5-flash',
            config: {
                systemInstruction: context?.systemInstruction || "Eres un experto analista de datos."
            }
        });

        const result = await chat.sendMessage({ message });
        res.json({ text: result.text || "No response generated." });
    } catch (error) {
        console.error('Gemini Error:', error);
        res.status(500).json({ error: 'Failed to communicate with Gemini' });
    }
});

app.listen(port, () => {
    console.log(`Backend running at http://localhost:${port}`);
});
