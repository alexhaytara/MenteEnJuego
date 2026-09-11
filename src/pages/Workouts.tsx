import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

interface WorkoutsProps {
  userPosition?: string
}

// Obtener el día actual de la semana (1: Lunes, 2: Martes, ..., 7: Domingo)
const getCurrentDayOfWeek = (): number => {
  const day = new Date().getDay()
  return day === 0 ? 7 : day
}

// Tiempo total obligatorio de la sesión (90 minutos = 5400 segundos)
const FULL_WORKOUT_SECONDS = 90 * 60 

export const Workouts: React.FC<WorkoutsProps> = ({ userPosition: propUserPosition }) => {
  const [selectedDay, setSelectedDay] = useState<number>(getCurrentDayOfWeek())
  const [completedDays, setCompletedDays] = useState<number[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  
  // Estado para la posición dinámica del usuario
  const [userPosition, setUserPosition] = useState<string>(propUserPosition || 'Punta')

  // Estados del Cronómetro
  const [isActive, setIsActive] = useState<boolean>(false)
  const [isPaused, setIsPaused] = useState<boolean>(false)
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0)
  const [showFiveMinAlert, setShowFiveMinAlert] = useState<boolean>(false)

  // Estados del Modal de Check-in / Abandono
  const [showModal, setShowModal] = useState<boolean>(false)
  const [isAbandoned, setIsAbandoned] = useState<boolean>(false)
  const [rpe, setRpe] = useState<number>(5)
  const [notes, setNotes] = useState<string>('')
  const [saving, setSaving] = useState<boolean>(false)

  // Diccionario de enfoque específico según la posición del atleta
  const getSpecializedFocus = (position: string, dayId: number): string => {
    const focusMap: Record<string, Record<number, string>> = {
      Punta: {
        1: 'Ajuste de plataforma en recepción de saques potentes.',
        2: 'Entrenamiento de pliometría enfocado en la carrera de remate de 3 pasos.',
        3: 'Transición rápida de pase a ataque por zona 4.',
        4: 'Perfeccionamiento del saque flotante/con salto desde zona 1.',
        5: 'Lectura del bloqueo doble rival y uso de manos para touch-out.',
        6: 'Rutina de activación psicológica para mantener la calma en recepción.',
        7: 'Recuperación física y movilidad de hombro.',
      },
      Central: {
        1: 'Control de balón alto en situaciones de emergencia.',
        2: 'Potencia de salto vertical enfocado en bloqueos seguidos.',
        3: 'Ataque rápido a 1er tiempo en combinación con el armador.',
        4: 'Desplazamiento lateral rápido para cerrar extremos en el bloqueo.',
        5: 'Comunicación constante para cantar la jugada del atacante rival.',
        6: 'Visualización de la lectura de los dedos del armador contrario.',
        7: 'Descanso activo y movilidad de rodillas/tobillos.',
      },
      Libero: {
        1: 'Postura baja y control preciso hacia zona 2/3.',
        2: 'Agilidad y velocidad de reacción en desplazamientos cortos.',
        3: 'Pase alto con dedos desde zona de zaguero si falla la armada.',
        4: 'Lectura anticipada de la trayectoria del remate en diagonal.',
        5: 'Liderazgo defensivo y organización de la cobertura del remate.',
        6: 'Enfoque mental en no dejar caer ningún balón en zona de conflicto.',
        7: 'Flexibilidad general y descarga muscular.',
      },
      Armador: {
        1: 'Desplazamiento rápido a la zona de armada tras recepción.',
        2: 'Fuerza de dedos y estabilidad de core para armadas de fondo.',
        3: 'Toma de decisiones rápida para engañar al bloqueo central rival.',
        4: 'Precisión en colocación de balón hacia zona 2 y zona 4.',
        5: 'Distribución táctica del juego según la racha de los atacantes.',
        6: 'Manejo del estrés pre-partido para mantener la cabeza fría.',
        7: 'Evaluación táctica y revisión mental de rotaciones.',
      },
      Opuesto: {
        1: 'Recepción ocasional y apoyo inmediato en cobertura.',
        2: 'Entrenamiento de potencia explosiva para remate desde zona 1 y 2.',
        3: 'Ataque contra bloqueo montado y balones fuera de sistema.',
        4: 'Dirección del saque buscando las zonas débiles del rival.',
        5: 'Carga de ataque principal en puntos de alta presión (puntos 20+).',
        6: 'Construcción de confianza para mantener el remate fuerte tras un error.',
        7: 'Recuperación activa y descanso de piernas.',
      },
    }

    return (
      focusMap[position]?.[dayId] ||
      'Mantén la concentración constante en cada repetición del entrenamiento.'
    )
  }

  // Plan semanal
  const weeklyPlan = [
    { id: 1, dayName: 'Lunes', title: 'Técnico & Control de Recepción', type: 'Técnico', generalFocus: 'Control de pase, postura corporal e inclinación en recepción.', isRest: false },
    { id: 2, dayName: 'Martes', title: 'Preparación Física & Saltabilidad', type: 'Físico', generalFocus: 'Pliometría (salto vertical), potencia de piernas y core.', isRest: false },
    { id: 3, dayName: 'Miércoles', title: 'Táctico & Transición de Ataque', type: 'Táctico', generalFocus: 'Transición rápida de defensa a contraataque por bandas.', isRest: false },
    { id: 4, dayName: 'Jueves', title: 'Servicio & Organización Defensiva', type: 'Técnico/Táctico', generalFocus: 'Rutina de saque en zona de presión y reflejos en defensa.', isRest: false },
    { id: 5, dayName: 'Viernes', title: 'Complejo I & II (Simulación de Juego)', type: 'Competitivo', generalFocus: 'Simulación de partido a 25 puntos con rotaciones reales.', isRest: false },
    { id: 6, dayName: 'Sábado', title: 'Activación Pre-Partido & Enfoque', type: 'Mente & Ajuste', generalFocus: 'Repaso de jugadas preparadas y preparación psicológica.', isRest: false },
    { id: 7, dayName: 'Domingo', title: 'Descanso Activo & Recuperación', type: 'Recuperación', generalFocus: 'Estiramientos ligeros, movilidad articular y descanso.', isRest: true },
  ]

  const currentWorkout = weeklyPlan.find((w) => w.id === selectedDay) || weeklyPlan[0]
  const todayOfWeek = getCurrentDayOfWeek()
  const isToday = selectedDay === todayOfWeek
  const isPastDay = selectedDay < todayOfWeek

  // Cargar perfil (posición) y entrenamientos completados desde Supabase
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        // 1. Obtener la posición actualizada del usuario desde la tabla de perfiles (ajusta 'profiles' y 'position' según tu esquema de base de datos)
        const { data: profileData } = await supabase
          .from('profiles')
          .select('position')
          .eq('id', user.id)
          .single()

        if (profileData?.position) {
          setUserPosition(profileData.position)
        } else if (propUserPosition) {
          setUserPosition(propUserPosition)
        }

        // 2. Obtener entrenamientos completados
        const { data: trainingData, error } = await supabase
          .from('training_plans')
          .select('title, status')
          .eq('user_id', user.id)
          .eq('status', 'completed')

        if (error) throw error

        if (trainingData) {
          const completedIds = weeklyPlan
            .filter((w) => trainingData.some((item) => item.title === w.title))
            .map((w) => w.id)
          setCompletedDays(completedIds)
        }
      } catch (err) {
        console.error('Error al cargar datos del usuario:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [propUserPosition])

  // Cronómetro
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null

    if (isActive && !isPaused) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => {
          const nextVal = prev + 1

          // Alerta cuando falten 5 min (a los 85 min = 5100 seg)
          if (nextVal === FULL_WORKOUT_SECONDS - 300 && FULL_WORKOUT_SECONDS > 300) {
            setShowFiveMinAlert(true)
          }

          // Si se completaron los 90 minutos enteros
          if (nextVal >= FULL_WORKOUT_SECONDS) {
            setIsPaused(true)
            setIsAbandoned(false)
            setShowModal(true)
          }

          return nextVal
        })
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, isPaused])

  // Formatear tiempo MM:SS o HH:MM:SS
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Iniciar Sesión
  const handleStartWorkout = () => {
    setIsActive(true)
    setIsPaused(false)
    setElapsedSeconds(0)
    setShowFiveMinAlert(false)
  }

  // Marcar como Abandono en cualquier momento
  const handleAbandonWorkout = () => {
    setIsPaused(true)
    setIsAbandoned(true)
    setShowModal(true)
  }

  // Guardar en Supabase
  const handleSaveWorkoutToSupabase = async () => {
    setSaving(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const minutesTrained = Math.max(1, Math.round(elapsedSeconds / 60))
      const isFullCompleted = !isAbandoned && elapsedSeconds >= FULL_WORKOUT_SECONDS

      const { error } = await supabase.from('training_plans').insert([
        {
          user_id: user.id,
          title: currentWorkout.title,
          category: currentWorkout.type,
          is_completed: isFullCompleted,
          status: isFullCompleted ? 'completed' : 'incomplete',
          duration_minutes: minutesTrained,
          rpe_effort: isFullCompleted ? rpe : null,
          notes: notes || (isAbandoned ? 'Entrenamiento abandonado antes de los 90 min' : null),
          completed_at: new Date().toISOString(),
        },
      ])

      if (error) throw error

      if (isFullCompleted) {
        setCompletedDays((prev) => [...prev, currentWorkout.id])
      }

      setShowModal(false)
      setIsActive(false)
      setIsPaused(false)
      setNotes('')
      
      alert(
        isFullCompleted
          ? '🎉 ¡Felicitaciones! Has completado los 90 minutos de entrenamiento.'
          : '⚠️ Sesión registrada como incompleta/interrumpida. Recuerda registrar tu estado en el Registro Emocional.'
      )
    } catch (err) {
      console.error('Error al registrar en Supabase:', err)
      alert('Ocurrió un error al guardar la sesión en la base de datos.')
    } finally {
      setSaving(false)
    }
  }

  const isCurrentCompleted = completedDays.includes(currentWorkout.id)
  const isTimeFulfilled = elapsedSeconds >= FULL_WORKOUT_SECONDS

  // Pantalla de Carga
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-3">
        <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-semibold text-slate-500">Cargando tu plan de entrenamiento...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-8 relative">
      {/* Encabezado */}
      <div>
        <h2 className="text-2xl font-black text-slate-800">Plan de Entrenamientos</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Estructura semanal adaptada a tu rol en la cancha: <strong className="text-purple-700">{userPosition}</strong>
        </p>
      </div>

      {/* Navegador de Días de la Semana */}
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
        {weeklyPlan.map((day) => {
          const isSelected = selectedDay === day.id
          const isDone = completedDays.includes(day.id)
          const isDayToday = day.id === todayOfWeek

          return (
            <button
              key={day.id}
              onClick={() => {
                if (isActive) {
                  if (!confirm('Tienes un entrenamiento en curso. Si cambias de día, se cancelará la sesión actual.')) return
                }
                setSelectedDay(day.id)
                setIsActive(false)
              }}
              className={`p-2.5 sm:p-3 rounded-2xl text-center border transition-all flex flex-col items-center justify-between h-22 relative ${
                isSelected
                  ? 'bg-purple-600 text-white border-purple-600 shadow-md scale-105'
                  : day.isRest
                  ? 'bg-slate-100 text-slate-400 border-slate-200 hover:bg-slate-200'
                  : isDone
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-purple-50'
              }`}
            >
              {/* Etiqueta HOY */}
              {isDayToday && (
                <span className={`absolute -top-1.5 text-[8px] font-black px-1.5 py-0.2 rounded-full border ${
                  isSelected ? 'bg-white text-purple-700 border-purple-200' : 'bg-purple-600 text-white border-purple-600'
                }`}>
                  HOY
                </span>
              )}

              <span className="text-[10px] font-bold uppercase mt-1">{day.dayName.slice(0, 3)}</span>
              <span className="text-base my-0.5">{isDone ? '✅' : day.isRest ? '🔋' : '🏐'}</span>
              <span className={`text-[8px] font-extrabold uppercase ${isSelected ? 'text-purple-100' : 'text-slate-400'}`}>
                {isDone ? 'Completado' : day.isRest ? 'Descanso' : `Día ${day.id}`}
              </span>
            </button>
          )
        })}
      </div>

      {/* Detalle de la Sesión Seleccionada */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
        
        {/* Encabezado de la Sesión */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black uppercase text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-md border border-purple-100">
                {currentWorkout.type}
              </span>
              <span className="text-xs font-bold text-slate-400">
                {currentWorkout.dayName} • Sesión #{currentWorkout.id}
              </span>
            </div>
            <h3 className="text-xl font-extrabold text-slate-800">{currentWorkout.title}</h3>
          </div>

          <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-100 text-slate-600 w-fit">
            {currentWorkout.isRest ? '😴 Día sin carga' : '⏱️ 90 Minutos'}
          </span>
        </div>

        {/* Módulo General */}
        <div className="space-y-1">
          <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
            1. Enfoque General del Equipo
          </h4>
          <p className="text-xs text-slate-700 font-medium bg-slate-50 p-3 rounded-xl border border-slate-100">
            {currentWorkout.generalFocus}
          </p>
        </div>

        {/* Módulo Especializado por Posición */}
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50/50 rounded-2xl p-4 border border-purple-100 space-y-2">
          <div className="flex items-center gap-2 text-purple-800">
            <span className="text-base">🎯</span>
            <h4 className="text-xs font-extrabold uppercase tracking-wider">
              2. Tu Trabajo Especializado ({userPosition})
            </h4>
          </div>
          <p className="text-xs font-semibold text-purple-950 leading-relaxed">
            "{getSpecializedFocus(userPosition, currentWorkout.id)}"
          </p>
        </div>

        {/* Alerta de 5 minutos restantes */}
        {showFiveMinAlert && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 flex items-center justify-between gap-2 animate-bounce">
            <p className="text-xs font-bold text-amber-900">
              ⚡ ¡Quedan 5 minutos para terminar el entrenamiento de 90 min! Inicia el enfriamiento.
            </p>
            <button onClick={() => setShowFiveMinAlert(false)} className="text-amber-700 font-bold text-xs">
              Entendido
            </button>
          </div>
        )}

        {/* Módulo de Control de Estado del Entrenamiento */}
        {!currentWorkout.isRest ? (
          <div>
            {isCurrentCompleted ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center text-emerald-800 text-xs font-bold flex items-center justify-center gap-2">
                <span>🎉</span> ¡Entrenamiento completado al 100%!
              </div>
            ) : isActive ? (
              /* Cronómetro Activo (Solo cuando se entrena HOY) */
              <div className="bg-purple-950 text-white rounded-3xl p-6 space-y-4 shadow-xl text-center border border-purple-800">
                <div className="space-y-1">
                  <span className="text-[10px] text-purple-300 font-extrabold uppercase tracking-widest">
                    Cronómetro de Entrenamiento
                  </span>
                  <div className="text-5xl font-black font-mono tracking-wider text-purple-100">
                    {formatTime(elapsedSeconds)}
                  </div>
                  <p className="text-[10px] text-purple-300">
                    Meta de entrenamiento: 90:00 min
                  </p>
                </div>

                <div className="flex flex-wrap justify-center gap-3 pt-2">
                  <button
                    onClick={() => setIsPaused(!isPaused)}
                    className="bg-purple-800 hover:bg-purple-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-all border border-purple-700 cursor-pointer"
                  >
                    {isPaused ? 'Reanudar ▶️' : 'Pausar ⏸️'}
                  </button>

                  <button
                    onClick={handleAbandonWorkout}
                    className="bg-rose-600/90 hover:bg-rose-600 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-all border border-rose-500 cursor-pointer"
                  >
                    Abandonar Entrenamiento ⚠️
                  </button>

                  {isTimeFulfilled && (
                    <button
                      onClick={() => {
                        setIsAbandoned(false)
                        setShowModal(true)
                      }}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-all shadow-md active:scale-95 cursor-pointer animate-pulse"
                    >
                      Completar y Evaluarme ✅
                    </button>
                  )}
                </div>
              </div>
            ) : isToday ? (
              /* Día de HOY: Botón de Iniciar Habilitado */
              <button
                onClick={handleStartWorkout}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3.5 rounded-xl transition-all text-xs shadow-md active:scale-95 cursor-pointer"
              >
                Iniciar Entrenamiento de Hoy ➔
              </button>
            ) : isPastDay ? (
              /* Día Pasado No Realizado */
              <div className="text-center p-3.5 bg-slate-100 text-slate-500 rounded-xl text-xs font-semibold border border-slate-200">
                ⌛ Este día ya transcurrió y no se registró una sesión activa.
              </div>
            ) : (
              /* Día Futuro Bloqueado */
              <div className="text-center p-3.5 bg-purple-50 text-purple-700 rounded-xl text-xs font-semibold border border-purple-100 flex items-center justify-center gap-1.5">
                <span>🔒</span> Entrenamiento programado para el {currentWorkout.dayName}.
              </div>
            )}
          </div>
        ) : (
          <div className="text-center p-3.5 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold border border-emerald-100">
            🌱 Día de descanso programado. Aprovecha para estirar e hidratarte bien.
          </div>
        )}

      </div>

      {/* Modal de Finalización / Abandono */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 border border-slate-100">
            <div className="text-center space-y-1">
              <span className="text-3xl">{isAbandoned ? '⚠️' : '🎉'}</span>
              <h3 className="text-lg font-black text-slate-800">
                {isAbandoned ? 'Entrenamiento Interrumpido' : '¡Excelente Trabajo!'}
              </h3>
              <p className="text-xs text-slate-500">
                {isAbandoned
                  ? `Abandonaste la sesión a los ${Math.max(1, Math.round(elapsedSeconds / 60))} minutos.`
                  : 'Completaste los 90 minutos de entrenamiento. Evalúa tu esfuerzo:'}
              </p>
            </div>

            {!isAbandoned ? (
              /* Evaluación de Esfuerzo Percibido (RPE 1-10) */
              <div className="space-y-3">
                <label className="block text-xs font-extrabold text-slate-700 uppercase">
                  Esfuerzo Percibido (RPE 1-10): <span className="text-purple-700 text-sm font-black">{rpe}</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={rpe}
                  onChange={(e) => setRpe(Number(e.target.value))}
                  className="w-full accent-purple-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                  <span>1 (Muy Ligero)</span>
                  <span>5 (Exigente)</span>
                  <span>10 (Agotamiento Total)</span>
                </div>
              </div>
            ) : (
              /* Motivo del Abandono */
              <div className="space-y-1.5">
                <label className="block text-xs font-extrabold text-slate-700 uppercase">
                  ¿Qué complicación o motivo te impidió culminar?
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ej: Molestia muscular, fatiga excesiva, problema personal..."
                  className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  setShowModal(false)
                  setIsPaused(false)
                }}
                className="w-1/2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs transition-all cursor-pointer"
              >
                Volver al Cronómetro
              </button>
              <button
                onClick={handleSaveWorkoutToSupabase}
                disabled={saving}
                className="w-1/2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 rounded-xl text-xs transition-all shadow-md cursor-pointer disabled:opacity-50"
              >
                {saving ? 'Guardando...' : 'Registrar'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}