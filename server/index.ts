import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Gemini Configuration
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.post('/api/chat', async (req, res) => {
    const { message, context } = req.body;
    console.log('Incoming chat request');

    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-flash-latest",
            systemInstruction: (context?.systemInstruction || "Eres un experto analista de datos.") +
                "\n\nMUY IMPORTANTE: Cuando el usuario pida resúmenes, comparaciones o visualizaciones, DEBES responder incorporando etiquetas especiales para que la interfaz renderice componentes visuales:" +
                "\n1. Para TABLAS: Usa la etiqueta [TABLE] seguido de un JSON con { \"headers\": [\"col1\", ...], \"rows\": [[val1, val2], ...] } y cierra con [/TABLE]." +
                "\n2. Para GRÁFICOS: Usa la etiqueta [CHART] seguido de un JSON con { \"title\": \"...\", \"type\": \"bar|line|area|pie\", \"data\": [{ \"name\": \"...\", \"value\": 123 }, ...] } y cierra con [/CHART]." +
                "\n3. Siempre acompaña los visuales con una breve explicación en texto fuera de las etiquetas."
        });

        const result = await model.generateContent(message);
        const response = await result.response;
        const text = response.text();
        console.log('Chat response success');

        res.json({ text: text || "No response generated." });
    } catch (error: any) {
        console.error('Gemini Chat Error:', error);
        if (error.message?.includes('429') || error.message?.includes('quota')) {
            return res.status(429).json({
                error: 'Límite de cuota excedido',
                message: 'Tu clave de Gemini ha alcanzado el límite de peticiones gratuitas. Intenta de nuevo en un minuto.'
            });
        }
        res.status(500).json({
            error: 'Error de comunicación con Gemini',
            message: error.message
        });
    }
});

app.post('/api/analyze-structure', async (req, res) => {
    const { columns, sampleData } = req.body;
    console.log('Incoming analysis request for columns:', columns);

    if (!columns || !sampleData) {
        return res.status(400).json({ error: 'Columns and sampleData are required' });
    }

    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-flash-latest",
            systemInstruction: "Eres un experto visualizador de datos. Tu tarea es recomendar los mejores tipos de gráficos para un conjunto de datos basado en sus columnas y una muestra. RESPONDE ÚNICAMENTE CON JSON."
        });

        const prompt = `
            Basado en estas columnas: ${columns.join(', ')}
            Y esta muestra de datos (primeras 3 filas): ${JSON.stringify(sampleData)}
            
            Recomienda 4 visualizaciones clave. Para cada una indica:
            1. Título
            2. Tipo de gráfico (area, bar, pie, line)
            3. Eje X (columna)
            4. Eje Y o Valor (columna)
            5. Una breve explicación de por qué es importante.
            
            Responde ÚNICAMENTE en formato JSON con la siguiente estructura:
            [
                { "title": "...", "type": "...", "xAxis": "...", "yAxis": "...", "reason": "..." }
            ]
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();
        console.log('Gemini raw response (analysis length):', text.length);

        // More robust JSON extraction
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
            text = jsonMatch[0];
        } else {
            text = text.replace(/```json|```/gi, '').trim();
        }

        const recommendations = JSON.parse(text);
        console.log('Successfully parsed recommendations');
        res.json(recommendations);
    } catch (error: any) {
        console.error('Analysis Error:', error);
        res.status(500).json({
            error: 'Error al analizar la estructura',
            message: error.message
        });
    }
});

app.listen(port, () => {
    console.log(`Backend running at http://localhost:${port}`);
});
