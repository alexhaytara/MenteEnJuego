import React, { useState } from 'react'

export const Resources: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'todos' | 'videos' | 'libros' | 'guias'>('todos')

  const resourcesList = [
    {
      id: 1,
      title: 'Cómo superar un error en el punto decisivo',
      type: 'videos',
      icon: '🎬',
      tag: 'Psicología en Cancha',
      author: 'Mente en Juego TV',
      desc: 'Video análisis de 4 minutos sobre la fortaleza mental de los atletas olímpicos tras fallar un remate.',
      link: 'https://youtube.com',
      duration: '4 min',
    },
    {
      id: 2,
      title: 'El Campeón con Mente Clara',
      type: 'libros',
      icon: '📖',
      tag: 'Lectura Recomendada',
      author: 'Dr. Alexis Castorani',
      desc: 'Resumen ejecutivo del libro: 3 claves fundamentales para desarrollar resiliencia competitiva en deportes de equipo.',
      points: ['Aceptar el error como dato', 'Enfoque en la rutina de saque', 'Comunicación con el armador'],
    },
    {
      id: 3,
      title: 'Análisis Táctico: Lectura del Bloqueo Rival',
      type: 'videos',
      icon: '🏐',
      tag: 'Táctica & Técnica',
      author: 'Vóley Pro Academy',
      desc: 'Aprende a identificar la posición de los dedos del bloqueador central antes de armar el ataque.',
      link: 'https://youtube.com',
      duration: '6 min',
    },
    {
      id: 4,
      title: 'Guía de Nutrición e Hidratación Pre-Partido',
      type: 'guias',
      icon: '🥗',
      tag: 'Bienestar Atleta',
      author: 'Equipo Mente en Juego',
      desc: 'Qué comer 2 horas antes de un partido oficial para mantener la energía alta sin sentir pesadez.',
      points: ['Carbohidratos de absorción lenta', 'Hidratación constante 24h antes', 'Evitar azúcares procesados'],
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
          Videos, lecturas y guías tácticas para potenciar tu nivel físico y mental.
        </p>
      </div>

      {/* Filtros de Categoría */}
      <div className="flex bg-slate-200/70 p-1.5 rounded-2xl text-xs font-bold gap-1 overflow-x-auto">
        <button
          onClick={() => setActiveCategory('todos')}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
            activeCategory === 'todos'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          ✨ Todos
        </button>
        <button
          onClick={() => setActiveCategory('videos')}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
            activeCategory === 'videos'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          🎬 Videos & Partidos
        </button>
        <button
          onClick={() => setActiveCategory('libros')}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
            activeCategory === 'libros'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          📚 Libros & Resúmenes
        </button>
        <button
          onClick={() => setActiveCategory('guias')}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
            activeCategory === 'guias'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          💡 Guías Rápidas
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
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">{item.desc}</p>
              </div>

              {/* Puntos clave si es libro o guía */}
              {item.points && (
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-1">
                  <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">
                    Puntos clave:
                  </p>
                  <ul className="space-y-0.5">
                    {item.points.map((pt, i) => (
                      <li key={i} className="text-xs text-slate-700 font-medium flex items-center gap-1.5">
                        <span className="text-purple-600">•</span> {pt}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Accion */}
            {item.type === 'videos' ? (
              <a
                href={item.link}
                target="_blank"
                rel="noreferrer"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 rounded-xl transition-all text-xs text-center block shadow-2xs active:scale-95"
              >
                Ver Video en YouTube ➔
              </a>
            ) : (
              <button className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl transition-all text-xs text-center block active:scale-95">
                Leer Resumen Completo ➔
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}