
import React, { useState } from 'react';
import PlanNutricionalEntreno from './components/PlanNutricionalEntreno';

const actividadFactor = {
  'Sedentario': [1.1, 1.2, 1.2, 1.3, 1.4, 1.5, 1.5, 1.5],
  'Ligeramente activo': [1.2, 1.4, 1.4, 1.5, 1.6, 1.7, 1.7, 1.7],
  'Activo': [1.4, 1.6, 1.6, 1.7, 1.8, 1.9, 1.9, 1.9],
  'Muy activo': [1.5, 1.8, 1.8, 1.9, 2.0, 2.1, 2.1, 2.1]
};

const objetivosMacros = {
  "Definir": { prot: 2.2, grasa: 0.8 },
  "Mantener": { prot: 1.8, grasa: 1.0 },
  "Ganar masa": { prot: 2.0, grasa: 1.1 }
};

export default function CalculadoraTMB() {
  const [sexo, setSexo] = useState('Hombre');
  const [edad, setEdad] = useState(50);
  const [peso, setPeso] = useState(71);
  const [altura, setAltura] = useState(175);
  const [actividad, setActividad] = useState('Sedentario');
  const [diasEntreno, setDiasEntreno] = useState(7);
  const [objetivo, setObjetivo] = useState('Mantener');
  const [resultados, setResultados] = useState(null);

  const calcular = () => {
    const pesoF = parseFloat(peso);
    const alturaF = parseFloat(altura);
    const edadF = parseFloat(edad);

    let hb, owen, mifflin;

    if (sexo === 'Hombre') {
      hb = 88.36 + (13.4 * pesoF) + (4.8 * alturaF) - (5.7 * edadF);
      owen = 879 + (10.2 * pesoF);
      mifflin = (10 * pesoF) + (6.25 * alturaF) - (5 * edadF) + 5;
    } else {
      hb = 447.6 + (9.2 * pesoF) + (3.1 * alturaF) - (4.3 * edadF);
      owen = 795 + (7.18 * pesoF);
      mifflin = (10 * pesoF) + (6.25 * alturaF) - (5 * edadF) - 161;
    }

    const tmb = (hb + owen + mifflin) / 3;
    const factor = actividadFactor[actividad][diasEntreno];
    const getSinTermogenesis = tmb * factor;
    const termogenesis = getSinTermogenesis * 0.10;
    const get = getSinTermogenesis + termogenesis;

    const deficit = get - 400 < 0 ? get - 400 : get * 0.85;
    const superavitConservador = get + 350;
    const superavitModerado = get + 500;
    const superavitAlto = get + 700;

    const calObjetivo = objetivo === 'Definir' ? deficit : objetivo === 'Mantener' ? get : superavitModerado;
    const { prot, grasa } = objetivosMacros[objetivo];
    const proteinas = pesoF * prot;
    const grasas = pesoF * grasa;
    const kcalProteinas = proteinas * 4;
    const kcalGrasas = grasas * 9;
    const kcalCarbs = calObjetivo - kcalProteinas - kcalGrasas;
    const carbohidratos = kcalCarbs / 4;

    setResultados({
      tmb: tmb.toFixed(0),
      get: get.toFixed(0),
      deficit: Math.round(deficit),
      superavitConservador: Math.round(superavitConservador),
      superavitModerado: Math.round(superavitModerado),
      superavitAlto: Math.round(superavitAlto),
      objetivo,
      kcal: Math.round(calObjetivo),
      proteinas: Math.round(proteinas),
      grasas: Math.round(grasas),
      carbohidratos: Math.round(carbohidratos)
    });
  };

  return (
    <div className="p-4 max-w-xl mx-auto bg-white rounded-2xl shadow-md">
      <h1 className="text-2xl font-bold mb-2 text-orange-500 text-center">Calculadora TMB & Gasto Energético</h1>
      <h2 className="text-sm text-gray-500 mb-6 text-center italic">Introduce tus datos y ajusta tu objetivo</h2>

      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mb-6">
        <div className="grid gap-4">
          <div>
            <label>Sexo:</label>
            <select value={sexo} onChange={e => setSexo(e.target.value)} className="w-full border p-2 rounded">
              <option>Hombre</option>
              <option>Mujer</option>
            </select>
          </div>
          <div>
            <label>Edad:</label>
            <input type="number" value={edad} onChange={e => setEdad(e.target.value)} className="w-full border p-2 rounded" />
          </div>
          <div>
            <label>Peso (kg):</label>
            <input type="number" value={peso} onChange={e => setPeso(e.target.value)} className="w-full border p-2 rounded" />
          </div>
          <div>
            <label>Altura (cm):</label>
            <input type="number" value={altura} onChange={e => setAltura(e.target.value)} className="w-full border p-2 rounded" />
          </div>
          <div>
            <label>Actividad diaria (sin contar entreno):</label>
            <select value={actividad} onChange={e => setActividad(e.target.value)} className="w-full border p-2 rounded">
              <option>Sedentario</option>
              <option>Ligeramente activo</option>
              <option>Activo</option>
              <option>Muy activo</option>
            </select>
          </div>
          <div>
            <label>Días de entrenamiento por semana (0 a 7):</label>
            <input type="range" min="0" max="7" value={diasEntreno} onChange={e => setDiasEntreno(Number(e.target.value))} className="w-full" />
            <div className="text-center font-semibold text-orange-600">{diasEntreno} días</div>
          </div>
          <div>
            <label>Objetivo:</label>
            <select value={objetivo} onChange={e => setObjetivo(e.target.value)} className="w-full border p-2 rounded">
              <option>Definir</option>
              <option>Mantener</option>
              <option>Ganar masa</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-center mb-6">
        <button onClick={calcular} className="bg-orange-500 text-white px-6 py-2 rounded-xl shadow hover:bg-orange-600 transition-all duration-300">Calcular</button>
      </div>

      {resultados && (
        <>
          <div className="bg-orange-50 p-6 rounded-xl shadow-inner space-y-3">
            <p><strong>🔥 TMB promedio:</strong> {resultados.tmb} kcal</p>
            <p><strong>⚖️ GET (mantenimiento):</strong> {resultados.get} kcal</p>
            <p><strong>📉 Déficit recomendado:</strong> {resultados.deficit} kcal</p>
            <p><strong>📈 Superávit conservador:</strong> {resultados.superavitConservador} kcal</p>
            <p><strong>💪 Superávit normal:</strong> {resultados.superavitModerado} kcal</p>
            <p><strong>🍽️ Superávit alto:</strong> {resultados.superavitAlto} kcal</p>
            <hr className="my-4" />
            <p className="text-lg font-bold text-orange-600">🍎 Recomendación de macronutrientes ({resultados.objetivo}):</p>
            <p><strong>🔹 Calorías objetivo:</strong> {resultados.kcal} kcal</p>
            <p><strong>🥚 Proteínas:</strong> {resultados.proteinas} g</p>
            <p><strong>🥑 Grasas:</strong> {resultados.grasas} g</p>
            <p><strong>🍞 Carbohidratos:</strong> {resultados.carbohidratos} g</p>
          </div>

          <div className="mt-10">
            <PlanNutricionalEntreno
              GET={parseFloat(resultados.kcal)}
              peso={peso}
              edad={edad}
              altura={altura}
              sexo={sexo}
              objetivo={objetivo}
            />
          </div>
        </>
      )}
    </div>
  );
}
