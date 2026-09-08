import { useState } from 'react'
import { Login } from './pages/Login'
import { OnboardingProfile } from './pages/OnboardingProfile'
import { WelcomeBenefits } from './pages/WelcomeBenefits'
import { Home } from './pages/Home'
import { Sidebar } from './components/Sidebar'
import { Header } from './components/Header'
import { EmotionalRegister } from './pages/EmotionalRegister'
// import { GenericPage } from './pages/GenericPage'
import { Workouts } from './pages/Workouts'
import { Strategies } from './pages/Strategies'
import { Messages } from './pages/Messages'
import { Resources } from './pages/Resources'
import { Progress } from './pages/Progress'
import { Profile } from './pages/Profile'

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

  const handleLogout = () => {
    setUserEmail('')
    setCurrentTab('inicio')
    setScreen('login')
  }

  const handleLoginSuccess = (email: string, isNewUser: boolean) => {
    setUserEmail(email)
    setCurrentTab('inicio') 

    if (isNewUser) {
      setScreen('profile_survey')
    } else {
      setUserData({ name: email.split('@')[0], age: 16, position: 'Armador' })
      setScreen('dashboard')
    }
  }

  const handleProfileComplete = (data: { name: string; age: number; position: string }) => {
    setUserData(data)
    setScreen('welcome')
  }

  const handleFinishWelcome = () => {
    setCurrentTab('inicio') 
    setScreen('dashboard')
  }

  if (screen === 'login') {
    return <Login onSuccess={handleLoginSuccess} />
  }

  if (screen === 'profile_survey') {
    return <OnboardingProfile onComplete={handleProfileComplete} />
  }

  if (screen === 'welcome') {
    return <WelcomeBenefits userName={userData.name} onNext={handleFinishWelcome} />
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col md:flex-row antialiased">
      {/* Sidebar con botón de cerrar sesión en la esquina inferior */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        userEmail={userEmail}
        onLogout={handleLogout}
      />

      {/* Área Principal con Header en la parte superior derecha */}
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
            />
          )}
          {currentTab === 'registro' && <EmotionalRegister />}
          {currentTab === 'entrenamientos' && <Workouts userPosition={userData.position} />}
          {currentTab === 'estrategias' && <Strategies />}
          {currentTab === 'mensajes' && <Messages userName={userData.name} userPosition={userData.position} />}
          {currentTab === 'recursos' && <Resources />}
          {currentTab === 'progreso' && <Progress userName={userData.name} userPosition={userData.position} />}
          {currentTab === 'perfil' && <Profile userData={userData} />}
          
          {/*
          {currentTab !== 'inicio' &&
            currentTab !== 'registro' &&
            currentTab !== 'estrategias' &&
            currentTab !== 'mensajes' &&
            currentTab !== 'recursos' &&
            currentTab !== 'progreso' &&
            currentTab !== 'entrenamientos' && <GenericPage title={currentTab} />}
          */}
        </main>
      </div>
    </div>
  )
}

export default App  