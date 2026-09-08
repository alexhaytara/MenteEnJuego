import React, { useState } from 'react'

interface ProgressProps {
  userName?: string
  userPosition?: string
}

export const Progress: React.FC<ProgressProps> = ({
  userName = 'Atleta',
  userPosition = 'Punta',
}) => {
  const [timeRange, setTimeRange] = useState<'semana' | 'mes'>('semana')

  // Datos de prueba simulados
  const weeklyStats = [
    { day: 'Lun', energy: 4, focus: 5, trained: true },
    { day: 'Mar', energy: 5, focus: 4, trained: true },
    { day: 'Mié', energy: 2, focus: 3, trained: false }, // Día bajo por exámenes/estrés
    { day: 'Jue', energy: 4, focus: 4, trained: true },
    { day: 'Vie', energy: 3, focus: 2, trained: false },
    { day: 'Sáb', energy: 5, focus: 5, trained: true },
    { day: 'Dom', energy: 4, focus: 4, trained: false },
  ]

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-8">
      {/* Encabezado y Filtro */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800">Mi Progreso Integrado</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Analiza cómo evoluciona tu rendimiento físico y tu estabilidad emocional.
          </p>
        </div>

        <div className="flex bg-slate-200/70 p-1 rounded-xl text-xs font-bold w-fit">
          <button
            onClick={() => setTimeRange('semana')}
            className={`px-4 py-2 rounded-lg transition-all ${
              timeRange === 'semana'
                ? 'bg-white text-purple-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Esta Semana
          </button>
          <button
            onClick={() => setTimeRange('mes')}
            className={`px-4 py-2 rounded-lg transition-all ${
              timeRange === 'mes'
                ? 'bg-white text-purple-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Último Mes
          </button>
        </div>
      </div>

      {/* Tarjetas de Métricas Clave */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Metric 1 */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs space-y-1">
          <span className="text-2xl">🔥</span>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Constancia
          </p>
          <p className="text-xl font-black text-slate-800">4 / 6 Días</p>
          <p className="text-[10px] text-purple-700 font-semibold">Entrenamientos Cumplidos</p>
        </div>

        {/* Metric 2 */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs space-y-1">
          <span className="text-2xl">🧠</span>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Enfoque Promedio
          </p>
          <p className="text-xl font-black text-slate-800">4.1 / 5.0</p>
          <p className="text-[10px] text-emerald-600 font-semibold">Excelente Nivel de Concentración</p>
        </div>

        {/* Metric 3 */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs space-y-1">
          <span className="text-2xl">⚡</span>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Nivel de Carga Mental
          </p>
          <p className="text-xl font-black text-slate-800">Equilibrado</p>
          <p className="text-[10px] text-amber-600 font-semibold">Presión bajo control esta semana</p>
        </div>

      </div>

      {/* Gráfico de Barras Emocional/Físico */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-extrabold text-slate-800 text-sm">
            Evolución Diaria: Energía vs. Enfoque
          </h3>
          <div className="flex items-center gap-3 text-[10px] font-bold">
            <span className="flex items-center gap-1 text-purple-700">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span> Energía
            </span>
            <span className="flex items-center gap-1 text-indigo-700">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-400"></span> Enfoque
            </span>
          </div>
        </div>

        {/* Simulación visual de barras */}
        <div className="grid grid-cols-7 gap-2 pt-6 items-end h-48 border-b border-slate-100 pb-2">
          {weeklyStats.map((st, i) => (
            <div key={i} className="flex flex-col items-center gap-1 h-full justify-end">
              <div className="flex items-end gap-1 w-full justify-center h-32">
                {/* Barra Energía */}
                <div
                  style={{ height: `${(st.energy / 5) * 100}%` }}
                  className="w-3.5 bg-purple-600 rounded-t-md transition-all hover:bg-purple-700"
                  title={`Energía: ${st.energy}`}
                ></div>
                {/* Barra Enfoque */}
                <div
                  style={{ height: `${(st.focus / 5) * 100}%` }}
                  className="w-3.5 bg-indigo-400 rounded-t-md transition-all hover:bg-indigo-500"
                  title={`Enfoque: ${st.focus}`}
                ></div>
              </div>
              <span className="text-[10px] font-bold text-slate-500 mt-2">{st.day}</span>
              <span className="text-[9px]">
                {st.trained ? '🏐' : '😴'}
              </span>
            </div>
          ))}
        </div>

        <p className="text-[10px] text-slate-400 text-center italic">
          💡 Nota: Las caídas de energía a mitad de semana coinciden con días de descanso o alta carga académica.
        </p>
      </div>

      {/* Alerta de Carga Académica & Deportiva */}
      <div className="bg-gradient-to-r from-purple-700 to-indigo-800 rounded-3xl p-6 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full border border-white/20">
            Consejo Psicológico Personalizado ({userPosition})
          </span>
          <h4 className="text-base font-extrabold mt-2">
            "Prioriza la calidad de sueño antes de los partidos"
          </h4>
          <p className="text-xs text-purple-200">
            Detectamos que tus mejores niveles de rendimiento ocurren cuando registras 4 o más puntos de energía pre-entreno.
          </p>
        </div>

        <button className="bg-white text-purple-700 font-bold px-4 py-3 rounded-xl text-xs hover:bg-purple-50 transition-all flex-shrink-0 active:scale-95 shadow-sm">
          Ver Estrategia de Descanso ➔
        </button>
      </div>
    </div>
  )
}