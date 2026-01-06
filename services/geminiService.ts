const BACKEND_URL = 'http://localhost:3001';

export const startChatSession = () => {
    // La sesión ahora se gestiona en el backend, devolvemos un identificador si fuera necesario
    return { status: "ready" };
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
    try {
        const response = await fetch(`${BACKEND_URL}/api/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message,
                context: {
                    systemInstruction: `You are an expert data analyst AI assistant named "DataSense".
                    You are currently analyzing a sales dataset for Q3 2023.
                    
                    Context about the data:
                    - Total Revenue: $2.4M (+12.5%)
                    - Net Profit: $850K (+8.1%)
                    - Columns: Date, Product, Category, Region, Sales_Amount, Customer_ID.
                    - There are trends showing increased sales in the "Electronics" category in September.
                    
                    Your goal is to help the user understand their data, answer questions about specific metrics, and suggest insights.
                    Keep answers concise, professional, and helpful. Use formatting where appropriate.`
                }
            }),
        });

        if (!response.ok) {
            throw new Error(`Error del servidor: ${response.statusText}`);
        }

        const data = await response.json();
        return data.text || "No se generó respuesta.";
    } catch (error) {
        console.error("Error al conectar con el backend:", error);
        throw error;
    }
};