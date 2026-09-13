import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { MindsetButton } from '../components/MindsetButton'

interface ProfileData {
  name: string
  position: string
  category: string
  club: string
  season_goal: string
  daily_reminder: boolean
  library_notifications: boolean
}

// Interfaz para recibir la función de navegación como prop
interface ProfileProps {
  onNavigateToMindset: () => void
}

// Función auxiliar para formatear Nombres (Primera letra de cada palabra en mayúscula)
const capitalizeWords = (str: string): string => {
  if (!str) return ''
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export const Profile: React.FC<ProfileProps> = ({ onNavigateToMindset }) => {
  const [loading, setLoading] = useState<boolean>(true)
  const [saving, setSaving] = useState<boolean>(false)
  const [isEditing, setIsEditing] = useState<boolean>(false)

  // Control para ocultar el botón de la meta si ya se guardó hoy
  const [goalSavedToday, setGoalSavedToday] = useState<boolean>(false)

  // Datos reales guardados en Supabase
  const [profile, setProfile] = useState<ProfileData>({
    name: 'Atleta',
    position: 'Punta',
    category: 'Sub-17',
    club: 'Club Deportivo Vóley',
    season_goal: 'Mantener la concentración en los momentos bajo presión y mejorar la recepción.',
    daily_reminder: true,
    library_notifications: true,
  })

  // Estado borrador para la edición
  const [editForm, setEditForm] = useState<ProfileData>(profile)

  const [completedCount, setCompletedCount] = useState<number>(0)

  // Cargar Perfil y Estadísticas desde Supabase
  useEffect(() => {
    const fetchProfileAndStats = async () => {
      try {
        setLoading(true)
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        // Verificar si la meta ya se guardó hoy
        const today = new Date().toISOString().split('T')[0]
        const lastSavedDate = localStorage.getItem(`last_goal_save_${user.id}`)
        if (lastSavedDate === today) {
          setGoalSavedToday(true)
        }

        // 1. Obtener datos de la tabla profiles
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (error && error.code !== 'PGRST116') throw error

        if (data) {
          const loadedProfile: ProfileData = {
            name: data.name || 'Atleta',
            position: data.position || 'Punta',
            category: data.category || 'Sub-17',
            club: data.club || 'Club Deportivo Vóley',
            season_goal: data.season_goal || 'Mantener la concentración en los momentos bajo presión y mejorar la recepción.',
            daily_reminder: data.daily_reminder ?? true,
            library_notifications: data.library_notifications ?? true,
          }
          setProfile(loadedProfile)
          setEditForm(loadedProfile)
        }

        // 2. Obtener entrenamientos completados para las insignias
        const { count } = await supabase
          .from('training_plans')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('status', 'completed')

        setCompletedCount(count || 0)

      } catch (err) {
        console.error('Error al cargar el perfil:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProfileAndStats()
  }, [])

  // Iniciar modo edición sincronizando el borrador
  const handleStartEditing = () => {
    setEditForm({ ...profile })
    setIsEditing(true)
  }

  // Cancelar edición (descarta cambios del borrador)
  const handleCancelEditing = () => {
    setEditForm({ ...profile })
    setIsEditing(false)
  }

  // Guardar cambios directamente en Supabase desde el formulario completo
  const handleSaveProfile = async () => {
    try {
      setSaving(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const formattedName = capitalizeWords(editForm.name)

      const updatedData = {
        ...editForm,
        name: formattedName,
      }

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          name: updatedData.name,
          position: updatedData.position,
          category: updatedData.category,
          club: updatedData.club,
          season_goal: updatedData.season_goal,
          daily_reminder: updatedData.daily_reminder,
          library_notifications: updatedData.library_notifications,
          updated_at: new Date().toISOString(),
        })

      if (error) throw error

      setProfile(updatedData)
      setIsEditing(false)
      alert('✅ ¡Perfil actualizado en Supabase con éxito!')
    } catch (err) {
      console.error('Error al guardar perfil:', err)
      alert('Ocurrió un error al guardar los cambios en la base de datos.')
    } finally {
      setSaving(false)
    }
  }

  // Guardar exclusivamente el Objetivo de Temporada
  const handleSaveSeasonGoal = async () => {
    try {
      setSaving(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          ...profile,
          season_goal: profile.season_goal,
          updated_at: new Date().toISOString(),
        })

      if (error) throw error

      // Marcar guardado de hoy
      const today = new Date().toISOString().split('T')[0]
      localStorage.setItem(`last_goal_save_${user.id}`, today)
      setGoalSavedToday(true)

      alert('🎯 ¡Objetivo de temporada guardado!')
    } catch (err) {
      console.error('Error al guardar la meta:', err)
      alert('Error al actualizar tu objetivo.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-3">
        <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-semibold text-slate-500">Cargando perfil del atleta...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-8">
      {/* Encabezado */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-slate-800">Mi Perfil Atleta</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Gestiona tu información personal, tus objetivos de temporada y configuraciones.
          </p>
        </div>
        
        {/* Acciones de Edición */}
        <div>
          {isEditing ? (
            <div className="flex gap-2">
              <button
                onClick={handleCancelEditing}
                disabled={saving}
                className="text-xs font-bold px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveProfile}
                disabled={saving}
                className="text-xs font-bold px-4 py-2 rounded-xl bg-purple-600 text-white hover:bg-purple-700 transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {saving ? 'Guardando...' : '💾 Guardar Cambios'}
              </button>
            </div>
          ) : (
            <button
              onClick={handleStartEditing}
              className="text-xs font-bold px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-all shadow-2xs cursor-pointer"
            >
              ✏️ Editar Perfil
            </button>
          )}
        </div>
      </div>

      {/* Tarjeta de Identificación del Atleta */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center gap-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-purple-100 border-4 border-purple-500 flex items-center justify-center text-4xl shadow-inner">
            🏐
          </div>
        </div>

        <div className="text-center sm:text-left space-y-2 flex-1">
          {isEditing ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Nombre Completo</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  placeholder="Ej: Juan Pérez"
                  className="w-full text-xs p-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Posición de Juego</label>
                <select
                  value={editForm.position}
                  onChange={(e) => setEditForm({ ...editForm, position: e.target.value })}
                  className="w-full text-xs p-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none bg-white"
                >
                  <option value="Punta">Punta / Receptor</option>
                  <option value="Central">Central</option>
                  <option value="Libero">Líbero</option>
                  <option value="Armador">Armador / Pasador</option>
                  <option value="Opuesto">Opuesto</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Categoría Sub-13 a Sub-18</label>
                <select
                  value={editForm.category}
                  onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                  className="w-full text-xs p-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none bg-white"
                >
                  <option value="Sub-13">Sub-13 (13 años)</option>
                  <option value="Sub-14">Sub-14 (14 años)</option>
                  <option value="Sub-15">Sub-15 (15 años)</option>
                  <option value="Sub-16">Sub-16 (16 años)</option>
                  <option value="Sub-17">Sub-17 (17 años)</option>
                  <option value="Sub-18">Sub-18 (18 años)</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Club / Equipo</label>
                <input
                  type="text"
                  value={editForm.club}
                  onChange={(e) => setEditForm({ ...editForm, club: e.target.value })}
                  className="w-full text-xs p-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>
            </div>
          ) : (
            <>
              <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-100">
                {profile.category}
              </span>
              <h3 className="text-xl font-black text-slate-800 mt-1">
                {capitalizeWords(profile.name)}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Posición: <span className="font-bold text-slate-700">{profile.position}</span> • {profile.club}
              </p>
            </>
          )}
        </div>
      </div>

      {/* Información Técnica & Metas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Metas Personales */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs space-y-3">
          <h4 className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
            🎯 Objetivo de Temporada
          </h4>
          <textarea
            value={isEditing ? editForm.season_goal : profile.season_goal}
            onChange={(e) => {
              setGoalSavedToday(false)
              if (isEditing) {
                setEditForm({ ...editForm, season_goal: e.target.value })
              } else {
                setProfile({ ...profile, season_goal: e.target.value })
              }
            }}
            rows={3}
            placeholder="Escribe tu meta deportiva o mental para esta temporada..."
            className="w-full p-3 border border-slate-200 rounded-2xl text-xs text-slate-700 focus:ring-2 focus:ring-purple-500 focus:outline-none bg-slate-50 resize-none leading-relaxed"
          />
          {!isEditing && (
            <div className="flex items-center gap-2">
              {!goalSavedToday ? (
                <button
                  onClick={handleSaveSeasonGoal}
                  disabled={saving}
                  className="bg-purple-600 text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-purple-700 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  {saving ? 'Guardando...' : 'Guardar Meta'}
                </button>
              ) : (
                <p className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">
                  ✓ Objetivo actualizado hoy
                </p>
              )}
            </div>
          )}
        </div>

        {/* Insignias Dinámicas con el Botón Integrado Abajo */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs space-y-3">
          <h4 className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
            🏆 Insignias de Bienestar
          </h4>
          <div className="grid grid-cols-3 gap-2 text-center">
            
            <div className={`p-2.5 rounded-2xl border transition-all ${
              completedCount >= 3 
                ? 'bg-purple-50 border-purple-100 text-purple-800' 
                : 'bg-slate-100 border-slate-200 opacity-50'
            }`}>
              <span className="text-2xl block">{completedCount >= 3 ? '🔥' : '🔒'}</span>
              <span className="text-[9px] font-bold block mt-1">
                {completedCount >= 3 ? 'Atleta Constante' : '3 Entrenamientos'}
              </span>
            </div>

            <div className="bg-purple-50 p-2.5 rounded-2xl border border-purple-100">
              <span className="text-2xl block">🧠</span>
              <span className="text-[9px] font-bold text-purple-800 block mt-1">Mente Clara</span>
            </div>

            <div className={`p-2.5 rounded-2xl border transition-all ${
              completedCount >= 10 
                ? 'bg-purple-50 border-purple-100 text-purple-800' 
                : 'bg-slate-100 border-slate-200 opacity-50'
            }`}>
              <span className="text-2xl block">{completedCount >= 10 ? '👑' : '🔒'}</span>
              <span className="text-[9px] font-bold block mt-1">
                {completedCount >= 10 ? 'Elite Volley' : '10 Entrenamientos'}
              </span>
            </div>

          </div>

          {/* 🧠 Botón Dinámico de Mindset ubicado abajo de las insignias */}
          <div className="pt-2 border-t border-slate-100">
            <MindsetButton onNavigate={onNavigateToMindset} />
          </div>
        </div>

      </div>

      {/* Ajustes de Notificaciones */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs space-y-4">
        <h4 className="font-extrabold text-slate-800 text-sm">Configuración de Cuenta</h4>
        <div className="space-y-2 text-xs">
          <label className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100 cursor-pointer">
            <span className="font-medium text-slate-700">Recordatorio diario de registro de ánimo</span>
            <input
              type="checkbox"
              checked={isEditing ? editForm.daily_reminder : profile.daily_reminder}
              onChange={(e) => {
                if (isEditing) {
                  setEditForm({ ...editForm, daily_reminder: e.target.checked })
                } else {
                  setProfile({ ...profile, daily_reminder: e.target.checked })
                }
              }}
              className="accent-purple-600 rounded w-4 h-4 cursor-pointer"
            />
          </label>
          <label className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100 cursor-pointer">
            <span className="font-medium text-slate-700">Notificaciones de nuevos recursos en la biblioteca</span>
            <input
              type="checkbox"
              checked={isEditing ? editForm.library_notifications : profile.library_notifications}
              onChange={(e) => {
                if (isEditing) {
                  setEditForm({ ...editForm, library_notifications: e.target.checked })
                } else {
                  setProfile({ ...profile, library_notifications: e.target.checked })
                }
              }}
              className="accent-purple-600 rounded w-4 h-4 cursor-pointer"
            />
          </label>
        </div>
      </div>
    </div>
  )
}