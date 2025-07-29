import OpenAI from 'openai';
import promptTemplate from './prompt_plan.js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY1 // asegúrate de que esté bien escrita en Vercel
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const {
    edad,
    peso,
    altura,
    sexo,
    GET,
    objetivo,
    tipoEntreno,
    horaEntreno,
    intensidad,
    duracion,
    intolerancias,
  } = req.body;

  const datosUsuario = `
EDAD: ${edad}
PESO: ${peso}
ALTURA: ${altura}
SEXO: ${sexo}
GET según objetivo: ${GET} kcal
OBJETIVO: ${objetivo}

ENTRENAMIENTO:
- Tipo: ${tipoEntreno}
- Hora: ${horaEntreno}
- Intensidad: ${intensidad}
- Duración: ${duracion} min

INTOLERANCIAS: ${intolerancias?.join(', ') || 'Ninguna'}
`;

  const promptFinal = `${promptTemplate}\n\nDatos del usuario:\n${datosUsuario}`;

  try {
    // 1. Crear thread
    const thread = await openai.beta.threads.create();

    // 2. Añadir mensaje del usuario
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: promptFinal,
    });

    // 3. Ejecutar el asistente
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: "asst_EoXmMOlc4BvPgysPIWYR0mri"
    });

    // 4. Esperar a que termine
    let status;
    do {
      await new Promise(resolve => setTimeout(resolve, 1500));
      status = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    } while (status.status !== "completed" && status.status !== "failed");

    if (status.status === "failed") {
      return res.status(500).json({ error: "El asistente no pudo completar la tarea." });
    }

    // 5. Recuperar los mensajes generados
    const messages = await openai.beta.threads.messages.list(thread.id);
    const respuesta = messages.data
      .filter(m => m.role === "assistant")
      .map(m => m.content.map(c => c.text.value).join("\n"))
      .join("\n");

    return res.status(200).json({ plan: respuesta });

  } catch (error) {
    console.error("🔴 Error en el asistente:", error);
    return res.status(500).json({ error: error.message || "Error desconocido con el asistente" });
  }
}
