import React, { useState } from 'react';
import PlanNutricionalEntreno from './components/PlanNutricionalEntreno';

const objetivosMacros = {
  "Definir": { prot: 2.2, grasa: 0.8 },
  "Mantener": { prot: 1.8, grasa: 1.0 },
  "Ganar masa": { prot: 2.0, grasa: 1.1 }
};

const neatFactors = {
  'Muy bajo': 1.1,
  'Bajo': 1.2,
  'Medio': 1.3,
  'Alto': 1.4
};

export default function CalculadoraTMB() {
  const [sexo, setSexo] = useState('Hombre');
  const [edad, setEdad] = useState(50);
  const [peso, setPeso] = useState(71);
  const [altura, setAltura] = useState(175);
  const [neatNivel, setNeatNivel] = useState('Bajo');
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
    const factorNEAT = neatFactors[neatNivel];
    const getBaseSinTEF = tmb * factorNEAT;
    const tef = getBaseSinTEF * 0.10;
    const getBase = getBaseSinTEF + tef;

    setResultados({
      tmb: tmb.toFixed(0),
      getBase: getBase.toFixed(0),
      neatNivel,
      factorNEAT
    });
  };

  return (
    <div className="p-4 max-w-xl mx-auto bg-white rounded-2xl shadow-md">
      <h1 className="text-2xl font-bold mb-2 text-orange-500 text-center">Calculadora TMB & Gasto Energético Base</h1>
      <h2 className="text-sm text-gray-500 mb-6 text-center italic">Introduce tus datos y estima tu GET sin ejercicio</h2>

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
            <label>Movimiento diario (NEAT):</label>
            <select value={neatNivel} onChange={e => setNeatNivel(e.target.value)} className="w-full border p-2 rounded">
              <option>Muy bajo</option>
              <option>Bajo</option>
              <option>Medio</option>
              <option>Alto</option>
            </select>
            <p className="text-sm text-gray-500 mt-1 italic">Estima según tus pasos diarios: &lt;4k = muy bajo, &gt;10k = alto</p>
          </div>
          <div>
            <label>Objetivo (sin efecto por ahora):</label>
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
            <p><strong>🚶 NEAT estimado:</strong> {resultados.neatNivel} (factor {resultados.factorNEAT})</p>
            <p><strong>⚖️ GET base (sin ejercicio):</strong> {resultados.getBase} kcal</p>
            <p className="text-sm text-gray-500 italic">El gasto por entrenamiento se calculará aparte.</p>
          </div>

          <div className="mt-10">
            <PlanNutricionalEntreno
              GET={parseFloat(resultados.getBase)}
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
