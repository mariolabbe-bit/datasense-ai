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

app.get('/api/models', async (req, res) => {
    try {
        // Intentaremos usar una petición fetch directa a Google para ver qué modelos ve esta IP/Clave
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
        const data = await response.json();
        res.json(data);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/chat', async (req, res) => {
    const { message, context } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    try {
        // Usamos gemini-2.0-flash que aparece explícitamente en tu lista de modelos disponibles
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash",
            systemInstruction: context?.systemInstruction || "Eres un experto analista de datos."
        });

        const result = await model.generateContent(message);
        const response = await result.response;
        const text = response.text();

        res.json({ text: text || "No response generated." });
    } catch (error: any) {
        console.error('Gemini Error:', error.message);
        res.status(500).json({
            error: 'Error de comunicación con Gemini',
            message: error.message
        });
    }
});

app.listen(port, () => {
    console.log(`Backend running at http://localhost:${port}`);
});
