import { useState, useEffect } from 'react'
import { Login } from './pages/Login'
import { OnboardingProfile } from './pages/OnboardingProfile'
import { WelcomeBenefits } from './pages/WelcomeBenefits'
import { Home } from './pages/Home'
import { Sidebar } from './components/Sidebar'
import { Header } from './components/Header'
import { EmotionalRegister } from './pages/EmotionalRegister'
import { Workouts } from './pages/Workouts'
import { Strategies } from './pages/Strategies'
import { Messages } from './pages/Messages'
import { Resources } from './pages/Resources'
import { Progress } from './pages/Progress'
import { Profile } from './pages/Profile'

import { supabase } from './lib/supabase'
import type { User } from '@supabase/supabase-js'

// Unificamos el estado a 'profile_survey'
type ScreenState = 'login' | 'profile_survey' | 'welcome' | 'dashboard'

function App() {
  const [screen, setScreen] = useState<ScreenState>('login')
  const [userEmail, setUserEmail] = useState<string>('')
  const [userData, setUserData] = useState<{ name: string; age: number; position: string }>({
    name: '',
    age: 15,
    position: 'Punta',
  })
  const [currentTab, setCurrentTab] = useState('inicio')
  const [, setUser] = useState<User | null>(null)
  const [loadingSession, setLoadingSession] = useState(true)

  // Consultar el perfil en Supabase
  const fetchUserProfile = async (userId: string) => {
  try {
    const { data, error:_error } = await supabase
      .from('profiles')
      .select('name, age, position')
      .eq('id', userId)
      .maybeSingle()

    if (data) {
      // Usuario con perfil completo -> Dashboard
      setUserData({
        name: data.name,
        age: data.age,
        position: data.position,
      })
      setScreen('dashboard')
    } else {
      // Usuario autenticado sin perfil guardado -> Onboarding
      setScreen('profile_survey')
    }
  } catch {
    setScreen('profile_survey')
  } finally {
    setLoadingSession(false)
  }
}

  // Escuchar la sesión de autenticación
  useEffect(() => {
  // Verificar si hay sesión previa guardada al cargar la página
  supabase.auth.getSession().then(({ data: { session } }) => {
    if (session?.user) {
      setUser(session.user)
      setUserEmail(session.user.email || '')
      fetchUserProfile(session.user.id)
    } else {
      setScreen('login')
      setLoadingSession(false)
    }
  })

  // Escuchar cambios de estado en Auth
  const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
    if (session?.user) {
      setUser(session.user)
      setUserEmail(session.user.email || '')
      
      // Evaluar la redirección solo cuando ocurre un inicio de sesión explícito
      if (event === 'SIGNED_IN') {
        fetchUserProfile(session.user.id)
      }
    } else if (event === 'SIGNED_OUT') {
      setUser(null)
      setUserEmail('')
      setScreen('login')
    }
    setLoadingSession(false)
  })

  return () => subscription.unsubscribe()
}, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUserEmail('')
    setCurrentTab('inicio')
    setScreen('login')
  }

  const handleProfileComplete = async (data: { name: string; age: number; position: string }) => {
    setUserData(data)
    
    // Guardar los datos en Supabase
    const { data: authData } = await supabase.auth.getUser()
    if (authData.user) {
      await supabase.from('profiles').upsert({
        id: authData.user.id,
        name: data.name,
        age: data.age,
        position: data.position,
        updated_at: new Date().toISOString(),
      })
    }

    setScreen('welcome')
  }

  const handleFinishWelcome = () => {
    setCurrentTab('inicio')
    setScreen('dashboard')
  }

  // 1. Pantalla de carga mientras se verifica la sesión inicial
  if (loadingSession) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white font-bold">
        Cargando Mente en Juego...
      </div>
    )
  }

  // 2. Pantalla de Login
  if (screen === 'login') {
    return <Login onLoginSuccess={() => {}} />
  }

  // 3. Pantalla de Onboarding Profile
  if (screen === 'profile_survey') {
    return <OnboardingProfile onComplete={handleProfileComplete} />
  }

  // 4. Pantalla de Bienvenida / Beneficios
  if (screen === 'welcome') {
    return <WelcomeBenefits userName={userData.name} onNext={handleFinishWelcome} />
  }

  // 5. Pantalla Principal (Dashboard)
  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col md:flex-row antialiased">
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        userEmail={userEmail}
        onLogout={handleLogout}
      />

      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        <Header
          userName={userData.name}
          userPosition={userData.position}
          onLogout={handleLogout}
        />

        <main className="p-4 md:p-8 flex-1 w-full max-w-5xl mx-auto">
          {currentTab === 'inicio' && (
            <Home
              userName={userData.name}
              userAge={userData.age}
              userPosition={userData.position}
              onNavigateToRegister={() => setCurrentTab('registro')}
            />
          )}

          {currentTab === 'registro' && <EmotionalRegister />}
          {currentTab === 'entrenamientos' && <Workouts userPosition={userData.position} />}
          {currentTab === 'estrategias' && <Strategies />}
          {currentTab === 'mensajes' && <Messages userName={userData.name} userPosition={userData.position} />}
          {currentTab === 'recursos' && <Resources />}
          {currentTab === 'progreso' && <Progress 
            userName={userData.name} 
            userPosition={userData.position} 
            onNavigateToStrategies={() => setCurrentTab('estrategias')}
          />}
          {currentTab === 'perfil' && <Profile />}
        </main>
      </div>
    </div>
  )
}

export default App