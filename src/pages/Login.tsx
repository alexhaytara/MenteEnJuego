import React, { useState } from 'react'
import bgLogin from '../assets/bg-login.jpg'

interface LoginProps {
  onSuccess: (email: string, isNewUser: boolean) => void
}

export const Login: React.FC<LoginProps> = ({ onSuccess }) => {
  // Ahora inicia en 'false' para mostrar primero "Iniciar sesión"
  const [isRegistering, setIsRegistering] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim() && password.trim()) {
      onSuccess(email, isRegistering)
    }
  }

  return (
    <div
      className="min-h-screen w-full relative flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat font-sans"
      style={{ backgroundImage: `url(${bgLogin})` }}
    >
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"></div>

      <div className="relative z-10 bg-white/95 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/20 shadow-2xl w-full max-w-md space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-purple-100 text-purple-700 rounded-2xl mx-auto flex items-center justify-center font-bold text-3xl shadow-sm">
            {isRegistering ? '👤' : '🏐'}
          </div>
          <h1 className="text-2xl font-black text-slate-800 tracking-wider">
            {isRegistering ? 'CREAR CUENTA' : 'INICIAR SESIÓN'}
          </h1>
          <p className="text-xs font-medium text-slate-500">
            {isRegistering
              ? 'Únete a Mente en Juego'
              : 'Bienvenido/a de nuevo a tu entrenamiento mental'}
          </p>

          <div className="pt-2">
            <p className="italic text-purple-700 text-sm font-serif bg-purple-50/80 py-1.5 px-3 rounded-lg border border-purple-100 shadow-xs">
              "{isRegistering ? 'Cada gran logro comienza con un paso' : 'Cada gran logro comienza con un paso'}"
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Correo electrónico
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com"
              className="w-full p-3 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-3 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl transition-all text-xs shadow-md active:scale-[0.98]"
          >
            {isRegistering ? 'Registrarme' : 'Iniciar sesión'}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-200">
          <p className="text-xs text-slate-600">
            {isRegistering ? '¿Ya tienes una cuenta?' : '¿Aún no tienes cuenta?'}
            <button
              onClick={() => setIsRegistering(!isRegistering)}
              className="ml-1.5 text-purple-700 font-bold hover:underline"
            >
              {isRegistering ? 'Inicia sesión aquí' : 'Regístrate aquí'}
            </button>
          </p>
        </div>

      </div>
    </div>
  )
}