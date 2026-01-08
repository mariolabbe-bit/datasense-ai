import { getBackendUrl } from './apiConfig';

export const sendMessageToGemini = async (message: string, token: string | null, dataContext?: any, relationships?: any[]): Promise<string> => {
    try {
        const backendUrl = getBackendUrl();

        let contextInstruction = `You are an expert data analyst AI assistant named "DataSense".
        You are currently analyzing a sales dataset for Q3 2023.
        
        Context about the data:
        - Total Revenue: $2.4M (+12.5%)
        - Net Profit: $850K (+8.1%)
        - Columns: Date, Product, Category, Region, Sales_Amount, Customer_ID.
        - There are trends showing increased sales in the "Electronics" category in September.`;

        if (dataContext) {
            contextInstruction = `You are an expert data analyst AI assistant named "DataSense".
            You are assisting the user with their uploaded data file: "${dataContext.fileName}".
            
            SUMMARY OF THE DATA:
            - Total Rows: ${dataContext.summary.totalRows}
            - Columns: ${dataContext.columns.join(', ')}
            
            ${relationships && relationships.length > 0 ? `
            RELATIONAL CONTEXT:
            This data is a result of a JOIN between multiple tables.
            Relationships defined:
            ${relationships.map(r => `- Table "${r.fromTable}" (Field: ${r.fromField}) relates to Table "${r.toTable}" (Field: ${r.toField})`).join('\n')}
            ` : ''}

            SAMPLE DATA (first row):
            ${JSON.stringify(dataContext.rows[0])}
            
            Your goal is to answer questions about this specific data accurately. 
            If the user asks for calculations, use the column names provided.
            Respond in the user's language (Spanish by default since the UI is in Spanish).`;
        }

        const response = await fetch(`${backendUrl}/api/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                message,
                context: {
                    systemInstruction: contextInstruction
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