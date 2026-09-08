import React from 'react'

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
}

export const Home: React.FC<HomeProps> = ({ userName, userAge, userPosition = 'Punta' }) => {
  // Mapa de imágenes según la posición seleccionada
  const positionImages: Record<string, string> = {
    Punta: puntaImg,
    Opuesto: opuestoImg,
    Central: centralImg,
    Libero: liberoImg,
    Armador: armadorImg,
  }

  const currentImage = positionImages[userPosition] || puntaImg

  const days = [
    { name: 'Lun', trained: true, mood: '😁' },
    { name: 'Mar', trained: true, mood: '🙂' },
    { name: 'Mié', trained: false, mood: null },
    { name: 'Jue', trained: true, mood: '😐' },
    { name: 'Vie', trained: false, mood: null },
    { name: 'Sáb', trained: false, mood: null },
    { name: 'Dom', trained: false, mood: null },
  ]

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Tarjeta de Perfil Personal */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-6">
        <div className="w-20 h-20 bg-purple-100 text-purple-700 rounded-2xl flex items-center justify-center text-4xl font-bold shadow-inner flex-shrink-0">
          🏐
        </div>

        <div className="text-center md:text-left space-y-1">
          <h2 className="text-2xl font-black text-slate-800">{userName}</h2>
          <div className="flex flex-wrap justify-center md:justify-start gap-2 pt-1">
            <span className="text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-100">
              {userAge} años
            </span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
              Posición: {userPosition}
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Imagen de la Posición + Registro de la Semana */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Lado Izquierdo: Imagen de la Posición */}
        <div className="md:col-span-4 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center space-y-3">
          <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
            Tu Posición
          </span>
          <div className="w-28 h-28 flex items-center justify-center p-2 bg-purple-50 rounded-2xl border border-purple-100">
            <img
              src={currentImage}
              alt={userPosition}
              className="max-h-full max-w-full object-contain"
            />
          </div>
          <div>
            <h4 className="font-extrabold text-slate-800 text-sm">{userPosition}</h4>
            <p className="text-[10px] text-purple-700 font-serif italic mt-1">
              "Diferentes posiciones, la misma pasión"
            </p>
          </div>
        </div>

        {/* Lado Derecho: Seguimiento de Entrenamientos Semanales */}
        <div className="md:col-span-8 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">
            Registro de la Semana
          </h3>

          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {days.map((d, index) => (
              <div
                key={index}
                className={`rounded-2xl p-2 sm:p-3 text-center border flex flex-col items-center justify-between h-24 transition-transform hover:scale-105 ${
                  d.trained
                    ? 'bg-purple-50 border-purple-200 text-purple-900'
                    : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}
              >
                <span className="text-xs font-bold">{d.name}</span>
                <span className="text-xl my-1">{d.trained ? d.mood : '⚪'}</span>
                <span className="text-[9px] font-semibold uppercase">
                  {d.trained ? 'Entrenó' : 'Descanso'}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Cartilla informativa de Estado de Registros */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3">
        <span className="text-2xl">💡</span>
        <p className="text-xs text-amber-900 leading-relaxed font-medium">
          Aún no tienes registros emocionales completados hoy. Haz clic en <strong>"Registro emocional"</strong> en el menú lateral para iniciar tu primera entrada.
        </p>
      </div>

    </div>
  )
}