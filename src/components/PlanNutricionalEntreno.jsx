
import { useState } from "react";

export default function PlanNutricionalEntreno({ GET, peso, edad, altura, sexo, objetivo }) {
  const [horaEntreno, setHoraEntreno] = useState("");
  const [tipoEntreno, setTipoEntreno] = useState("");
  const [intensidad, setIntensidad] = useState("");
  const [duracion, setDuracion] = useState("");
  const [otrasIntolerancias, setOtrasIntolerancias] = useState("");
  const [intoleranciasSeleccionadas, setIntoleranciasSeleccionadas] = useState([]);
  const [planGenerado, setPlanGenerado] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const tiposEntrenamiento = [
    "Fuerza / Hipertrofia",
    "HIIT / CrossFit",
    "Cardio Largo",
    "Cardio con Series",
    "Entrenamiento Suave / Técnica / Yoga",
    "Deporte en equipo",
    "Recuperación / Sin entrenamiento",
  ];

  const intensidades = [
    { nivel: "Baja", descripcion: "Conversacional, sin fatiga." },
    { nivel: "Media", descripcion: "Moderada, ritmo constante." },
    { nivel: "Alta", descripcion: "Esfuerzo intenso, intervalos o carga alta." },
  ];

  const intoleranciasHabituales = ["Lácteos", "Gluten", "Frutos secos", "Huevos", "Soja"];

  const toggleIntolerancia = (item) => {
    setIntoleranciasSeleccionadas(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const generarPlan = async () => {
    setCargando(true);
    setPlanGenerado(null);
    try {
      const response = await fetch("/api/generarPlan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          edad, peso, altura, sexo, GET, objetivo,
          tipoEntreno, horaEntreno, intensidad, duracion,
          intolerancias: [...intoleranciasSeleccionadas, ...(otrasIntolerancias ? [otrasIntolerancias] : [])]
        }),
      });

      const data = await response.json();
      if (data.plan) {
        setPlanGenerado(data.plan);
      } else {
        setPlanGenerado("❌ Error al generar el plan. Intenta de nuevo.");
      }
    } catch (err) {
      setPlanGenerado("❌ Ha ocurrido un error inesperado.");
    }
    setCargando(false);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white shadow-md rounded-2xl">
      <h2 className="text-2xl font-bold mb-4">🎯 Plan Nutricional Diario según tu Entrenamiento</h2>

      <button
        onClick={() => setMostrarFormulario(!mostrarFormulario)}
        className="bg-orange-100 text-orange-700 px-4 py-2 rounded mb-4 hover:bg-orange-200 transition"
      >
        {mostrarFormulario ? "🔽 Ocultar formulario" : "📋 Mostrar formulario para plan personalizado"}
      </button>

      {mostrarFormulario && (
        <div className="space-y-4">
          <div>
            <label className="block font-semibold">⏰ Hora del entrenamiento</label>
            <input type="time" className="w-full p-2 border rounded" value={horaEntreno} onChange={e => setHoraEntreno(e.target.value)} />
          </div>

          <div>
            <label className="block font-semibold">🏋️ Tipo de entrenamiento</label>
            <select className="w-full p-2 border rounded" value={tipoEntreno} onChange={e => setTipoEntreno(e.target.value)}>
              <option value="">Selecciona uno</option>
              {tiposEntrenamiento.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div>
            <label className="block font-semibold">🔋 Intensidad</label>
            <div className="space-y-1">
              {intensidades.map(i => (
                <label key={i.nivel} className="flex items-center space-x-2">
                  <input type="radio" name="intensidad" value={i.nivel} onChange={e => setIntensidad(e.target.value)} />
                  <span><strong>{i.nivel}</strong>: {i.descripcion}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-semibold">⏳ Duración (minutos)</label>
            <input type="number" className="w-full p-2 border rounded" value={duracion} onChange={e => setDuracion(e.target.value)} />
          </div>

          <div>
            <label className="block font-semibold">🚫 Intolerancias habituales</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {intoleranciasHabituales.map((item) => (
                <button
                  key={item}
                  onClick={() => toggleIntolerancia(item)}
                  className={`px-3 py-1 rounded-full border ${intoleranciasSeleccionadas.includes(item) ? 'bg-orange-500 text-white' : 'bg-gray-100'}`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-semibold mt-2">📝 Otras intolerancias</label>
            <input type="text" className="w-full p-2 border rounded" value={otrasIntolerancias} onChange={e => setOtrasIntolerancias(e.target.value)} />
          </div>

          <button
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 mt-4"
            onClick={generarPlan}
            disabled={cargando}
          >
            {cargando ? "⏳ Generando..." : "🍽️ Generar Plan Diario"}
          </button>
        </div>
      )}

      {planGenerado && (
        <div className="mt-6 bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">
          <h3 className="text-xl font-bold mb-2">Resultado</h3>
          <p>{planGenerado}</p>
        </div>
      )}
    </div>
  );
}
