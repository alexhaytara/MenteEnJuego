import React, { useState, useEffect } from 'react'
import { MOOD_RESPONSES, FEELING_TAGS, type MoodType } from '../data/emotionsData'
import yogaIcon from '../assets/yoga-icon.png'

export const EmotionalRegister: React.FC = () => {
  const [step, setStep] = useState<number>(1)
  const [selectedMood, setSelectedMood] = useState<MoodType>('bien')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [note, setNote] = useState<string>('')
  const [progress, setProgress] = useState<number>(0)

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  useEffect(() => {
    if (step === 3) {
      setProgress(0)
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            setTimeout(() => setStep(4), 400)
            return 100
          }
          return prev + 20
        })
      }, 250)
      return () => clearInterval(interval)
    }
  }, [step])

  const currentResponse = MOOD_RESPONSES[selectedMood]

  return (
    <div className="w-full max-w-5xl mx-auto py-4 md:py-6 space-y-8 md:space-y-12">
      <div className="w-full max-w-xl mx-auto">
        {step === 1 && (
          <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm text-center flex flex-col items-center">
            <div className="w-24 h-24 mb-4 flex items-center justify-center">
              <img 
                src={yogaIcon} 
                alt="Entrenamiento completado" 
                className="w-full h-full object-contain drop-shadow-md"
              />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">¡Entrenamiento completado! 💪</h2>
            <p className="text-slate-500 text-sm max-w-sm mb-6">
              Antes de continuar, cuéntanos cómo te sientes ahora.
            </p>
            <button
              onClick={() => setStep(2)}
              className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold px-6 py-2.5 rounded-xl transition-all shadow-md"
            >
              Registrar mi estado emocional
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="bg-white rounded-2xl p-5 md:p-6 border border-slate-200 shadow-sm space-y-5">
            <div className="text-center">
              <h2 className="text-lg font-bold text-slate-800">¿Cómo te sientes hoy?</h2>
              <p className="text-xs text-slate-400">Selecciona tu estado de ánimo</p>
            </div>

            <div className="grid grid-cols-5 gap-1.5 md:gap-2">
              {(Object.keys(MOOD_RESPONSES) as MoodType[]).map((key) => {
                const item = MOOD_RESPONSES[key]
                const isSelected = selectedMood === key
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedMood(key)}
                    className={`flex flex-col items-center p-2 rounded-xl border-2 transition-all ${item.bgColor} ${
                      isSelected
                        ? `${item.borderColor} scale-105 shadow-md ring-2 ring-purple-400/50`
                        : 'border-transparent opacity-80 hover:opacity-100'
                    }`}
                  >
                    <span className="text-2xl mb-1">{item.emoji}</span>
                    <span className="text-[10px] font-bold text-slate-700 leading-tight">{item.label}</span>
                  </button>
                )
              })}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                ¿Qué sentiste más durante tu entrenamiento?
              </label>
              <div className="flex flex-wrap gap-1.5">
                {FEELING_TAGS.map((tag) => {
                  const active = selectedTags.includes(tag)
                  return (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                        active
                          ? 'bg-purple-600 text-white border-purple-600'
                          : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}
                    >
                      {tag}
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ¿Quieres agregar algo más? <span className="text-slate-400 font-normal">(opcional)</span>
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Escribe aquí..."
                rows={2}
                className="w-full p-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>

            <button
              onClick={() => setStep(3)}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold py-2.5 rounded-xl shadow-md"
            >
              Guardar
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm text-center flex flex-col items-center space-y-4">
            <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center text-3xl animate-bounce">
              💜
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Gracias por compartir 💜</h2>
              <p className="text-xs text-slate-400 mt-1">Este es tu momento para crecer.</p>
            </div>

            <div className="w-full max-w-xs space-y-1.5">
              <p className="text-[11px] text-slate-400 font-medium">Analizando tu estado emocional...</p>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-xs text-purple-600 font-bold">{progress}%</p>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="text-center">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${currentResponse.badgeColor}`}>
                Basado en cómo te sientes hoy
              </span>
              <h2 className="text-lg font-bold text-slate-800 mt-2">Mensaje para ti ✨</h2>
            </div>

            <div className={`p-5 rounded-2xl border ${currentResponse.bgColor} ${currentResponse.borderColor} text-center space-y-2`}>
              <div className="text-3xl">{currentResponse.emoji}</div>
              <h3 className="text-base font-bold text-slate-800">{currentResponse.title}</h3>
              <p className="text-xs text-slate-700 leading-relaxed max-w-xs mx-auto">
                {currentResponse.message}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-100 flex items-center gap-3">
              <div className="text-xl p-1.5 bg-white rounded-lg shadow-sm">
                {currentResponse.suggestionIcon}
              </div>
              <div>
                <p className="text-[10px] font-bold text-purple-900 uppercase">Sugerencia para hoy</p>
                <p className="text-xs text-purple-800">{currentResponse.suggestionText}</p>
              </div>
            </div>

            <button
              onClick={() => setStep(1)}
              className="w-full border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold py-2.5 rounded-xl transition-colors"
            >
              Nuevo registro
            </button>
          </div>
        )}
      </div>

      {/* SECCIÓN DE MUESTRA VISTA EN LA IMAGEN */}
      <div className="pt-8 border-t border-slate-200">
        <h3 className="text-center font-bold text-slate-700 text-xs uppercase tracking-wider mb-6">
          Ejemplos de mensajes personalizados según el estado de ánimo
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {(Object.keys(MOOD_RESPONSES) as MoodType[]).map((key) => {
            const item = MOOD_RESPONSES[key]
            return (
              <div
                key={key}
                className={`${item.bgColor} border ${item.borderColor} rounded-xl p-4 shadow-xs flex flex-col justify-between text-center space-y-3 transition-transform hover:scale-[1.02]`}
              >
                <div>
                  <div className="text-2xl mb-1">{item.emoji}</div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                    {item.label}
                  </span>
                  <h4 className="font-bold text-slate-800 text-xs mt-3">{item.title}</h4>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                    {item.message}
                  </p>
                </div>

                <div className="bg-white/80 backdrop-blur-xs p-2 rounded-lg border border-slate-200/60 text-left">
                  <p className="text-[9px] font-bold text-slate-400 uppercase">Sugerencia para hoy</p>
                  <p className="text-[10px] text-slate-700 flex items-center gap-1 mt-0.5">
                    <span>{item.suggestionIcon}</span>
                    {item.suggestionText}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}