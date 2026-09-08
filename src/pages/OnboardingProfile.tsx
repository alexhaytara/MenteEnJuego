import React, { useState } from 'react'
import bgLogin from '../assets/bg-login.jpg'

// Importación de las imágenes PNG de las posiciones
import puntaImg from '../assets/punta.png'
import centralImg from '../assets/central.png'
import liberoImg from '../assets/libero.png'
import armadorImg from '../assets/armador.png'
import opuestoImg from '../assets/opuesto.png'

interface OnboardingProfileProps {
  onComplete: (data: { name: string; age: number; position: string }) => void
}

export const OnboardingProfile: React.FC<OnboardingProfileProps> = ({ onComplete }) => {
  const [name, setName] = useState('')
  const [age, setAge] = useState(15)
  const [selectedPosition, setSelectedPosition] = useState('Punta')
  const [isRolling, setIsRolling] = useState(false)

  const handleAgeChange = (delta: number) => {
    setIsRolling(true)
    setAge((prev) => Math.max(13, Math.min(18, prev + delta)))
    setTimeout(() => setIsRolling(false), 300)
  }

  // Lista de posiciones utilizando las imágenes PNG importadas
  const positions = [
    { id: 'Punta', name: 'Punta / Receptor', image: puntaImg, desc: 'Ataque y recepción' },
    { id: 'Opuesto', name: 'Opuesto', image: opuestoImg, desc: 'Potencia de remate' },
    { id: 'Central', name: 'Central', image: centralImg, desc: 'Bloqueo y ataque rápido' },
    { id: 'Libero', name: 'Líbero', image: liberoImg, desc: 'Defensa y especialista' },
    { id: 'Armador', name: 'Armador / Colocador', image: armadorImg, desc: 'Estrategia y distribución' },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim() && selectedPosition) {
      onComplete({ name, age, position: selectedPosition })
    }
  }

  return (
    <div
      className="min-h-screen w-full relative flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat font-sans py-8"
      style={{ backgroundImage: `url(${bgLogin})` }}
    >
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"></div>

      <div className="relative z-10 bg-white/95 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/20 shadow-2xl w-full max-w-xl space-y-6 text-center my-auto">
        
        {/* Encabezado */}
        <div>
          <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full mx-auto flex items-center justify-center text-3xl shadow-inner border-2 border-purple-200 mb-2">
            👤
          </div>
          <h2 className="text-2xl font-black text-slate-800">¡Perfil del Atleta!</h2>
          <p className="text-xs text-slate-500 mt-0.5">Completa tus datos para personalizar tu experiencia en la cancha</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campo Nombre */}
          <div className="text-left">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              ¿Cómo te llamas?
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Escribe tu nombre o apodo"
              className="w-full p-3 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
            />
          </div>

          {/* Dado Interactivo de Edad (13 a 18 años) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-slate-700">
                Tu edad (Categoría Juvenil 13-18 años)
              </label>
              <span className="text-[10px] text-purple-700 font-bold bg-purple-50 px-2 py-0.5 rounded-md">
                Rango: 13 a 18
              </span>
            </div>

            <div className="flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => handleAgeChange(-1)}
                disabled={age <= 13}
                className="w-10 h-10 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 rounded-xl font-bold text-slate-700 shadow-xs text-lg active:scale-95 transition-all"
              >
                -
              </button>

              <div
                className={`w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl shadow-lg border-2 border-purple-300 flex flex-col items-center justify-center text-white transition-transform duration-300 ${
                  isRolling ? 'rotate-[360deg] scale-110' : ''
                }`}
              >
                <span className="text-2xl font-black">{age}</span>
                <span className="text-[9px] uppercase tracking-wider font-semibold opacity-80">Años</span>
              </div>

              <button
                type="button"
                onClick={() => handleAgeChange(1)}
                disabled={age >= 18}
                className="w-10 h-10 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 rounded-xl font-bold text-slate-700 shadow-xs text-lg active:scale-95 transition-all"
              >
                +
              </button>
            </div>
          </div>

          {/* Selección de Posición en Vóley con imágenes PNG */}
          <div className="space-y-3">
            <div className="text-center">
              <label className="block text-xs font-bold text-slate-700">
                Selecciona tu posición en el campo
              </label>
              
              <p className="italic text-purple-800 text-sm font-serif my-1 bg-purple-50/80 py-1 px-3 rounded-lg border border-purple-200/60 inline-block shadow-2xs">
                ✍️ "Diferentes posiciones, la misma pasión"
              </p>
            </div>

            {/* Fila 1: 3 cartillas (Punta, Opuesto, Central) */}
            <div className="grid grid-cols-3 gap-2">
              {positions.slice(0, 3).map((pos) => {
                const isSelected = selectedPosition === pos.id
                return (
                  <button
                    key={pos.id}
                    type="button"
                    onClick={() => setSelectedPosition(pos.id)}
                    className={`p-3 rounded-2xl border-2 flex flex-col items-center text-center transition-all ${
                      isSelected
                        ? 'bg-purple-600 text-white border-purple-600 shadow-md scale-105'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-purple-50'
                    }`}
                  >
                    <div className="w-12 h-12 mb-2 flex items-center justify-center">
                      <img
                        src={pos.image}
                        alt={pos.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <span className="text-xs font-extrabold">{pos.id}</span>
                    <span className={`text-[9px] mt-0.5 line-clamp-1 ${isSelected ? 'text-purple-100' : 'text-slate-400'}`}>
                      {pos.desc}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Fila 2: 2 cartillas (Líbero, Armador) */}
            <div className="grid grid-cols-2 gap-2 max-w-xs mx-auto">
              {positions.slice(3, 5).map((pos) => {
                const isSelected = selectedPosition === pos.id
                return (
                  <button
                    key={pos.id}
                    type="button"
                    onClick={() => setSelectedPosition(pos.id)}
                    className={`p-3 rounded-2xl border-2 flex flex-col items-center text-center transition-all ${
                      isSelected
                        ? 'bg-purple-600 text-white border-purple-600 shadow-md scale-105'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-purple-50'
                    }`}
                  >
                    <div className="w-12 h-12 mb-2 flex items-center justify-center">
                      <img
                        src={pos.image}
                        alt={pos.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <span className="text-xs font-extrabold">{pos.id}</span>
                    <span className={`text-[9px] mt-0.5 line-clamp-1 ${isSelected ? 'text-purple-100' : 'text-slate-400'}`}>
                      {pos.desc}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl transition-all text-xs shadow-md"
          >
            Continuar
          </button>
        </form>
      </div>
    </div>
  )
}