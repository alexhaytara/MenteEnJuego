import React, { useState } from 'react'

export const Strategies: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'cancha' | 'vida'>('cancha')

  // Estrategias divididas por contexto
  const courtStrategies = [
    {
      id: 1,
      title: 'La Regla de los 3 Segundos',
      category: 'Manejo de Errores',
      icon: '🧠',
      tag: 'Durante el partido',
      desc: 'Tras cometer un error (ej. remate fuera o red), tienes 3 segundos para respirar hondo, soltar la jugada físicamente con un gesto y enfocarte en el punto que sigue.',
      steps: ['Visualiza el error saliendo de tu cuerpo', 'Ajusta tu postura física', 'Di tu palabra clave ("¡Siguiente!")'],
    },
    {
      id: 2,
      title: 'Rutina Anclaje en el Saque',
      category: 'Concentración',
      icon: '🏐',
      tag: 'Pre-Saque',
      desc: 'Crea un ritual idéntico de 4 segundos antes de sacar para reducir las pulsaciones y evitar que la ansiedad afecte tu técnica.',
      steps: ['Pica el balón 3 veces exactas', 'Inhala profundo mirando la zona rival', 'Ejecuta con convención sin dudar'],
    },
    {
      id: 3,
      title: 'Respiración Cuadrada 4x4',
      category: 'Control de Ansiedad',
      icon: '🫁',
      tag: 'Antes de entrar a cancha',
      desc: 'Técnica utilizada para calmar el ritmo cardíaco cuando sientes "mariposas" o presión alta antes de un set decisivo.',
      steps: ['Inhala en 4s', 'Mantén el aire 4s', 'Exhala en 4s', 'Sostén vacío 4s'],
    },
  ]

  const lifeStrategies = [
    {
      id: 4,
      title: 'Gestión del Tiempo: Atleta vs. Colegio',
      category: 'Equilibrio de Vida',
      icon: '📚',
      tag: 'Día a Día',
      desc: 'Cómo organizar tus tareas escolares sin sacrificar tus horas de entrenamiento ni tu tiempo libre para disfrutar con amigos.',
      steps: ['Usa bloques de 25 min de estudio concentrado', 'Avisa a tus profesores sobre tu calendario de partidos', 'Mantén un día de descanso total a la semana'],
    },
    {
      id: 5,
      title: 'El "Interruptor" del Deportista',
      category: 'Bienestar Emocional',
      icon: '🌿',
      tag: 'Post-Entreno',
      desc: 'Aprende a dejar los problemas de la cancha dentro de la cancha. Tu valor como persona no depende de si ganaste o perdiste un partido.',
      steps: ['Haz una ducha consciente al terminar', 'Cambia de ropa para cambiar de mentalidad', 'Dedica 30 min a un pasatiempo no deportivo'],
    },
    {
      id: 6,
      title: 'Higiene del Sueño y Descanso Real',
      category: 'Recuperación & Felicidad',
      icon: '🌙',
      tag: 'Rutina Nocturna',
      desc: 'El músculo y la mente se reparan mientras duermes. El descanso adecuado es la clave para mantener un buen estado de ánimo.',
      steps: ['Deja las pantallas 45 min antes de dormir', 'Mantén tu habitación fresca y oscura', 'Duerme al menos 8 horas seguidas'],
    },
  ]

  const currentList = activeTab === 'cancha' ? courtStrategies : lifeStrategies

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-8">
      {/* Encabezado */}
      <div>
        <h2 className="text-2xl font-black text-slate-800">Estrategias Psicológicas</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Herramientas mentales para rendir al máximo en el vóley y disfrutar de una vida equilibrada.
        </p>
      </div>

      {/* Selector de Pestañas Principales (Cancha vs. Vida) */}
      <div className="grid grid-cols-2 bg-slate-200/80 p-1.5 rounded-2xl gap-2">
        <button
          onClick={() => {
            setActiveTab('cancha')
          }}
          className={`py-3 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'cancha'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>🏐</span> En la Cancha (Rendimiento)
        </button>

        <button
          onClick={() => {
            setActiveTab('vida')
          }}
          className={`py-3 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'vida'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>🌱</span> Fuera de la Cancha (Bienestar)
        </button>
      </div>

      {/* Banner Motivacional */}
      <div className="bg-gradient-to-r from-purple-700 to-indigo-800 rounded-3xl p-6 text-white shadow-md flex items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full border border-white/20">
            {activeTab === 'cancha' ? 'Fortaleza Mental' : 'Vida Plena & Atleta'}
          </span>
          <h3 className="text-lg font-extrabold mt-2">
            {activeTab === 'cancha'
              ? 'Domina tus emociones bajo presión'
              : 'Disfruta el proceso de ser atleta sin sobrecargarte'}
          </h3>
          <p className="text-xs text-purple-200 mt-1">
            {activeTab === 'cancha'
              ? 'Pequeños ajustes mentales que marcan la diferencia en los puntos decisivos.'
              : 'Un atleta feliz rinde mejor y disfruta cada entrenamiento con sus compañeros.'}
          </p>
        </div>
        <div className="text-4xl hidden sm:block">
          {activeTab === 'cancha' ? '⚡' : '✨'}
        </div>
      </div>

      {/* Tarjetas de Estrategias */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {currentList.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs hover:border-purple-300 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl">{item.icon}</span>
                <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-100">
                  {item.tag}
                </span>
              </div>

              <div>
                <h4 className="font-extrabold text-slate-800 text-sm">{item.title}</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{item.desc}</p>
              </div>
            </div>

            {/* Pasos de Aplicación */}
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-1.5">
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                Pasos de aplicación:
              </p>
              <ul className="space-y-1">
                {item.steps.map((step, idx) => (
                  <li key={idx} className="text-xs text-slate-700 font-medium flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-purple-100 text-purple-700 font-bold text-[9px] flex items-center justify-center flex-shrink-0">
                      {idx + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}