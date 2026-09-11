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

const capitalizeWords = (str: string): string => {
  if (!str) return ''
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export const Home: React.FC<HomeProps> = ({ 
  userName: initialName, 
  userAge: initialAge, 
  userPosition: initialPosition = 'Punta',
  onNavigateToRegister 
}) => {
  const [profileData, setProfileData] = useState({
    name: initialName,
    age: initialAge,
    position: initialPosition,
  })

  const [hasRegisteredToday, setHasRegisteredToday] = useState<boolean>(true)
  const [weeklyDays, setWeeklyDays] = useState<DayStatus[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  const positionImages: Record<string, string> = {
    Punta: puntaImg,
    Opuesto: opuestoImg,
    Central: centralImg,
    Libero: liberoImg,
    Armador: armadorImg,
  }

  const currentImage = positionImages[profileData.position] || puntaImg

  useEffect(() => {
    let channel: any

    const setupRealtimeAndFetch = async () => {
      setLoading(true)
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        // 1. Cargar perfil inicial
        const { data: userProfile } = await supabase
          .from('profiles')
          .select('name, position, category')
          .eq('id', user.id)
          .single()

        if (userProfile) {
          const parsedAge = userProfile.category 
            ? parseInt(userProfile.category.replace(/\D/g, ''), 10) || initialAge 
            : initialAge

          setProfileData({
            name: userProfile.name || initialName,
            age: parsedAge,
            position: userProfile.position || initialPosition,
          })
        }

        // 2. Suscripción en tiempo real
        const channelId = `realtime-profile-${user.id}-${Date.now()}`
        channel = supabase.channel(channelId)
        
        channel
          .on(
            'postgres_changes',
            {
              event: 'UPDATE',
              schema: 'public',
              table: 'profiles',
              filter: `id=eq.${user.id}`,
            },
            (payload: any) => {
              const updated = payload.new
              const newAge = updated.category 
                ? parseInt(updated.category.replace(/\D/g, ''), 10) || initialAge 
                : initialAge

              setProfileData({
                name: updated.name || initialName,
                age: newAge,
                position: updated.position || initialPosition,
              })
            }
          )
          .subscribe()

        // 3. Verificar si registró HOY
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

        // 4. Obtener registros de los últimos 7 días
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

    setupRealtimeAndFetch()

    return () => {
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [])

  // Pantalla de Carga (Early return para evitar parpadeos visuales)
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-3">
        <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-semibold text-slate-500">Cargando tu plan de entrenamiento...</p>
      </div>
    )
  }

  const registeredDaysCount = weeklyDays.filter((d) => d.trained).length

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Tarjeta de Perfil Personal */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row items-center gap-6">
        <div className="w-20 h-20 bg-purple-100 text-purple-700 rounded-2xl flex items-center justify-center text-4xl font-bold shadow-inner flex-shrink-0">
          🏐
        </div>

        <div className="text-center md:text-left space-y-1">
          <h2 className="text-2xl font-black text-slate-800">
            {capitalizeWords(profileData.name)}
          </h2>
          <div className="flex flex-wrap justify-center md:justify-start gap-2 pt-1">
            <span className="text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-100">
              Sub-{profileData.age}
            </span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
              Posición: {profileData.position}
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Imagen de la Posición + Registro de la Semana */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        
        {/* Lado Izquierdo: Imagen de la Posición */}
        <div className="md:col-span-4 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col items-center justify-center text-center space-y-3">
          <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
            Tu Posición
          </span>
          <div className="w-28 h-28 flex items-center justify-center p-2 bg-purple-50 rounded-2xl border border-purple-100">
            <img
              src={currentImage}
              alt={profileData.position}
              className="max-h-full max-w-full object-contain"
            />
          </div>
          <div>
            <h4 className="font-extrabold text-slate-800 text-sm">{profileData.position}</h4>
            <p className="text-[10px] text-purple-700 font-serif italic mt-1">
              "Diferentes posiciones, la misma pasión"
            </p>
          </div>
        </div>

        {/* Lado Derecho: Seguimiento de Entrenamientos Semanales */}
        <div className="md:col-span-8 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">
                Registro de la Semana
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Has completado <strong className="text-purple-600">{registeredDaysCount} de 7 días</strong> esta semana.
              </p>
            </div>
            <span className="text-xs font-black text-purple-700 bg-purple-50 border border-purple-100 px-3 py-1 rounded-xl">
              ⚡ Racha: {registeredDaysCount}d
            </span>
          </div>

          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {weeklyDays.map((d, index) => (
              <div
                key={index}
                className={`rounded-2xl p-2 sm:p-2.5 text-center border flex flex-col items-center justify-between h-24 transition-all hover:scale-105 ${
                  d.trained
                    ? 'bg-purple-50 border-purple-200 text-purple-900 shadow-2xs'
                    : 'bg-slate-50 border-slate-100 text-slate-400'
                }`}
              >
                <span className="text-xs font-bold">{d.name}</span>
                <span className="text-xl my-1">{d.trained ? d.mood : '⚪'}</span>
                <span className="text-[8px] font-bold uppercase tracking-tight">
                  {d.trained ? 'Registrado' : 'Descanso'}
                </span>
              </div>
            ))}
          </div>

          <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 text-[11px] font-medium">
              {registeredDaysCount >= 5 
                ? '🔥 ¡Excelente constancia deportiva!' 
                : '💪 Un registro diario te ayuda a entender tu rendimiento.'}
            </span>
            <div className="w-24 bg-slate-200 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-purple-600 h-full rounded-full transition-all duration-500" 
                style={{ width: `${(registeredDaysCount / 7) * 100}%` }}
              />
            </div>
          </div>

        </div>

      </div>

      {/* Cartilla informativa si NO ha registrado hoy */}
      {!hasRegisteredToday && (
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