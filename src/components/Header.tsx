import React from 'react'
import logoutImg from "../assets/logout.png"

interface HeaderProps {
  userName: string
  userPosition?: string
  onLogout: () => void
}

export const Header: React.FC<HeaderProps> = ({ userName, userPosition, onLogout }) => {
  return (
    <header className="w-full bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-2">
        <span className="text-xl">🏐</span>
        <span className="font-black text-slate-800 text-sm tracking-wide hidden sm:inline">
          MENTE EN JUEGO
        </span>
      </div>

      <div className="flex items-center gap-3">
        {/* Info rápida del usuario */}
        <div className="text-right text-xs">
          <p className="font-bold text-slate-800">{userName}</p>
          {userPosition && (
            <p className="text-[10px] text-purple-600 font-semibold">{userPosition}</p>
          )}
        </div>

        {/* BOTÓN ICONO DE CERRAR SESIÓN (Arriba a la derecha) */}
        <button
          onClick={onLogout}
          title="Cerrar sesión"
          aria-label="Cerrar sesión"
          className="w-9 h-9 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl flex items-center justify-center transition-all shadow-2xs active:scale-95 border border-red-100"
        >
          <img 
            src={logoutImg} 
            alt="Cerrar sesión" 
            className="w-full h-full object-contain hover:rotate-12 transition-transform" />
        </button>
      </div>
    </header>
  )
}