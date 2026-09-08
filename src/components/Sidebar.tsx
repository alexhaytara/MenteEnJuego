import React, { useState } from 'react'

interface SidebarProps {
  currentTab: string
  setCurrentTab: (tab: string) => void
  userEmail: string
  onLogout: () => void
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, setCurrentTab, userEmail, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false)

  const menuItems = [
    { id: 'inicio', name: 'Inicio', icon: '🏠' },
    { id: 'progreso', name: 'Mi progreso', icon: '📈' },
    { id: 'entrenamientos', name: 'Entrenamientos', icon: '🏋️' },
    { id: 'registro', name: 'Registro emocional', icon: '💜' },
    { id: 'estrategias', name: 'Estrategias', icon: '🧠' },
    { id: 'mensajes', name: 'Mensajes', icon: '💬' },
    { id: 'recursos', name: 'Recursos', icon: '📚' },
    { id: 'perfil', name: 'Perfil', icon: '👤' },
  ]

  const username = userEmail.split('@')[0] || 'Usuario'

  return (
    <>
      {/* Botón flotante para abrir menú en móviles */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 bg-[#C28AFF] text-slate-900 p-2.5 rounded-xl shadow-md border border-purple-300 font-bold text-lg"
      >
        {isOpen ? '✕' : '☰'}
      </button>

      {/* Fondo oscuro traslúcido para móviles al abrir menú */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="md:hidden fixed inset-0 bg-slate-900/40 z-40 backdrop-blur-xs"
        />
      )}

      <aside
        style={{ backgroundColor: '#C28AFF' }}
        className={`w-64 h-screen flex flex-col justify-between p-4 fixed left-0 top-0 z-40 transition-transform duration-300 shadow-xl border-r border-purple-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          <div className="flex items-center gap-3 px-2 py-4 mb-4 border-b border-purple-400/30">
            <div className="w-10 h-10 bg-white/90 text-purple-900 rounded-xl flex items-center justify-center font-bold text-xl shadow-sm">
              🧠
            </div>
            <div>
              <h1 className="font-extrabold text-slate-900 text-xs tracking-wider">MENTE EN JUEGO</h1>
              <p className="text-[10px] font-semibold text-slate-800 opacity-80">Psicología deportiva</p>
            </div>
          </div>

          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const isActive = currentTab === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentTab(item.id)
                    setIsOpen(false)
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-white text-slate-900 shadow-md scale-[1.02]'
                      : 'text-slate-900 hover:bg-white/30'
                  }`}
                >
                  <span className="text-sm">{item.icon}</span>
                  {item.name}
                </button>
              )
            })}
          </nav>
        </div>

        <div className="border-t border-purple-400/30 pt-3 flex items-center justify-between px-2">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-8 h-8 bg-white text-slate-900 rounded-full flex items-center justify-center text-xs font-black uppercase flex-shrink-0 shadow-sm">
              {username.charAt(0)}
            </div>
            <span className="text-xs font-bold text-slate-900 truncate">Hola, {username}</span>
          </div>
        </div>
      </aside>
    </>
  )
}