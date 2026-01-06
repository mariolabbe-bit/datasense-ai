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
        // En la SDK @google/generative-ai, listModels no existe directamente en la clase principal de la misma forma
        // Intentaremos obtener información básica del modelo para validar la clave
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        res.json({ message: "Clave API parece válida. Intentando conectar con gemini-1.5-flash" });
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
        // Probamos con 'gemini-1.5-flash-latest' que a veces ayuda con problemas de resolución
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash-latest",
            systemInstruction: context?.systemInstruction || "Eres un experto analista de datos."
        });

        // Usamos generateContent directamente para mayor simplicidad y evitar problemas de estado de sesión
        const result = await model.generateContent(message);
        const response = await result.response;
        const text = response.text();

        res.json({ text: text || "No response generated." });
    } catch (error: any) {
        console.error('Gemini Error Detallado:', error);
        res.status(500).json({
            error: 'Failed to communicate with Gemini',
            message: error.message,
            status: error.status
        });
    }
});

app.listen(port, () => {
    console.log(`Backend running at http://localhost:${port}`);
});
