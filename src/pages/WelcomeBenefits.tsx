import React from 'react'
import bgLogin from '../assets/bg-login.jpg'

interface WelcomeBenefitsProps {
  userName: string
  onNext: () => void
}

export const WelcomeBenefits: React.FC<WelcomeBenefitsProps> = ({ userName, onNext }) => {
  return (
    <div
      className="min-h-screen w-full relative flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat font-sans"
      style={{ backgroundImage: `url(${bgLogin})` }}
    >
      {/* Capa de opacidad oscura */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"></div>

      <div className="relative z-10 bg-white/95 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/20 shadow-2xl w-full max-w-lg space-y-6">
        
        <div className="text-center space-y-2">
          <span className="text-4xl">🎉</span>
          <h2 className="text-2xl font-black text-slate-800">¡Bienvenido/a, {userName}!</h2>
          <p className="text-xs font-semibold text-purple-700 bg-purple-50 px-3 py-1 rounded-full inline-block">
            Nos alegra que formes parte de Mente en Juego
          </p>
        </div>

        {/* Cartillas de Beneficios */}
        <div className="space-y-3">
          <div className="p-4 rounded-2xl bg-purple-50/90 border border-purple-100 flex items-start gap-3 shadow-xs">
            <span className="text-2xl">🧠</span>
            <p className="text-xs text-slate-700 leading-relaxed">
              Esta aplicación te ayudará a <strong className="text-purple-800 bg-purple-200/60 px-1 rounded">gestionar mejor tus emociones</strong>, antes, durante y después de tus entrenamientos y partidos.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/90 border border-emerald-100 flex items-start gap-3 shadow-xs">
            <span className="text-2xl">📊</span>
            <p className="text-xs text-slate-700 leading-relaxed">
              Tendrás un <strong className="text-emerald-800 bg-emerald-200/60 px-1 rounded">registro emocional personalizado</strong>, donde podrás seleccionar cómo te sientes en cada momento.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50/90 border border-blue-100 flex items-start gap-3 shadow-xs">
            <span className="text-2xl">📚</span>
            <p className="text-xs text-slate-700 leading-relaxed">
              También encontrarás <strong className="text-blue-800 bg-blue-200/60 px-1 rounded">estrategias, consejos y recursos</strong> de psicología deportiva para acompañarte en tu camino.
            </p>
          </div>
        </div>

        <button
          onClick={onNext}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl transition-all text-xs shadow-md flex items-center justify-center gap-2"
        >
          <span>Ir a mi panel principal</span>
          <span>→</span>
        </button>
      </div>
    </div>
  )
}