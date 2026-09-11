import React, { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

interface ProgressProps {
  userName?: string
  userPosition?: string
  onNavigateToStrategies?: () => void
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
  onNavigateToStrategies,
}) => {
  const [timeRange, setTimeRange] = useState<'semana' | 'mes'>('semana')
  const [loading, setLoading] = useState<boolean>(true)
  const [stats, setStats] = useState<DailyStat[]>([])

  // Métricas calculadas
  const [trainCount, setTrainCount] = useState<number>(0)
  const [totalPeriodDays, setTotalPeriodDays] = useState<number>(7)
  const [avgFocus, setAvgFocus] = useState<string>('--')
  const [mentalState, setMentalState] = useState<string>('--')

  const fetchProgressData = useCallback(async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const daysBack = timeRange === 'semana' ? 7 : 30
      setTotalPeriodDays(daysBack)

      // Definir la fecha límite de inicio (hace X días a las 00:00:00)
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - (daysBack - 1))
      startDate.setHours(0, 0, 0, 0)

      const { data, error } = await supabase
        .from('emotional_logs')
        .select('id, created_at, energy_level, focus_level, dominant_emotion')
        .eq('user_id', user.id)
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: true })

      if (error) throw error

      const logs: EmotionalLog[] = data || []
      const dayLabels = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

      if (timeRange === 'semana') {
        // Generar los últimos 7 días exactamente hasta HOY
        const weeklyMap: DailyStat[] = Array.from({ length: 7 }, (_, i) => {
          const d = new Date()
          d.setDate(d.getDate() - (6 - i))
          const dayName = dayLabels[d.getDay()]

          // Comparar año, mes y día local para evitar fallos por zonas horarias
          const dayLogs = logs.filter((log) => {
            const logDate = new Date(log.created_at)
            return (
              logDate.getFullYear() === d.getFullYear() &&
              logDate.getMonth() === d.getMonth() &&
              logDate.getDate() === d.getDate()
            )
          })

          if (dayLogs.length > 0) {
            const lastLog = dayLogs[dayLogs.length - 1]
            return {
              day: dayName,
              energy: lastLog.energy_level ?? 0,
              focus: lastLog.focus_level ?? 0,
              trained: true,
            }
          }

          return { day: dayName, energy: 0, focus: 0, trained: false }
        })

        setStats(weeklyMap)
      } else {
        const monthlyStats = logs.map((log) => {
          const d = new Date(log.created_at)
          return {
            day: `${d.getDate()}/${d.getMonth() + 1}`,
            energy: log.energy_level ?? 0,
            focus: log.focus_level ?? 0,
            trained: true,
          }
        })
        setStats(monthlyStats)
      }

      // Calcular Métricas solo con registros existentes
      const trainedDays = logs.length
      setTrainCount(trainedDays)

      if (logs.length > 0) {
        const focusSum = logs.reduce((acc, curr) => acc + (curr.focus_level ?? 0), 0)
        setAvgFocus((focusSum / logs.length).toFixed(1))

        const avgEnergy = logs.reduce((acc, curr) => acc + (curr.energy_level ?? 0), 0) / logs.length
        if (avgEnergy >= 4) setMentalState('Óptimo')
        else if (avgEnergy >= 2.5) setMentalState('Equilibrado')
        else setMentalState('Alta Carga')
      } else {
        // Usuario sin registros
        setAvgFocus('--')
        setMentalState('--')
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
        {/* Constancia */}
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

        {/* Enfoque Promedio */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs space-y-1">
          <span className="text-2xl">🧠</span>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Enfoque Promedio
          </p>
          <p className="text-xl font-black text-slate-800">
            {loading ? '...' : avgFocus === '--' ? '--' : `${avgFocus} / 5.0`}
          </p>
          <p className="text-[10px] text-emerald-600 font-semibold">Nivel de Concentración</p>
        </div>

        {/* Estado de Carga */}
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

        {/* Renderizado de barras dinámicas */}
        {loading ? (
          <div className="h-48 flex items-center justify-center text-xs text-slate-400">
            Cargando datos de Supabase...
          </div>
        ) : stats.length === 0 ? (
          <div className="h-48 flex items-center justify-center text-xs text-slate-400">
            Sin registros almacenados para este período.
          </div>
        ) : (
          <div className="grid grid-cols-7 gap-2 pt-6 items-end h-48 border-b border-slate-100 pb-2">
            {stats.slice(-7).map((st, i) => (
              <div key={i} className="flex flex-col items-center gap-1 h-full justify-end">
                <div className="flex items-end gap-1 w-full justify-center h-32">
                  {/* Barra Energía */}
                  <div
                    style={{ height: `${(st.energy / 5) * 100}%` }}
                    className={`w-3.5 rounded-t-md transition-all ${
                      st.energy > 0 ? 'bg-purple-600 hover:bg-purple-700' : 'bg-slate-100'
                    }`}
                    title={`Energía: ${st.energy}`}
                  ></div>
                  {/* Barra Enfoque */}
                  <div
                    style={{ height: `${(st.focus / 5) * 100}%` }}
                    className={`w-3.5 rounded-t-md transition-all ${
                      st.focus > 0 ? 'bg-indigo-400 hover:bg-indigo-500' : 'bg-slate-100'
                    }`}
                    title={`Enfoque: ${st.focus}`}
                  ></div>
                </div>
                <span className="text-[10px] font-bold text-slate-500 mt-2 truncate w-full text-center">
                  {st.day}
                </span>
                <span className="text-[9px]">
                  {st.trained ? '🏐' : '⚪'}
                </span>
              </div>
            ))}
          </div>
        )}

        <p className="text-[10px] text-slate-400 text-center italic">
          💡 Nota: Datos sincronizados en tiempo real con Supabase.
        </p>
      </div>

      {/* Consejo Psicológico Personalizado */}
      <div className="bg-gradient-to-r from-purple-700 to-indigo-800 rounded-3xl p-6 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full border border-white/20">
            Consejo Psicológico Personalizado ({userPosition})
          </span>
          <h4 className="text-base font-extrabold mt-2">
            "Prioriza la calidad de sueño antes de los partidos"
          </h4>
          <p className="text-xs text-purple-200">
            {trainCount > 0 
              ? 'Detectamos que tus mejores niveles de rendimiento ocurren cuando registras 4 o más puntos de energía pre-entreno.'
              : 'Completa tu primer registro emocional diario para desbloquear recomendaciones personalizadas.'
            }
          </p>
        </div>

        <button 
          onClick={onNavigateToStrategies}
          className="bg-white text-purple-700 font-bold px-4 py-3 rounded-xl text-xs hover:bg-purple-50 transition-all flex-shrink-0 active:scale-95 shadow-xs cursor-pointer"
        >
          Ver Estrategia Psicológicas ➔
        </button>
      </div>
    </div>
  )
}