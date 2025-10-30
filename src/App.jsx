import { Navigate, Outlet } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'
import Header from './components/custom/Header'
import { Toaster } from './components/ui/sonner'

function App() {
  const { isLoaded, isSignedIn } = useUser() // ✅ removed `user`

  if (!isLoaded) return null
  if (!isSignedIn) return <Navigate to="/auth/sign-in" replace />

  return (
    <>
      <Header />
      <Outlet />
      <Toaster />
    </>
  )
}

export default App
