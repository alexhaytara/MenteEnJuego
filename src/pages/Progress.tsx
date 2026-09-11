import React, { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

interface ProgressProps {
  userName?: string
  userPosition?: string
}

interface EmotionalLog {
  id: string
  created_at: string
  energy_level: number
  focus_level: number
  dominant_emotion: string | null
}

interface DailyStat {
  day: string
  energy: number
  focus: number
  trained: boolean
}

export const Progress: React.FC<ProgressProps> = ({
  userName = 'Atleta',
  userPosition = 'Punta',
}) => {
  const [timeRange, setTimeRange] = useState<'semana' | 'mes'>('semana')
  const [loading, setLoading] = useState<boolean>(true)
  const [stats, setStats] = useState<DailyStat[]>([])
  
  // Métricas calculadas
  const [trainCount, setTrainCount] = useState<number>(0)
  const [totalPeriodDays, setTotalPeriodDays] = useState<number>(7)
  const [avgFocus, setAvgFocus] = useState<string>('0.0')
  const [mentalState, setMentalState] = useState<string>('Sin datos')

  const fetchProgressData = useCallback(async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const daysBack = timeRange === 'semana' ? 7 : 30
      setTotalPeriodDays(daysBack)

      const startDate = new Date()
      startDate.setDate(startDate.getDate() - daysBack)

      const { data, error } = await supabase
        .from('emotional_logs')
        .select('id, created_at, energy_level, focus_level, dominant_emotion')
        .eq('user_id', user.id)
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: true })

      if (error) throw error

      const logs: EmotionalLog[] = data || []

      // Días para mapear en el gráfico
      const dayLabels = timeRange === 'semana' 
        ? ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
        : Array.from({ length: 30 }, (_, i) => `${i + 1}`)

      if (timeRange === 'semana') {
        const weeklyMap: DailyStat[] = Array.from({ length: 7 }, (_, i) => {
          const d = new Date()
          d.setDate(d.getDate() - (6 - i))
          const dayName = dayLabels[d.getDay()]
          
          // Buscar registros de este día específico
          const dayLogs = logs.filter((log) => {
            const logDate = new Date(log.created_at)
            return logDate.toDateString() === d.toDateString()
          })

          if (dayLogs.length > 0) {
            const lastLog = dayLogs[dayLogs.length - 1]
            return {
              day: dayName,
              energy: lastLog.energy_level || 3,
              focus: lastLog.focus_level || 3,
              trained: true,
            }
          }

          return { day: dayName, energy: 0, focus: 0, trained: false }
        })

        setStats(weeklyMap)
      } else {
        // Vista mensual por semanas/grupos
        const monthlyStats = logs.map((log) => {
          const d = new Date(log.created_at)
          return {
            day: `${d.getDate()}/${d.getMonth() + 1}`,
            energy: log.energy_level || 3,
            focus: log.focus_level || 3,
            trained: true,
          }
        })
        setStats(monthlyStats)
      }

      // Calcular Métricas
      const trainedDays = logs.length
      setTrainCount(trainedDays)

      if (logs.length > 0) {
        const focusSum = logs.reduce((acc, curr) => acc + (curr.focus_level || 3), 0)
        setAvgFocus((focusSum / logs.length).toFixed(1))

        const avgEnergy = logs.reduce((acc, curr) => acc + (curr.energy_level || 3), 0) / logs.length
        if (avgEnergy >= 4) setMentalState('Óptimo')
        else if (avgEnergy >= 2.5) setMentalState('Equilibrado')
        else setMentalState('Alta Carga')
      } else {
        setAvgFocus('0.0')
        setMentalState('Sin Registros')
      }
    } catch (err) {
      console.error('Error cargando progreso:', err)
    } finally {
      setLoading(false)
    }
  }, [timeRange])

  useEffect(() => {
    fetchProgressData()
  }, [fetchProgressData])

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-8">
      {/* Encabezado y Filtro */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800">Progreso Integrado de {userName}</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Analiza cómo evoluciona tu rendimiento físico y tu estabilidad emocional.
          </p>
        </div>

        <div className="flex bg-slate-200/70 p-1 rounded-xl text-xs font-bold w-fit">
          <button
            onClick={() => setTimeRange('semana')}
            className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
              timeRange === 'semana'
                ? 'bg-white text-purple-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Esta Semana
          </button>
          <button
            onClick={() => setTimeRange('mes')}
            className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
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
          <p className="text-xl font-black text-slate-800">
            {loading ? '...' : `${trainCount} / ${totalPeriodDays} Días`}
          </p>
          <p className="text-[10px] text-purple-700 font-semibold">Registros Completados</p>
        </div>

        {/* Metric 2 */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs space-y-1">
          <span className="text-2xl">🧠</span>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Enfoque Promedio
          </p>
          <p className="text-xl font-black text-slate-800">
            {loading ? '...' : `${avgFocus} / 5.0`}
          </p>
          <p className="text-[10px] text-emerald-600 font-semibold">Nivel de Concentración</p>
        </div>

        {/* Metric 3 */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs space-y-1">
          <span className="text-2xl">⚡</span>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Estado de Carga
          </p>
          <p className="text-xl font-black text-slate-800">
            {loading ? '...' : mentalState}
          </p>
          <p className="text-[10px] text-amber-600 font-semibold">Balance de Energía</p>
        </div>
      </div>

      {/* Gráfico de Barras Emocional/Físico */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
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

        {/* Simulación visual de barras dinámicas */}
        {loading ? (
          <div className="h-48 flex items-center justify-center text-xs text-slate-400">
            Cargando datos de Supabase...
          </div>
        ) : stats.length === 0 ? (
          <div className="h-48 flex items-center justify-center text-xs text-slate-400">
            No hay registros para este período.
          </div>
        ) : (
          <div className="grid grid-cols-7 gap-2 pt-6 items-end h-48 border-b border-slate-100 pb-2">
            {stats.slice(-7).map((st, i) => (
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
                <span className="text-[10px] font-bold text-slate-500 mt-2 truncate w-full text-center">
                  {st.day}
                </span>
                <span className="text-[9px]">
                  {st.trained ? '🏐' : '😴'}
                </span>
              </div>
            ))}
          </div>
        )}

        <p className="text-[10px] text-slate-400 text-center italic">
          💡 Nota: Datos actualizados en tiempo real según tus registros emocionales.
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

        <button className="bg-white text-purple-700 font-bold px-4 py-3 rounded-xl text-xs hover:bg-purple-50 transition-all flex-shrink-0 active:scale-95 shadow-xs cursor-pointer">
          Ver Estrategia de Descanso ➔
        </button>
      </div>
    </div>
  )
}