import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

interface MindsetButtonProps {
  onNavigate?: () => void
}

export const MindsetButton: React.FC<MindsetButtonProps> = ({ onNavigate }) => {
  const [intensityLevel, setIntensityLevel] = useState<'normal' | 'low' | 'moderate' | 'high'>('normal')
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const checkIntensity = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const startOfToday = new Date()
        startOfToday.setHours(0, 0, 0, 0)
        const endOfToday = new Date()
        endOfToday.setHours(23, 59, 59, 999)

        // Consultamos el registro de hoy
        const { data: todayLogs } = await supabase
          .from('emotional_logs')
          .select('dominant_emotion, energy_level')
          .eq('user_id', user.id)
          .gte('created_at', startOfToday.toISOString())
          .lte('created_at', endOfToday.toISOString())
          .order('created_at', { ascending: false })
          .limit(1)

        if (todayLogs && todayLogs.length > 0) {
          const log = todayLogs[0]
          const dominant = log.dominant_emotion?.toLowerCase() || ''
          const energy = log.energy_level

          // 1. Alta intensidad (Estrés, ansiedad, fatiga alta, etc.) -> Rojo / Azul
          const isHigh = 
            ['estrés', 'ansiedad', 'fatiga', 'frustración', 'enojo', 'presión'].includes(dominant) ||
            energy === 'Baja' || energy === 'Muy Alta' || energy <= 1 || energy >= 5

          // 2. Moderado (Precaución) -> Naranja / Amarillo
          const isModerate = 
            ['cansado', 'pensativo', 'serio', 'inseguro'].includes(dominant) ||
            energy === 2 || energy === 4

          // 3. Tranquilo / Equilibrado -> Verde claro / Verde oscuro
          const isLowOrBalanced = 
            ['feliz', 'motivado', 'tranquilo', 'enfocado', 'enérgico'].includes(dominant) ||
            energy === 3 || energy === 'Media'

          if (isHigh) {
            setIntensityLevel('high')
          } else if (isModerate) {
            setIntensityLevel('moderate')
          } else if (isLowOrBalanced) {
            setIntensityLevel('low')
          } else {
            setIntensityLevel('normal')
          }
        }
      } catch (err) {
        console.error('Error verificando intensidad emocional:', err)
      } finally {
        setLoading(false)
      }
    }

    checkIntensity()
  }, [])

  if (loading) {
    return (
      <div className="w-full h-10 bg-slate-100 rounded-xl animate-pulse" />
    )
  }

  // 🎨 Definición de estilos
  let buttonStyles = "w-full bg-white text-purple-900 hover:bg-purple-50 border border-purple-100 text-xs font-bold py-2.5 px-4 rounded-xl transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2"
  let buttonText = "🧠 Ir a la guía de Mente en Juego"

  if (intensityLevel === 'high') {
    // 🔴🔵 Alta intensidad: Rojo con acentos/fondo azul (Fijo, sin parpadear)
    buttonStyles = "w-full bg-gradient-to-r from-red-600 to-blue-600 hover:opacity-95 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
    buttonText = "⚠️ Alta Carga - Ir a la guía de Mente en Juego"
  } else if (intensityLevel === 'moderate') {
    // 🟠🟡 Moderado: Naranja con amarillo
    buttonStyles = "w-full bg-gradient-to-r from-amber-500 to-yellow-400 hover:opacity-95 text-slate-900 text-xs font-bold py-2.5 px-4 rounded-xl transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2"
    buttonText = "⚡ Estado Moderado - Ir a la guía de Mente en Juego"
  } else if (intensityLevel === 'low') {
    // 🟢 Tranquilo: Verde claro con verde oscuro
    buttonStyles = "w-full bg-gradient-to-r from-emerald-400 to-emerald-700 hover:opacity-95 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2"
    buttonText = "🌱 Todo Equilibrado - Ir a la guía de Mente en Juego"
  }

  return (
    <button
      type="button"
      onClick={onNavigate || (() => {})}
      className={buttonStyles}
    >
      <span>{buttonText}</span>
    </button>
  )
}