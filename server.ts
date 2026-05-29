import express from "express";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-loaded Gemini AI client to prevent startup crashes if key is missing
let aiInstance: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    throw new Error("La API Key de Gemini no está configurada. Por favor, añádela en Settings > Secrets o en un archivo .env");
  }
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiInstance;
}

// Translations and prompts helper mappings
const timeOfDayNames: Record<string, string> = {
  dawn: "Amanecer (5:00 AM - 8:00 AM, momento de despertar, luces de vela, rocío, el primer rayo de sol sutil)",
  morning: "Buenos días (8:00 AM - 11:00 AM, luz fresca, taza caliente de café o té, aire renovado, lino limpio)",
  midmorning: "Media mañana (11:00 AM - 1:00 PM, luz radiante filtrada por lino blanco, actividad calmada, quietud productiva)",
  midday: "Mediodía (1:00 PM - 3:00 PM, sol directo y cenital sutil, brisa silenciosa y espacio despejado)",
  afternoon: "Media tarde (3:00 PM - 6:00 PM, luz dorada oblicua, reflejos cálidos en la pared, calma otoñal)",
  sunset: "Atardecer (6:00 PM - 8:00 PM, transición romántica de luces, cielos lilas y corales, fragilidad efímera)",
  night: "Noche (8:00 PM - 12:00 AM, lluvia fina en la ventana, luces cálidas de lámpara, quietud urbana en penumbras)",
  sleeping: "Hora de dormir (12:00 AM - 5:00 AM, silencio sagrado, cielo estrellado y luna, sábanas reconfortantes y quietud profunda)"
};

const styleNames: Record<string, string> = {
  sweet: "Dulce (tierno, cálido, reconfortante, de presencia tierna)",
  nostalgic: "Nostálgico (melancólico, evocador de recuerdos, hilos del pasado compartidos, la belleza de extrañar)",
  elegant: "Elegante (sofisticado, sobrio, sutil, de asombro silencioso y alta sensibilidad)",
  mysterious: "Misterioso (sugestivo, indirecto, intrigante, juego de palabras velado, secretos compartidos)",
  calming: "Calmante (pacífico, un refugio para el cansancio mental, que genera paz y baja pulsaciones)",
  emotional: "Emocional (profundamente conectado con impulsos del corazón, de latido sincero e indirecto)",
  inspiring: "Inspirador (alentador sutil, que ilumina la jornada, impulsa a seguir con calidez)",
  indirect: "De conexión indirecta (complicidad silenciosa, coincidencia de mentes, sincronía del destino)",
  soft_romantic: "Romántico suave (un susurro silencioso, atención delicada, sin intensidad que ahogue, adictivamente sutil)",
  deep: "Profundo (filosófico, de alma, que trasciende lo convencional e invita a reflexionar en la almohada)"
};

