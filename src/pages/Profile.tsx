import React, { useState } from 'react'

interface ProfileProps {
  userData?: {
    name: string
    position: string
    category?: string
    club?: string
  }
}

export const Profile: React.FC<ProfileProps> = ({
  userData = {
    name: 'Atleta',
    position: 'Punta Receptor',
    category: 'Sub-17',
    club: 'Club Deportivo Vóley',
  },
}) => {
  const [goal, setGoal] = useState('Mantener la concentración en los momentos bajo presión y mejorar la recepción.')

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-8">
      {/* Encabezado */}
      <div>
        <h2 className="text-2xl font-black text-slate-800">Mi Perfil Atleta</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Gestiona tu información personal, tus objetivos de temporada y configuraciones.
        </p>
      </div>

      {/* Tarjeta de Identificación del Atleta */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center gap-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-purple-100 border-4 border-purple-500 flex items-center justify-center text-4xl shadow-inner">
            🏐
          </div>
          <button className="absolute bottom-0 right-0 bg-purple-600 text-white p-1.5 rounded-full text-xs shadow-md hover:bg-purple-700">
            ✏️
          </button>
        </div>

        <div className="text-center sm:text-left space-y-1">
          <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-100">
            {userData.category}
          </span>
          <h3 className="text-xl font-black text-slate-800 mt-1">{userData.name}</h3>
          <p className="text-xs text-slate-500 font-medium">
            Posición: <span className="font-bold text-slate-700">{userData.position}</span> • {userData.club}
          </p>
        </div>
      </div>

      {/* Información Técnica & Metas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Metas Personales */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
              🎯 Objetivo de Temporada
            </h4>
          </div>
          <textarea
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            rows={3}
            className="w-full p-3 border border-slate-200 rounded-2xl text-xs text-slate-700 focus:ring-2 focus:ring-purple-500 focus:outline-none bg-slate-50 resize-none leading-relaxed"
          />
          <button className="bg-purple-600 text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-purple-700 transition-all active:scale-95">
            Guardar Meta
          </button>
        </div>

        {/* Logros y Reconocimientos */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs space-y-3">
          <h4 className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
            🏆 Insignias de Bienestar
          </h4>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-purple-50 p-2.5 rounded-2xl border border-purple-100">
              <span className="text-2xl block">🔥</span>
              <span className="text-[9px] font-bold text-purple-800">7 Días Constante</span>
            </div>
            <div className="bg-purple-50 p-2.5 rounded-2xl border border-purple-100">
              <span className="text-2xl block">🧠</span>
              <span className="text-[9px] font-bold text-purple-800">Mente Clara</span>
            </div>
            <div className="bg-slate-100 p-2.5 rounded-2xl border border-slate-200 opacity-50">
              <span className="text-2xl block">🔒</span>
              <span className="text-[9px] font-bold text-slate-500">1 Mes Activo</span>
            </div>
          </div>
        </div>

      </div>

      {/* Ajustes Rápidos */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs space-y-4">
        <h4 className="font-extrabold text-slate-800 text-sm">Configuración de Cuenta</h4>
        <div className="space-y-2 text-xs">
          <label className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100 cursor-pointer">
            <span className="font-medium text-slate-700">Recordatorio diario de registro de ánimo</span>
            <input type="checkbox" defaultChecked className="accent-purple-600 rounded w-4 h-4" />
          </label>
          <label className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100 cursor-pointer">
            <span className="font-medium text-slate-700">Notificaciones de nuevos recursos en la biblioteca</span>
            <input type="checkbox" defaultChecked className="accent-purple-600 rounded w-4 h-4" />
          </label>
        </div>
      </div>
    </div>
  )
}