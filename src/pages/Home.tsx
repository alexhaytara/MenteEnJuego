import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { MOOD_RESPONSES, type MoodType } from '../data/emotionsData'

// Importación de las imágenes PNG desde el Frontend
import puntaImg from '../assets/punta.png'
import centralImg from '../assets/central.png'
import liberoImg from '../assets/libero.png'
import armadorImg from '../assets/armador.png'
import opuestoImg from '../assets/opuesto.png'

interface HomeProps {
  userName: string
  userAge: number
  userPosition?: string
  onNavigateToRegister?: () => void
}

interface DayStatus {
  name: string
  trained: boolean
  mood: string | null
}

export const Home: React.FC<HomeProps> = ({ 
  userName, 
  userAge, 
  userPosition = 'Punta',
  onNavigateToRegister 
}) => {
  const [hasRegisteredToday, setHasRegisteredToday] = useState<boolean>(true) // Oculto por defecto mientras carga
  const [weeklyDays, setWeeklyDays] = useState<DayStatus[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  // Mapa de imágenes según la posición seleccionada
  const positionImages: Record<string, string> = {
    Punta: puntaImg,
    Opuesto: opuestoImg,
    Central: centralImg,
    Libero: liberoImg,
    Armador: armadorImg,
  }

  const currentImage = positionImages[userPosition] || puntaImg

  useEffect(() => {
    const fetchHomeData = async () => {
      setLoading(true)
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        // 1. Verificar si registró HOY
        const startOfToday = new Date()
        startOfToday.setHours(0, 0, 0, 0)

        const endOfToday = new Date()
        endOfToday.setHours(23, 59, 59, 999)

        const { data: todayLog } = await supabase
          .from('emotional_logs')
          .select('id')
          .eq('user_id', user.id)
          .gte('created_at', startOfToday.toISOString())
          .lte('created_at', endOfToday.toISOString())
          .limit(1)

        setHasRegisteredToday(!!(todayLog && todayLog.length > 0))

        // 2. Obtener registros de los últimos 7 días de la semana
        const startDate = new Date()
        startDate.setDate(startDate.getDate() - 6)
        startDate.setHours(0, 0, 0, 0)

        const { data: logs } = await supabase
          .from('emotional_logs')
          .select('created_at, dominant_emotion, energy_level')
          .eq('user_id', user.id)
          .gte('created_at', startDate.toISOString())
          .order('created_at', { ascending: true })

        const dayLabels = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

        const weekMap: DayStatus[] = Array.from({ length: 7 }, (_, i) => {
          const d = new Date()
          d.setDate(d.getDate() - (6 - i))
          const dayName = dayLabels[d.getDay()]

          const dayLogs = (logs || []).filter((log) => {
            const logDate = new Date(log.created_at)
            return (
              logDate.getFullYear() === d.getFullYear() &&
              logDate.getMonth() === d.getMonth() &&
              logDate.getDate() === d.getDate()
            )
          })

          if (dayLogs.length > 0) {
            const lastLog = dayLogs[dayLogs.length - 1]
            
            // Buscar emoji correspondiente
            const foundKey = (Object.keys(MOOD_RESPONSES) as MoodType[]).find(
              (key) => MOOD_RESPONSES[key].label.toLowerCase() === lastLog.dominant_emotion?.toLowerCase()
            )

            const emoji = foundKey ? MOOD_RESPONSES[foundKey].emoji : '🏐'

            return {
              name: dayName,
              trained: true,
              mood: emoji
            }
          }

          // Sin registro = Día de Descanso
          return {
            name: dayName,
            trained: false,
            mood: null
          }
        })

        setWeeklyDays(weekMap)
      } catch (err) {
        console.error('Error cargando datos en Home:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchHomeData()
  }, [])

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Tarjeta de Perfil Personal */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-6">
        <div className="w-20 h-20 bg-purple-100 text-purple-700 rounded-2xl flex items-center justify-center text-4xl font-bold shadow-inner flex-shrink-0">
          🏐
        </div>

        <div className="text-center md:text-left space-y-1">
          <h2 className="text-2xl font-black text-slate-800">{userName}</h2>
          <div className="flex flex-wrap justify-center md:justify-start gap-2 pt-1">
            <span className="text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-100">
              {userAge} años
            </span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
              Posición: {userPosition}
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Imagen de la Posición + Registro de la Semana */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Lado Izquierdo: Imagen de la Posición */}
        <div className="md:col-span-4 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center space-y-3">
          <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
            Tu Posición
          </span>
          <div className="w-28 h-28 flex items-center justify-center p-2 bg-purple-50 rounded-2xl border border-purple-100">
            <img
              src={currentImage}
              alt={userPosition}
              className="max-h-full max-w-full object-contain"
            />
          </div>
          <div>
            <h4 className="font-extrabold text-slate-800 text-sm">{userPosition}</h4>
            <p className="text-[10px] text-purple-700 font-serif italic mt-1">
              "Diferentes posiciones, la misma pasión"
            </p>
          </div>
        </div>

        {/* Lado Derecho: Seguimiento de Entrenamientos Semanales */}
        <div className="md:col-span-8 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">
            Registro de la Semana
          </h3>

          {loading ? (
            <div className="h-24 flex items-center justify-center text-xs text-slate-400">
              Cargando registros semanales...
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
              {weeklyDays.map((d, index) => (
                <div
                  key={index}
                  className={`rounded-2xl p-2 sm:p-3 text-center border flex flex-col items-center justify-between h-24 transition-transform hover:scale-105 ${
                    d.trained
                      ? 'bg-purple-50 border-purple-200 text-purple-900'
                      : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}
                >
                  <span className="text-xs font-bold">{d.name}</span>
                  <span className="text-xl my-1">{d.trained ? d.mood : '⚪'}</span>
                  <span className="text-[9px] font-semibold uppercase">
                    {d.trained ? 'Registrado' : 'Descanso'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Cartilla informativa de Estado de Registros (Solo si NO ha registrado hoy) */}
      {!loading && !hasRegisteredToday && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-3">
            <span className="text-2xl">💡</span>
            <p className="text-xs text-amber-900 leading-relaxed font-medium">
              Aún no tienes registros emocionales completados hoy. Haz tu entrada diaria para actualizar tus estadísticas.
            </p>
          </div>
          {onNavigateToRegister && (
            <button
              onClick={onNavigateToRegister}
              className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-3 py-2 rounded-xl text-xs whitespace-nowrap transition-all shadow-xs cursor-pointer"
            >
              Registrar Ahora ➔
            </button>
          )}
        </div>
      )}

    </div>
  )
}