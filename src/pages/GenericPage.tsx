import React from 'react'

export const GenericPage: React.FC<{ title: string }> = ({ title }) => {
  return (
    <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
      <h2 className="text-xl font-bold text-slate-800 capitalize">{title}</h2>
      <p className="text-xs text-slate-400 mt-1">Sección en construcción para Mente en Juego.</p>
    </div>
  )
}