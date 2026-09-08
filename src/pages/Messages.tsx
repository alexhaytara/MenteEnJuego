import React, { useState } from 'react'

interface Message {
  id: number
  sender: 'user' | 'ai'
  text: string
  time: string
}

interface MessagesProps {
  userName?: string
  userPosition?: string
}

export const Messages: React.FC<MessagesProps> = ({
  userName = 'Atleta',
  userPosition = 'Punta',
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: 'ai',
      text: `¡Hola ${userName}! 👋 Soy tu asistente de psicología deportiva en Mente en Juego. ¿Cómo te sientes para tu próximo entrenamiento de ${userPosition}?`,
      time: 'Ahora',
    },
  ])
  const [inputText, setInputText] = useState('')

  const quickPrompts = [
    'Siento mucha presión antes de sacar',
    '¿Cómo supero un error en el último set?',
    'Dame una rutina de respiración rápida',
  ]

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText
    if (!text.trim()) return

    const userMsg: Message = {
      id: Date.now(),
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages((prev) => [...prev, userMsg])
    if (!textToSend) setInputText('')

    // Respuestas simuladas en Frontend antes de conectar la API
    setTimeout(() => {
      const aiReply: Message = {
        id: Date.now() + 1,
        sender: 'ai',
        text: `Entiendo perfectamente lo que mencionas. Como ${userPosition}, es clave que recuerdes tu rutina de anclaje: respira profundo en 4 segundos y enfócate solo en la acción inmediata, no en el marcador. ¡Tú tienes el control! 🏐✨`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages((prev) => [...prev, aiReply])
    }, 1000)
  }

  return (
    <div className="max-w-4xl mx-auto pb-8 space-y-4">
      {/* Encabezado */}
      <div>
        <h2 className="text-2xl font-black text-slate-800">Asistente Mental AI</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Resuelve dudas sobre tus entrenamientos, emociones y estrategias de juego en tiempo real.
        </p>
      </div>

      {/* Contenedor del Chat */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col h-[520px] overflow-hidden">
        
        {/* Barra superior del chat */}
        <div className="bg-purple-600 text-white p-4 flex items-center gap-3">
          <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center text-lg">
            🤖
          </div>
          <div>
            <h3 className="font-extrabold text-sm">Mente Bot Vóley</h3>
            <p className="text-[10px] text-purple-200">Especialista en Psicología Deportiva Juvenil</p>
          </div>
        </div>

        {/* Área de Mensajes */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-purple-600 text-white rounded-br-none shadow-2xs'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-2xs'
                }`}
              >
                <p>{m.text}</p>
                <span
                  className={`text-[9px] block text-right mt-1 font-medium ${
                    m.sender === 'user' ? 'text-purple-200' : 'text-slate-400'
                  }`}
                >
                  {m.time}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Sugerencias Rápidas */}
        <div className="px-4 py-2 bg-white border-t border-slate-100 flex gap-2 overflow-x-auto">
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              className="text-[10px] font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-full whitespace-nowrap transition-all border border-purple-100 flex-shrink-0"
            >
              💡 {prompt}
            </button>
          ))}
        </div>

        {/* Input de Texto */}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSend()
          }}
          className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Pregunta sobre tu preparación mental..."
            className="flex-1 p-3 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 bg-slate-50"
          />
          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-3 rounded-xl text-xs transition-all active:scale-95 shadow-sm"
          >
            Enviar ➔
          </button>
        </form>

      </div>
    </div>
  )
}