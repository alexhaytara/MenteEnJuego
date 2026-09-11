import React, { useState, useEffect } from 'react'
import { MOOD_RESPONSES, FEELING_TAGS, type MoodType } from '../data/emotionsData'
import yogaIcon from '../assets/yoga-icon.png'

// Importamos la conexión de Supabase
import { supabase } from '../lib/supabase'

// Definición de etiquetas opuestas que no pueden coexistir
const OPPOSITE_TAGS: Record<string, string> = {
  'Energía': 'Cansancio',
  'Cansancio': 'Energía',
  'Confianza': 'Frustración',
  'Frustración': 'Confianza',
  'Estrés': 'Satisfacción',
  'Satisfacción': 'Estrés'
}

export const EmotionalRegister: React.FC = () => {
  const [step, setStep] = useState<number>(1)
  const [selectedMood, setSelectedMood] = useState<MoodType>('bien')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [note, setNote] = useState<string>('')
  const [progress, setProgress] = useState<number>(0)

  // Estados de carga y error para la base de datos
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [isLoadingCheck, setIsLoadingCheck] = useState<boolean>(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [hasRegisteredToday, setHasRegisteredToday] = useState<boolean>(false)

  // Consultar si ya existe un registro creado hoy y cargar sus datos exactos
  useEffect(() => {
    const checkIfRegisteredToday = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          setIsLoadingCheck(false)
          return
        }

        const startOfDay = new Date()
        startOfDay.setHours(0, 0, 0, 0)
        
        const endOfDay = new Date()
        endOfDay.setHours(23, 59, 59, 999)

        // Traemos también dominant_emotion y notes
        const { data, error } = await supabase
          .from('emotional_logs')
          .select('energy_level, dominant_emotion, notes, created_at')
          .eq('user_id', user.id)
          .gte('created_at', startOfDay.toISOString())
          .lte('created_at', endOfDay.toISOString())
          .order('created_at', { ascending: false })
          .limit(1)

        if (error) throw error

        if (data && data.length > 0) {
          setHasRegisteredToday(true)
          const lastLog = data[0]

          // 1. Buscar la clave de MoodType basada en la etiqueta o nivel guardado
          const foundMoodKey = (Object.keys(MOOD_RESPONSES) as MoodType[]).find(
            (key) => MOOD_RESPONSES[key].label.toLowerCase() === lastLog.dominant_emotion?.toLowerCase()
          )

          if (foundMoodKey) {
            setSelectedMood(foundMoodKey)
          } else {
            // Fallback por nivel de energía en caso de que no coincida la etiqueta
            const moodByLevel: Record<number, MoodType> = {
              5: 'excelente',
              4: 'bien',
              3: 'normal',
              2: 'cansado',
              1: 'estresado'
            }
            if (moodByLevel[lastLog.energy_level]) {
              setSelectedMood(moodByLevel[lastLog.energy_level])
            }
          }

          // 2. Recuperar la nota escrita si existía
          if (lastLog.notes) {
            setNote(lastLog.notes)
          }

          // Ir directo al Step 4 con los datos recuperados
          setStep(4)
        }
      } catch (err) {
        console.error('Error al comprobar registro diario:', err)
      } finally {
        setIsLoadingCheck(false)
      }
    }

    checkIfRegisteredToday()
  }, [])

  // Deseleccionar opuestos automáticamente
  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => {
      if (prev.includes(tag)) {
        return prev.filter((t) => t !== tag)
      } else {
        const opposite = OPPOSITE_TAGS[tag]
        const filtered = opposite ? prev.filter((t) => t !== opposite) : prev
        return [...filtered, tag]
      }
    })
  }

  // Mapear los estados de ánimo a valores numéricos para la tabla
  const getEnergyLevel = (mood: MoodType): number => {
    switch (mood) {
      case 'excelente': return 5
      case 'bien': return 4
      case 'normal': return 3
      case 'cansado': return 2
      case 'estresado': return 1
      default: return 3
    }
  }

  const handleSaveToSupabase = async () => {
    setIsSaving(true)
    setErrorMessage(null)

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser()

      if (userError || !user) {
        throw new Error('Debes iniciar sesión para registrar tu estado emocional.')
      }

      const { error } = await supabase.from('emotional_logs').insert([
        {
          user_id: user.id,
          energy_level: getEnergyLevel(selectedMood),
          focus_level: selectedTags.length > 0 ? 4 : 3,
          dominant_emotion: MOOD_RESPONSES[selectedMood].label,
          notes: selectedTags.length > 0 
            ? `Etiquetas: ${selectedTags.join(', ')}. ${note}`.trim()
            : note.trim() || null,
        },
      ])

      if (error) throw error

      setHasRegisteredToday(true)
      setStep(3)
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message)
      } else {
        setErrorMessage('Ocurrió un error al guardar tu registro.')
      }
    } finally {
      setIsSaving(false)
    }
  }

  useEffect(() => {
    if (step === 3) {
      setProgress(0)
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            setTimeout(() => setStep(4), 400)
            return 100
          }
          return prev + 20
        })
      }, 250)
      return () => clearInterval(interval)
    }
  }, [step])

  const currentResponse = MOOD_RESPONSES[selectedMood]

  if (isLoadingCheck) {
    return (
      <div className="w-full max-w-xl mx-auto py-12 text-center text-slate-500 text-xs font-medium">
        Cargando estado emocional...
      </div>
    )
  }

  return (
    <div className="w-full max-w-5xl mx-auto py-4 md:py-6 space-y-8 md:space-y-12">
      <div className="w-full max-w-xl mx-auto">
        {step === 1 && (
          <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-xs text-center flex flex-col items-center">
            <div className="w-24 h-24 mb-4 flex items-center justify-center">
              <img 
                src={yogaIcon} 
                alt="Entrenamiento completado" 
                className="w-full h-full object-contain drop-shadow-md"
              />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">¡Entrenamiento completado! 💪</h2>
            <p className="text-slate-500 text-sm max-w-sm mb-6">
              Antes de continuar, cuéntanos cómo te sientes ahora.
            </p>
            <button
              onClick={() => setStep(2)}
              className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold px-6 py-2.5 rounded-xl transition-all shadow-md cursor-pointer"
            >
              Registrar mi estado emocional
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="bg-white rounded-2xl p-5 md:p-6 border border-slate-200 shadow-xs space-y-5">
            <div className="text-center">
              <h2 className="text-lg font-bold text-slate-800">¿Cómo te sientes hoy?</h2>
              <p className="text-xs text-slate-400">Selecciona tu estado de ánimo</p>
            </div>

            {errorMessage && (
              <div className="bg-red-50 text-red-600 border border-red-200 p-2.5 rounded-xl text-xs text-center">
                {errorMessage}
              </div>
            )}

            <div className="grid grid-cols-5 gap-1.5 md:gap-2">
              {(Object.keys(MOOD_RESPONSES) as MoodType[]).map((key) => {
                const item = MOOD_RESPONSES[key]
                const isSelected = selectedMood === key
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedMood(key)}
                    className={`flex flex-col items-center p-2 rounded-xl border-2 transition-all cursor-pointer ${item.bgColor} ${
                      isSelected
                        ? `${item.borderColor} scale-105 shadow-md ring-2 ring-purple-400/50`
                        : 'border-transparent opacity-80 hover:opacity-100'
                    }`}
                  >
                    <span className="text-2xl mb-1">{item.emoji}</span>
                    <span className="text-[10px] font-bold text-slate-700 leading-tight">{item.label}</span>
                  </button>
                )
              })}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                ¿Qué sentiste más durante tu entrenamiento?
              </label>
              <div className="flex flex-wrap gap-1.5">
                {FEELING_TAGS.map((tag) => {
                  const active = selectedTags.includes(tag)
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                        active
                          ? 'bg-purple-600 text-white border-purple-600'
                          : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}
                    >
                      {tag}
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ¿Quieres agregar algo más? <span className="text-slate-400 font-normal">(opcional)</span>
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Escribe aquí..."
                rows={2}
                className="w-full p-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>

            <button
              type="button"
              disabled={isSaving}
              onClick={handleSaveToSupabase}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold py-2.5 rounded-xl shadow-md cursor-pointer disabled:opacity-50"
            >
              {isSaving ? 'Guardando en la base de datos...' : 'Guardar'}
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-xs text-center flex flex-col items-center space-y-4">
            <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center text-3xl animate-bounce">
              💜
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Gracias por compartir 💜</h2>
              <p className="text-xs text-slate-400 mt-1">Este es tu momento para crecer.</p>
            </div>

            <div className="w-full max-w-xs space-y-1.5">
              <p className="text-[11px] text-slate-400 font-medium">Analizando tu estado emocional...</p>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-xs text-purple-600 font-bold">{progress}%</p>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="text-center">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${currentResponse.badgeColor}`}>
                Basado en cómo te sientes hoy
              </span>
              <h2 className="text-lg font-bold text-slate-800 mt-2">Mensaje para ti ✨</h2>
            </div>

            <div className={`p-5 rounded-2xl border ${currentResponse.bgColor} ${currentResponse.borderColor} text-center space-y-2`}>
              <div className="text-3xl">{currentResponse.emoji}</div>
              <h3 className="text-base font-bold text-slate-800">{currentResponse.title}</h3>
              <p className="text-xs text-slate-700 leading-relaxed max-w-xs mx-auto">
                {currentResponse.message}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-100 flex items-center gap-3">
              <div className="text-xl p-1.5 bg-white rounded-lg shadow-xs">
                {currentResponse.suggestionIcon}
              </div>
              <div>
                <p className="text-[10px] font-bold text-purple-900 uppercase">Sugerencia para hoy</p>
                <p className="text-xs text-purple-800">{currentResponse.suggestionText}</p>
              </div>
            </div>

            {hasRegisteredToday ? (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
                <p className="text-xs text-slate-500 font-medium">
                  Ya realizaste tu registro emocional de hoy. Podrás registrarte de nuevo mañana.
                </p>
              </div>
            ) : (
              <button
                onClick={() => {
                  setSelectedTags([])
                  setNote('')
                  setStep(1)
                }}
                className="w-full border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold py-2.5 rounded-xl transition-colors cursor-pointer"
              >
                Nuevo registro
              </button>
            )}
          </div>
        )}
      </div>

      {/* SECCIÓN DE MUESTRA VISTA EN LA IMAGEN */}
      <div className="pt-8 border-t border-slate-200">
        <h3 className="text-center font-bold text-slate-700 text-xs uppercase tracking-wider mb-6">
          Ejemplos de mensajes personalizados según el estado de ánimo
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {(Object.keys(MOOD_RESPONSES) as MoodType[]).map((key) => {
            const item = MOOD_RESPONSES[key]
            return (
              <div
                key={key}
                className={`${item.bgColor} border ${item.borderColor} rounded-xl p-4 shadow-xs flex flex-col justify-between text-center space-y-3 transition-transform hover:scale-[1.02]`}
              >
                <div>
                  <div className="text-2xl mb-1">{item.emoji}</div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                    {item.label}
                  </span>
                  <h4 className="font-bold text-slate-800 text-xs mt-3">{item.title}</h4>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                    {item.message}
                  </p>
                </div>

                <div className="bg-white/80 backdrop-blur-xs p-2 rounded-lg border border-slate-200/60 text-left">
                  <p className="text-[9px] font-bold text-slate-400 uppercase">Sugerencia para hoy</p>
                  <p className="text-[10px] text-slate-700 flex items-center gap-1 mt-0.5">
                    <span>{item.suggestionIcon}</span>
                    {item.suggestionText}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}