// Generación de mensajes
app.post("/api/generate", async (req, res) => {
  try {
    const { timeOfDay, style, modelOption } = req.body;

    const timeLabel = timeOfDayNames[timeOfDay] || timeOfDay;
    const styleLabel = styleNames[style] || style;
    
    const isPro = modelOption === "pro";
    const selectedModel = isPro ? "gemini-3.1-pro-preview" : "gemini-3.5-flash";

    console.log(`Generating message. Requested Model Option: ${modelOption} (${selectedModel})`);

    // Define a fallback list of models in order of priority to ensure uptime if quotas are exhausted
    const modelsToTry: string[] = [selectedModel];
    if (selectedModel !== "gemini-3.5-flash") {
      modelsToTry.push("gemini-3.5-flash");
    }
    if (!modelsToTry.includes("gemini-3.1-flash-lite")) {
      modelsToTry.push("gemini-3.1-flash-lite");
    }

    const client = getGeminiClient();

    // Constructing system instructions explicitly detailing strict negative constraints
    const systemInstruction = `Eres un escritor poético contemporáneo extraordinariamente sensible, sofisticado e inteligente para la aplicación "ALEX Messages".
Tu voz es madura, humana, delicada y psicológicamente envolvente. Evitas la exageración, la cursilería comercial, el exceso de adulación y la dependencia de las palabras de siempre.

TU MISIÓN:
Escribir un mensaje romántico sutil, poético y emocionalmente envolvente. Debe estar escrito de manera INDIRECTA, esquivando declaraciones burdas o explícitas. El propósito real es hacer sentir a la otra persona especial, profundamente acompañada, en paz y mentalmente conectada contigo, creando de forma natural una hermosa rutina emocional o "adicción saludable" por leer tus líneas cada día.

REGLAS DE CONTENIDO:
1. NUNCA uses ningún emoji en el mensaje.
2. NUNCA uses declaraciones obvias, sentimentalerías baratas o frases simplistas (ej. "me gustas", "te amo", "te quiero mucho").
3. QUEDAN EXTRICTAMENTE PROHIBIDAS las siguientes frases o variaciones de significado:
   - "sé que no podemos"
   - "ya hablamos de eso"
   - "me gustas"
   - "te amo"
4. Sonar como un adulto con alta inteligencia emocional: sin celos, sin control afectivo, sin dramatizar la distancia. Solo calidez, presencia calma, misterio sofisticado y atención.
5. El mensaje debe ser sumamente sutil. Quien lo lea debe sentir un vuelco tierno en el pecho, esbozar una leve sonrisa o sumergirse en una pequeña meditación poética.
6. La extensión máxima debe ser de una a tres líneas cortas y fluidas. No satures. Menos es más.

REQUISITO METAFÓRICO:
Sutiliza el mensaje fundiéndolo orgánicamente con el momento del día solicitado y el tono emocional solicitado.`;

    const instructionsPrompt = `Genera un mensaje original para el momento: "${timeLabel}" bajo el estilo emocional: "${styleLabel}".

Debes responder estrictamente en formato JSON utilizando el siguiente esquema:
{
  "message": "El mensaje poético e indirecto sin un solo emoji.",
  "atmosphereSuggestion": "Sugerencia del ambiente cinematográfico-visual muy breve y estética en español (ej. 'luz dorada de las cuatro filtrándose en el café', 'gotas de lluvia descendiendo por el panel del cristal', 'luces desenfocadas en la neblina nocturna')",
  "colorAccent": "Un color hexadecimal elegante (tipo #color) inspirado en ese momento (ej. amanecer suave, tonos cobre, lilas, azul noche místico o verde eucalipto apagado)"
}`;

    let lastError: any = null;
    let payload: any = null;
    let successfulModel: string = "";

    // Iterate through fallback models until one succeeds
    for (const modelName of modelsToTry) {
      try {
        console.log(`Connecting to Gemini. Attempting generation with model: ${modelName}`);
        const response = await client.models.generateContent({
          model: modelName,
          contents: instructionsPrompt,
          config: {
            systemInstruction,
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                message: {
                  type: Type.STRING,
                  description: "El mensaje poético sutil generado sin emojis."
                },
                atmosphereSuggestion: {
                  type: Type.STRING,
                  description: "Sugerencia de atmósfera cinematográfica muy breve."
                },
                colorAccent: {
                  type: Type.STRING,
                  description: "Color hexadecimal elegante con hashtag (#)."
                }
              },
              required: ["message", "atmosphereSuggestion", "colorAccent"]
            },
            temperature: 1.0,
          }
        });

        const textOutput = response.text;
        if (!textOutput) {
          throw new Error("Respuesta de contenido vacía o nula");
        }

        payload = JSON.parse(textOutput.trim());
        successfulModel = modelName;
        console.log(`Successfully generated message using model: ${modelName}`);
        break; // Successfully generated content, break the loop
      } catch (err: any) {
        console.warn(`Model ${modelName} failed generation or hit quota limits:`, err.message || err);
        lastError = err;
      }
    }

    if (!payload) {
      // If all models in the fallback chain failed, throw the final captured error
      throw lastError || new Error("Generación fallida en toda la cadena de modelos de Gemini.");
    }

    // Embed diagnostic info
    payload.modelUsed = successfulModel;
    res.json(payload);

  } catch (error: any) {
    console.error("Error final in /api/generate handler:", error);
    res.status(500).json({
      error: error.message || "Error insuperable al generar el mensaje"
    });
  }
});

// Configure Vite or Serve SPA static files
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ALEX Messages server running at http://localhost:${PORT}`);
  });
}

startServer();
