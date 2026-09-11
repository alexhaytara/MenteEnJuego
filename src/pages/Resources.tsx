import React, { useState } from 'react'

interface ResourceItem {
  id: number
  title: string
  type: 'videos' | 'libros' | 'guias'
  icon: string
  tag: string
  author: string
  desc: string
  link: string
  duration?: string
  points?: string[]
}

export const Resources: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'todos' | 'videos' | 'libros' | 'guias'>('todos')

  const resourcesList: ResourceItem[] = [
    {
      id: 1,
      title: 'Cómo superar un error y seguir enfocado',
      type: 'videos',
      icon: '🎬',
      tag: 'Psicología Deportiva',
      author: 'Bernardo Stamateas',
      desc: 'Reflexión clave de 1 minuto para **gestionar la frustración**, soltar las equivocaciones del pasado y mantener la mente 100% concentrada en la siguiente jugada.',
      link: 'https://youtu.be/PpRuSfOgrlw',
      duration: '1 min',
    },
    {
      id: 2,
      title: 'El Campeón con Mente Clara',
      type: 'libros',
      icon: '📖',
      tag: 'Mentalidad Ganadora',
      author: 'wikiHow',
      desc: 'Guía práctica para cultivar la **disciplina, resiliencia y autocontrol** que caracterizan a los deportistas de alto rendimiento.',
      link: 'https://es.wikihow.com/ser-un-campe%C3%B3n',
      points: [
        'Aceptar las derrotas como oportunidades de aprendizaje',
        'Mantener una rutina estricta de hábitos y entrenamiento',
        'Desarrollar confianza mental en momentos bajo presión',
      ],
    },
    {
      id: 3,
      title: 'Análisis Táctico: Lectura del Bloqueo Rival',
      type: 'videos',
      icon: '🏐',
      tag: 'Táctica & Técnica',
      author: 'Ryan Laurete',
      desc: 'La **guía definitiva sobre el bloqueo en vóley**: aprende a anticipar la postura de las manos del rival, sincronizar el salto y penetrar la red de forma efectiva.',
      link: 'https://www.allvolleyball.com/blogs/news/the-ultimate-guide-to-blocking-in-volleyball',
      duration: 'Lectura técnica (5 min)',
    },
    {
      id: 4,
      title: 'Guía de Nutrición e Hidratación Pre-Partido',
      type: 'guias',
      icon: '🥗',
      tag: 'Bienestar del Atleta',
      author: 'Dra. Amil López Viéitez',
      desc: 'Estrategia nutricional paso a paso para **maximizar tus depósitos de glucógeno** y evitar la fatiga o pesadez durante torneos intensos.',
      link: 'https://www.dietacoherente.com/dieta-para-voleibol-nutricionista-deportivo/',
      points: [
        'Carbohidratos de bajo índice glucémico antes de jugar',
        'Protocolo de hidratación con sales minerales 24h antes',
        'Recuperación muscular rápida post-entrenamiento',
      ],
    },
  ]

  const filteredResources =
    activeCategory === 'todos'
      ? resourcesList
      : resourcesList.filter((r) => r.type === activeCategory)

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-8">
      {/* Encabezado */}
      <div>
        <h2 className="text-2xl font-black text-slate-800">Biblioteca de Recursos</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Videos, lecturas y guías tácticas recomendadas para potenciar tu nivel físico y mental.
        </p>
      </div>

      {/* Filtros de Categoría */}
      <div className="flex bg-slate-200/70 p-1.5 rounded-2xl text-xs font-bold gap-1 overflow-x-auto">
        <button
          onClick={() => setActiveCategory('todos')}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
            activeCategory === 'todos'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          ✨ Todos
        </button>
        <button
          onClick={() => setActiveCategory('videos')}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
            activeCategory === 'videos'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          🎬 Videos & Táctica
        </button>
        <button
          onClick={() => setActiveCategory('libros')}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
            activeCategory === 'libros'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          📚 Mentalidad & Lecturas
        </button>
        <button
          onClick={() => setActiveCategory('guias')}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
            activeCategory === 'guias'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          💡 Nutrición & Guías
        </button>
      </div>

      {/* Grid de Recursos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredResources.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs hover:border-purple-300 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-2xl">{item.icon}</span>
                <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-100">
                  {item.tag}
                </span>
              </div>

              <div>
                <h4 className="font-extrabold text-slate-800 text-sm">{item.title}</h4>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                  Por {item.author} {item.duration && `• ⏱️ ${item.duration}`}
                </p>
                <p 
                  className="text-xs text-slate-600 mt-2 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: item.desc.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}
                />
              </div>

              {/* Puntos clave si están disponibles */}
              {item.points && (
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-1.5">
                  <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">
                    Puntos Clave:
                  </p>
                  <ul className="space-y-1">
                    {item.points.map((pt, i) => (
                      <li key={i} className="text-xs text-slate-700 font-medium flex items-start gap-1.5 leading-snug">
                        <span className="text-purple-600 font-bold">•</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Botón de Acción Externa */}
            <a
              href={item.link}
              target="_blank"
              rel="noreferrer"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 rounded-xl transition-all text-xs text-center block shadow-2xs active:scale-95 cursor-pointer"
            >
              {item.type === 'videos' ? 'Ver Recurso en Video ➔' : 'Abrir Guía / Lectura Completa ➔'}
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}