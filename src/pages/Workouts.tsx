import React, { useState } from 'react'

interface WorkoutsProps {
  userPosition?: string
}

export const Workouts: React.FC<WorkoutsProps> = ({ userPosition = 'Punta' }) => {
  const [selectedDay, setSelectedDay] = useState<number>(1) // Día 1 por defecto

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

  // Plan semanal estandarizado de 6 días + 1 descanso
  const weeklyPlan = [
    {
      id: 1,
      dayName: 'Lunes',
      title: 'Técnico & Control de Recepción',
      type: 'Técnico',
      generalFocus: 'Control de pase, postura corporal e inclinación en recepción.',
      isRest: false,
    },
    {
      id: 2,
      dayName: 'Martes',
      title: 'Preparación Física & Saltabilidad',
      type: 'Físico',
      generalFocus: 'Pliometría (salto vertical), potencia de piernas y core.',
      isRest: false,
    },
    {
      id: 3,
      dayName: 'Miércoles',
      title: 'Táctico & Transición de Ataque',
      type: 'Táctico',
      generalFocus: 'Transición rápida de defensa a contraataque por bandas.',
      isRest: false,
    },
    {
      id: 4,
      dayName: 'Jueves',
      title: 'Servicio & Organización Defensiva',
      type: 'Técnico/Táctico',
      generalFocus: 'Rutina de saque en zona de presión y reflejos en defensa.',
      isRest: false,
    },
    {
      id: 5,
      dayName: 'Viernes',
      title: 'Complejo I & II (Simulación de Juego)',
      type: 'Competitivo',
      generalFocus: 'Simulación de partido a 25 puntos con rotaciones reales.',
      isRest: false,
    },
    {
      id: 6,
      dayName: 'Sábado',
      title: 'Activación Pre-Partido & Enfoque',
      type: 'Mente & Ajuste',
      generalFocus: 'Repaso de jugadas preparadas y preparación psicológica.',
      isRest: false,
    },
    {
      id: 7,
      dayName: 'Domingo',
      title: 'Descanso Activo & Recuperación',
      type: 'Recuperación',
      generalFocus: 'Estiramientos ligeros, movilidad articular y descanso.',
      isRest: true,
    },
  ]

  const currentWorkout = weeklyPlan.find((w) => w.id === selectedDay) || weeklyPlan[0]

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-8">
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
          return (
            <button
              key={day.id}
              onClick={() => setSelectedDay(day.id)}
              className={`p-2.5 sm:p-3 rounded-2xl text-center border transition-all flex flex-col items-center justify-between h-20 ${
                isSelected
                  ? 'bg-purple-600 text-white border-purple-600 shadow-md scale-105'
                  : day.isRest
                  ? 'bg-slate-100 text-slate-400 border-slate-200 hover:bg-slate-200'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-purple-50'
              }`}
            >
              <span className="text-[10px] font-bold uppercase">{day.dayName.slice(0, 3)}</span>
              <span className="text-base my-0.5">{day.isRest ? '🔋' : '🏐'}</span>
              <span className={`text-[8px] font-extrabold uppercase ${isSelected ? 'text-purple-100' : 'text-slate-400'}`}>
                {day.isRest ? 'Descanso' : `Día ${day.id}`}
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

        {/* Botón de Acción */}
        {!currentWorkout.isRest ? (
          <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl transition-all text-xs shadow-md active:scale-95">
            Iniciar Entrenamiento de Hoy ➔
          </button>
        ) : (
          <div className="text-center p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold border border-emerald-100">
            🌱 Día de descanso programado. Aprovecha para estirar e hidratarte bien.
          </div>
        )}

      </div>
    </div>
  )
}