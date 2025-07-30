import { useState, useEffect } from "react";

export default function PlanNutricionalEntreno({ GET, peso, edad, altura, sexo, objetivo }) {
  const [horaEntreno, setHoraEntreno] = useState("");
  const [tipoEntreno, setTipoEntreno] = useState("");
  const [intensidad, setIntensidad] = useState("");
  const [duracion, setDuracion] = useState("");
  const [gastoEntreno, setGastoEntreno] = useState(0);
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

  // 🔍 FUNCIÓN AUTOMÁTICA PARA CALCULAR KCAL DEL ENTRENAMIENTO
  useEffect(() => {
    const calcularGastoEntreno = () => {
      if (!tipoEntreno || !intensidad || !duracion || !peso) return;

      const tablaMET = {
        "Fuerza / Hipertrofia": { Media: 5, Alta: 6.5 },
        "HIIT / CrossFit": { Alta: 9 },
        "Cardio Largo": { Media: 6 },
        "Cardio con Series": { Alta: 8 },
        "Entrenamiento Suave / Técnica / Yoga": { Baja: 2.5 },
        "Deporte en equipo": { Alta: 8.5 },
        "Recuperación / Sin entrenamiento": { Baja: 1.5 }
      };

      const met = tablaMET?.[tipoEntreno]?.[intensidad] || 1.5;
      const kcal = (met * peso * 0.0175) * Number(duracion);
      setGastoEntreno(Math.round(kcal));
    };

    calcularGastoEntreno();
  }, [tipoEntreno, intensidad, duracion, peso]);

  const generarPlan = async () => {
    setCargando(true);
    setPlanGenerado(null);

    const GETconEntreno = parseFloat(GET) + gastoEntreno;

    try {
      const response = await fetch("/api/generarPlan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          edad, peso, altura, sexo,
          GET: GETconEntreno,
          objetivo,
          tipoEntreno, horaEntreno, intensidad, duracion,
          intolerancias: [...intoleranciasSeleccionadas, ...(otrasIntolerancias ? [otrasIntolerancias] : [])]
        }),
      });

      const data = await response.json();
      setPlanGenerado(data.plan || "❌ Error al generar el plan.");
    } catch {
      setPlanGenerado("❌ Ha ocurrido un error inesperado.");
    }

    setCargando(false);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white shadow-md rounded-2xl">
      <h2 className="text-2xl font-bold mb-4">🎯 Plan Nutricional Diario según tu Entrenamiento</h2>

      <button
        onClick={() => setMostrarFormulario(!mostrarFormulario)}
        className="bg-orange-10
