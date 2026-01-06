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
        // Usamos 'gemini-flash-latest' que es un alias dinámico al modelo Flash más estable.
        // Según tu lista, este modelo está disponible.
        const model = genAI.getGenerativeModel({
            model: "gemini-flash-latest",
            systemInstruction: context?.systemInstruction || "Eres un experto analista de datos."
        });

        const result = await model.generateContent(message);
        const response = await result.response;
        const text = response.text();

        res.json({ text: text || "No response generated." });
    } catch (error: any) {
        console.error('Gemini Error:', error.message);

        // Si la cuota falla, damos un mensaje claro al usuario
        if (error.message.includes('429') || error.message.includes('quota')) {
            return res.status(429).json({
                error: 'Límite de cuota excedido',
                message: 'Tu clave de Gemini ha alcanzado el límite de peticiones gratuitas por hoy. Intenta de nuevo en unos minutos o verifica tu plan en Google AI Studio.'
            });
        }

        res.status(500).json({
            error: 'Error de comunicación con Gemini',
            message: error.message
        });
    }
});

app.listen(port, () => {
    console.log(`Backend running at http://localhost:${port}`);
});
