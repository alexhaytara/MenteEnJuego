import React from 'react'

interface MindsetGuideProps {
  userName?: string
  onNavigateToSection?: (section: string) => void
}

export const MindsetGuide: React.FC<MindsetGuideProps> = ({ userName = 'Atleta', onNavigateToSection }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16 text-slate-700 animate-fade-in">
      
      {/* 🧠 ENCABEZADO DE BIENVENIDA */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-3xl p-6 sm:p-10 shadow-xl space-y-4 text-center sm:text-left">
        <span className="bg-white/20 text-white text-[11px] font-black uppercase px-3.5 py-1.5 rounded-full tracking-wider">
          Mente en Juego 🏐
        </span>
        <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
          ¡Hola! {userName}, déjanos contarte cómo funciona la psicología en el vóley 😀
        </h1>
        <p className="text-xs sm:text-sm text-purple-100 opacity-90 leading-relaxed max-w-2xl">
          Según Mar Durán, psicóloga de la Selección Española de Vóley Playa, entrenadora de voleibol, árbitro y exjugadora, en el 2026:
        </p>
      </div>

      {/* 💡 BLOQUE 1: EL CONFLICTO INTERNO */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🤔</span>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-800">
            ¿Sabías que a veces odias al vóley, pero no por lo que pasa en la pista, sino dentro de ti?
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs font-medium text-slate-700 leading-relaxed">
            <span className="text-purple-600 font-bold block mb-1">01 / Frustración</span>
            Quizá te frustras más de lo que te gustaría.
          </div>
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs font-medium text-slate-700 leading-relaxed">
            <span className="text-purple-600 font-bold block mb-1">02 / Miedo</span>
            Quizá sientes que entrenas bien… pero juegas con miedo.
          </div>
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs font-medium text-slate-700 leading-relaxed">
            <span className="text-purple-600 font-bold block mb-1">03 / Bloqueo</span>
            O que un error tonto te apaga y te saca del partido.
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-2">
          Pero tranquilo/a, te pasa a ti y a muchos más deportistas que lidian con la ansiedad o pensamientos que les baja la moral. 
        </p>

        <div className="bg-purple-50 border border-purple-100 rounded-2xl p-5 text-xs sm:text-sm text-purple-950 font-semibold leading-relaxed space-y-2">
          <p>
            Y el propósito de ésta página web es ayudarte a combatir con esos pensamientos y sentimientos que hacen que tu rendimiento disminuya, nuestra misión es ayudarte a cambiar poco a poco esas actitudes e inseguridades que llegas a tener, mediante estrategias interactivas y útiles que te ayudarán a analizar tu progreso psicológico.
          </p>
          <p className="text-purple-900 font-bold">
            Queremos que disfrutes de este deporte, sin que sientas que tu mente es la que te está saboteando, que cuando tengas la oportunidad de brillar lo hagas y con toda la confianza del mundo en tí mismo/a, queremos que logres tus metas y te sientas suficiente.
          </p>
        </div>
      </div>

      {/* 📊 BLOQUE 2: QUÉ ES LA PSICOLOGÍA DEPORTIVA */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-lg font-extrabold text-slate-800 flex items-center gap-2">
          <span>🧠</span> Para poder lograrlo, primero necesitamos comprender el qué es la psicología deportiva y por qué es importante:
        </h2>
        <p className="text-xs sm:text-sm leading-relaxed text-slate-600">
          La psicología deportiva es aquella que investiga y analiza aquellas actitudes, pensamientos y sentimientos que pueden influir de manera tanto positiva como negativa en el rendimiento de un deportista. Asimismo, ayuda a poder desarrollar habilidades que pueden ayudar al deportista a mejorar sus entrenamientos.
        </p>
        <blockquote className="border-l-4 border-purple-500 pl-4 py-2 text-xs sm:text-sm italic text-slate-700 bg-purple-50/50 rounded-r-xl">
          Esta es importante ya que según IMED Hospitales y la Universidad Católica de Valencia, <strong className="not-italic font-bold text-purple-900">“analiza como estas variables pueden afectar al rendimiento físico y deportivo de un atleta.”</strong>
        </blockquote>
        <p className="text-xs sm:text-sm text-slate-700 font-bold bg-slate-50 p-4 rounded-2xl border border-slate-100">
          — Un deportista no solo necesita habilidades físicas y técnicas. También necesita confianza, concentración, motivación y capacidad para manejar sus emociones.
        </p>
      </div>

      {/* 🏐 BLOQUE 3: LA MENTE EN EL VOLEIBOL */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-lg font-extrabold text-slate-800 flex items-center gap-2">
          <span>⚡</span> Lo importante que es la mente en el voleibol
        </h2>
        
        <div className="text-xs sm:text-sm text-slate-600 font-medium">
          Según Ana Lizarraga, psicóloga deportiva:
        </div>

        <blockquote className="bg-slate-50 border border-slate-200/60 rounded-2xl p-5 text-xs sm:text-sm text-slate-700 leading-relaxed italic space-y-3">
          <p>
            “el balón no se puede retener para ganar tiempo. Cada jugada se resuelve mediante una secuencia muy breve de contactos, durante la cual los jugadores deben percibir, decidir y ejecutar sin que el juego se detenga.”
          </p>
          <p>
            “Esta combinación de velocidad, coordinación e interdependencia deja muy poco margen para quedarse atrapado en el error anterior o pensar en las consecuencias del siguiente punto.”
          </p>
        </blockquote>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-2">
          Los famosos jugadores y jugadoras de voleibol se caracterizan por sus celebraciones y actitudes frente a las distintas circunstancias, algunos son conocidos por su explosividad, mientras otros lo son por su inteligencia, otros por su liderazgo, y todos tienen un mismo objetivo, darlo todo y conseguir esa victoria para su equipo. Y cuando hablamos de darlo todo, pues hablamos del hecho de tener una autoestima excelente, ellos realmente se la creen, y al creérsela, logran maravillas.
        </p>
      </div>

      {/* 🎯 BLOQUE 4: AUTOCONFIANZA Y ACTITUDES FRENTE AL ERROR */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-lg font-extrabold text-slate-800">
          Ahora, ¿cuáles son esas actitudes que caracterizan a estos voleibolistas de excelencia?
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Ellos tienen algo llamado autoconfianza, cada balón es una decisión, el detalle está en cómo es que el jugador se compromete con dicha decisión sin que el resultado de un balón anterior influya en esta nueva. En pocas palabras, si te salió mal, pues te salió mal; la clave es dejar ese error y continuar, el partido no se ha acabado y no eres el único/a que comete errores, y lo más importante es el cómo reaccionas o las actitudes que muestras tras ese error:
        </p>

        {/* Las Opciones A y B */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 space-y-3">
            <span className="text-[10px] font-extrabold uppercase text-rose-700 tracking-wider">Opción A (La que bloquea)</span>
            <p className="text-xs font-bold text-rose-900 italic">
              “No puedo, todo me sale mal, soy un/a jugador/a terrible”
            </p>
            <p className="text-[11px] text-rose-700 font-medium">
              (Tú solo/a te bajas la moral, en consecuencia, tu desempeño no es bueno)
            </p>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 space-y-3">
            <span className="text-[10px] font-extrabold uppercase text-emerald-700 tracking-wider">Opción B (La de excelencia)</span>
            <p className="text-xs font-bold text-emerald-900 italic">
              “No importa, a la siguiente traigo el punto”
            </p>
            <p className="text-[11px] text-emerald-700 font-medium">
              (Te motivas, te das la confianza y seguridad de que a la siguiente traerás y recuperarás ese punto)
            </p>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-3 mt-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <p className="font-bold text-slate-800">¿Tú cuál de estas dos eres?</p>
          <p>
            En lo personal, hace un tiempo yo era la opción A, el hecho de fallar significaba que para mí el partido y mi participación estaba perdida: Pero con el paso del tiempo me dí cuenta que todos cometen errores, pero se diferencian en la forma en la que reaccionan; algunas compañeras al fallar se les bajaba la moral, por lo tanto las sacaban de la cancha; pero había otras que fallaban, pero a la siguiente la traían, por más que se equivocaran, sus actitudes frente a esos errores convencían al entrenador de dejarlas en cancha.
          </p>
          <p className="font-medium text-purple-900">
            Y eso es lo que hace la diferencia, no dejes que un mal punto o mala jugada contamine el resto de tus jugadas; como mencionamos anteriormente, esto le pasa a mucha gente, por lo que es importante que tú también colabores con tus compañeros/as.
          </p>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Ya sea una mala jugada, un error, breves palabras de motivación pueden ayudarlas a sentirse mejor: El hecho de que les brindes esa confianza, de que no pasa nada, es solo un error, y que aún confías en ellos/as para que traigan el siguiente punto.
        </p>

        <div className="flex flex-wrap gap-2 pt-2">
          <span className="bg-purple-50 text-purple-800 font-bold text-xs px-3.5 py-2 rounded-xl border border-purple-200">
            “Está bien, a la siguiente”
          </span>
          <span className="bg-purple-50 text-purple-800 font-bold text-xs px-3.5 py-2 rounded-xl border border-purple-200">
            “Tú puedes”
          </span>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-2">
          Además, simples gestos como chocar las manos, una palmada en la espalda, hacen que tu compañero/a se sienta mejor. 
        </p>
      </div>

      {/* 🤝 BLOQUE 5: BENEFICIOS MENTALES */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-lg font-extrabold text-slate-800">
          Con esto claro, para finalizar: ¿Cómo te beneficia mentalmente éste deporte?
        </h2>
        
        <blockquote className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 text-xs sm:text-sm text-slate-700 leading-relaxed italic">
          Según Ana Lizarraga, <strong className="not-italic font-semibold text-slate-900">“El voleibol ofrece oportunidades constantes para decidir bajo presión, comunicarse, cooperar y recuperarse rápidamente del error. También combina iniciativa individual y responsabilidad colectiva: cada jugador ejecuta su acción, pero el punto depende de cómo se conectan los distintos toques”</strong>
        </blockquote>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Éstas experiencias pueden ayudarte a mejorar el nivel de tolerancia frente a situaciones frustrantes, tener una actitud más positiva y motivadora frente a situaciones complicadas, al igual que la forma en la que trabajas en equipo, las actitudes positivas y de liderazgo, que te facilitan la convivencia y colaboración con los demás.
        </p>
      </div>

      {/* ⚠️ BLOQUE 6: AVISO PROFESIONAL */}
      <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 sm:p-8 space-y-3">
        <h3 className="text-xs font-black uppercase text-amber-900 tracking-wider flex items-center gap-2">
          <span>⚠️</span> Y RECUERDA: Somos una plataforma plenamente de apoyo y orientación
        </h3>
        <p className="text-xs text-amber-800 leading-relaxed font-medium">
          En caso de que te pasen estos puntos a continuación de manera constante, te recomendamos recibir orientación profesional:
        </p>
        <ul className="space-y-2 text-xs text-amber-900 font-medium pl-4 list-disc">
          <li>En más de 3 ocasiones juegas por debajo de tu nivel de entrenamiento debido a errores, comentarios, etc.</li>
          <li>Te cuesta demasiado recuperarte de un error.</li>
          <li>Te afectan mucho los comentarios o posibles llamadas de atención por parte de tu entrenador/a.</li>
          <li>La ansiedad afecta a tus ganas de jugar y tu capacidad para concentrarse.</li>
          <li>Perdiste la pasión por el deporte / perdiste tu motivación.</li>
        </ul>
      </div>

      {/* 🚀 BOTONES DE ACCIÓN / LLAMADO A LA ACCIÓN AL FINAL */}
      <div className="bg-gradient-to-br from-purple-900 to-indigo-900 text-white rounded-3xl p-8 shadow-xl text-center space-y-4">
        <h3 className="text-xl sm:text-2xl font-black">
          ¡Ahora, te damos la bienvenida a nuestra plataforma 😀!
        </h3>
        <p className="text-xs sm:text-sm text-purple-200 max-w-xl mx-auto">
          Ya conoces la teoría y la importancia de tu mente en el vóley. Es hora de empezar a entrenarla, registrar tus emociones y evaluar tu progreso.
        </p>
        
        {/* Accesos directos a las demás secciones */}
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <button
            onClick={() => onNavigateToSection?.('home')}
            className="bg-white text-purple-900 font-bold text-xs px-5 py-3 rounded-2xl shadow-md hover:bg-purple-50 transition-all cursor-pointer"
          >
            🏠 Ir al Inicio
          </button>
          <button
            onClick={() => onNavigateToSection?.('emotional')}
            className="bg-purple-600 text-white font-bold text-xs px-5 py-3 rounded-2xl shadow-md hover:bg-purple-700 transition-all cursor-pointer"
          >
            ❤️ Registrar mis Emociones
          </button>
          <button
            onClick={() => onNavigateToSection?.('profile')}
            className="bg-purple-800 text-white font-bold text-xs px-5 py-3 rounded-2xl shadow-md hover:bg-purple-700 border border-purple-500/50 transition-all cursor-pointer"
          >
            👤 Ver mi Perfil Atleta
          </button>
          <button
            onClick={() => onNavigateToSection?.('progress')}
            className="bg-indigo-600 text-white font-bold text-xs px-5 py-3 rounded-2xl shadow-md hover:bg-indigo-700 transition-all cursor-pointer"
          >
            📈 Ver tu Progreso
          </button>
          <button
            onClick={() => onNavigateToSection?.('training')}
            className="bg-indigo-800 text-white font-bold text-xs px-5 py-3 rounded-2xl shadow-md hover:bg-indigo-700 border border-indigo-500/50 transition-all cursor-pointer"
          >
            🏐 Ver Entrenamientos
          </button>
        </div>
      </div>

    </div>
  )
}