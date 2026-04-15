export default async function handler(req, res) {
    // 1. Extraemos la llave de la bóveda secreta del servidor
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
        return res.status(500).json({ error: "Falta configurar la API Key en el servidor." });
    }

    const prompt = `
        Busca mentalmente las noticias más recientes sobre la administración de EEUU o geopolítica global de hoy. 
        Evalúa la volatilidad del mercado del 50 al 95 basándote en eso.
        Responde ESTRICTAMENTE con un objeto JSON válido, sin usar markdown ni comillas invertidas, con esta estructura:
        {"risk": 85, "text": "Resumen en 8 palabras de la noticia", "alert": true}
        (Pon alert en true solo si el riesgo es mayor a 80).
    `;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });

        const data = await response.json();
        
        if (!response.ok) throw new Error(data.error?.message || "Error de Google");

        let textResponse = data.candidates[0].content.parts[0].text;
        textResponse = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
        
        res.status(200).json(JSON.parse(textResponse));

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
