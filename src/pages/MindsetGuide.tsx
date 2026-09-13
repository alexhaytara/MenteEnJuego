import React from 'react'

export const MindsetGuide: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 text-slate-700 animate-fade-in">
      
      {/* Encabezado Principal */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-3">
        <span className="bg-white/20 text-white text-[11px] font-black uppercase px-3 py-1 rounded-full tracking-wider">
          Psicología Deportiva
        </span>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
          Mindset Guide: La Psicología en el Vóley 💡
        </h1>
        <p className="text-xs sm:text-sm text-purple-100 opacity-90 leading-relaxed">
          Basado en las aportaciones de Mar Durán (psicóloga de la Selección Española de Vóley Playa, entrenadora, árbitro y exjugadora) y Ana Lizarraga.
        </p>
      </div>

      {/* Sección 1: El Conflicto Interno */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-lg font-extrabold text-slate-800 flex items-center gap-2">
          <span>🧠</span> Lo que pasa dentro de ti
        </h2>
        <p className="text-xs sm:text-sm leading-relaxed font-medium text-slate-800">
          A veces odias al vóley, pero no por lo que pasa en la pista o la arena, sino por lo que ocurre en tu interior:
        </p>
        <ul className="space-y-2 text-xs sm:text-sm text-slate-600 font-medium pl-2">
          <li className="flex items-start gap-2">
            <span className="text-purple-600 font-bold">•</span>
            Quizá te frustras más de lo que te gustaría.
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-600 font-bold">•</span>
            Quizá sientes que entrenas bien… pero juegas con miedo.
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-600 font-bold">•</span>
            O que un error tonto te apaga y te saca por completo del partido.
          </li>
        </ul>
        <p className="text-xs sm:text-sm text-slate-600 pt-2 border-t border-slate-100">
          Tranquilo/a, esto le pasa a muchos deportistas que lidian con la ansiedad o pensamientos que bajan su moral. El propósito de esta plataforma es ayudarte a combatir esos pensamientos mediante estrategias interactivas que faciliten analizar tu progreso psicológico.
        </p>
        <div className="bg-purple-50 border border-purple-100 rounded-2xl p-4 text-xs sm:text-sm text-purple-950 font-semibold leading-relaxed">
          Queremos que disfrutes de este deporte sin sentir que tu mente te sabotea, que brilles con toda la confianza del mundo en ti mismo/a, logres tus metas y te sientas suficiente.
        </div>
      </div>

      {/* Sección 2: ¿Qué es la psicología deportiva? */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-lg font-extrabold text-slate-800 flex items-center gap-2">
          <span>📊</span> ¿Qué es la psicología deportiva y por qué importa?
        </h2>
        <p className="text-xs sm:text-sm leading-relaxed text-slate-600">
          Investiga y analiza aquellas actitudes, pensamientos y sentimientos que influyen de manera positiva o negativa en el rendimiento de un deportista, ayudando a desarrollar habilidades clave para mejorar en los entrenamientos.
        </p>
        <blockquote className="border-l-4 border-purple-500 pl-4 py-2 text-xs sm:text-sm italic text-slate-700 bg-purple-50/50 rounded-r-xl">
          “Analiza cómo estas variables pueden afectar al rendimiento físico y deportivo de un atleta.” — <strong className="not-italic text-purple-900">IMED Hospitales y Universidad Católica de Valencia</strong>.
        </blockquote>
        <p className="text-xs sm:text-sm text-slate-700 font-semibold">
          Un deportista no solo necesita habilidades físicas y técnicas. También requiere confianza, concentración, motivación y capacidad para gestionar sus emociones.
        </p>
      </div>

      {/* Sección 3: La mente en el voleibol */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-lg font-extrabold text-slate-800 flex items-center gap-2">
          <span>🏐</span> La velocidad y el compromiso en el voleibol
        </h2>
        <blockquote className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 text-xs sm:text-sm text-slate-700 leading-relaxed italic">
          “El balón no se puede retener para ganar tiempo. Cada jugada se resuelve mediante una secuencia muy breve de contactos, durante la cual los jugadores deben percibir, decidir y ejecutar sin que el juego se detenga. Esta combinación de velocidad, coordinación e interdependencia deja muy poco margen para quedarse atrapado en el error anterior o pensar en las consecuencias del siguiente punto.”
          <span className="block mt-2 not-italic font-bold text-xs text-purple-700">— Ana Lizarraga, psicóloga deportiva</span>
        </blockquote>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Los grandes jugadores se caracterizan por su <strong>autoconfianza</strong>. Ellos realmente se la creen, y al creérsela, logran maravillas en la cancha.
        </p>
      </div>

      {/* Sección 4: Autoconfianza y Actitudes frente al error */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-lg font-extrabold text-slate-800">Autoconfianza y cómo reaccionar ante un error</h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Cada balón es una decisión. El detalle está en cómo te comprometes con ella sin que el resultado del balón anterior influya. Si te salió mal, te salió mal; la clave es dejar ese error atrás y continuar, sabiendo que no eres el único que comete fallos. Lo fundamental es la actitud posterior:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 space-y-2">
            <span className="text-[10px] font-extrabold uppercase text-rose-700">Opción A (Mentalidad Bloqueada)</span>
            <p className="text-xs font-bold text-rose-900 italic">
              “No puedo, todo me sale mal, soy un/a jugador/a terrible”
            </p>
            <p className="text-[11px] text-rose-700">Tú solo/a te bajas la moral; en consecuencia, tu desempeño decae.</p>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 space-y-2">
            <span className="text-[10px] font-extrabold uppercase text-emerald-700">Opción B (Mentalidad de Resiliencia)</span>
            <p className="text-xs font-bold text-emerald-900 italic">
              “No importa, a la siguiente traigo el punto”
            </p>
            <p className="text-[11px] text-emerald-700">Te motivas y te das seguridad para recuperar y ganar el siguiente punto.</p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-2">
          Las compañeras cuyas actitudes convencen al entrenador de mantenerlas en la cancha son aquellas que, aun fallando, transmiten seguridad de que la próxima jugada será suya. No dejes que un mal punto contamine el resto de tu partido.
        </p>
      </div>

      {/* Sección 5: Apoyo al equipo y beneficios */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-lg font-extrabold text-slate-800">Apoyo mutuo y trabajo en equipo</h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Es importante que colabores con tus compañeros/as. Breves palabras de motivación o simples gestos (como chocar las manos o una palmada en la espalda) ayudan a que se sientan mejor y recuperen la confianza:
        </p>
        <div className="flex flex-wrap gap-2">
          <span className="bg-purple-50 text-purple-800 font-bold text-xs px-3 py-1.5 rounded-xl border border-purple-200">
            “Está bien, a la siguiente”
          </span>
          <span className="bg-purple-50 text-purple-800 font-bold text-xs px-3 py-1.5 rounded-xl border border-purple-200">
            “Tú puedes”
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-2">
          Según Ana Lizarraga: <em>“El voleibol ofrece oportunidades constantes para decidir bajo presión, comunicarse, cooperar y recuperarse rápidamente del error.”</em> Estas experiencias fortalecen tu tolerancia a la frustración y tu liderazgo colectivo.
        </p>
      </div>

      {/* Sección 6: Aviso Profesional */}
      <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 sm:p-8 space-y-3">
        <h3 className="text-xs font-black uppercase text-amber-900 tracking-wider flex items-center gap-2">
          <span>⚠️</span> Cuándo buscar orientación profesional
        </h3>
        <p className="text-xs text-amber-800 leading-relaxed">
          Somos una plataforma plenamente de apoyo y orientación. Te recomendamos buscar ayuda profesional si experimentas de forma constante lo siguiente:
        </p>
        <ul className="space-y-1.5 text-xs text-amber-900 font-medium pl-4 list-disc">
          <li>En más de 3 ocasiones juegas por debajo de tu nivel debido a errores o comentarios.</li>
          <li>Te cuesta demasiado recuperarte emocionalmente de un error.</li>
          <li>Te afectan en exceso las llamadas de atención de tu entrenador/a.</li>
          <li>La ansiedad afecta tus ganas de jugar y tu concentración.</li>
          <li>Perdiste por completo la pasión o la motivación por el deporte.</li>
        </ul>
      </div>

    </div>
  )
}