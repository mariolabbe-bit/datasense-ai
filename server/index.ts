import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Inicialización de Gemini con la SDK estándar
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.post('/api/chat', async (req, res) => {
    const { message, context } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            systemInstruction: context?.systemInstruction || "Eres un experto analista de datos."
        });

        // Usamos generateContent directamente para mayor simplicidad y evitar problemas de estado de sesión
        const result = await model.generateContent(message);
        const response = await result.response;
        const text = response.text();

        res.json({ text: text || "No response generated." });
    } catch (error: any) {
        console.error('Gemini Error:', error);
        res.status(500).json({
            error: 'Failed to communicate with Gemini',
            message: error.message
        });
    }
});

app.listen(port, () => {
    console.log(`Backend running at http://localhost:${port}`);
});
