import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/react'
import { Button } from '@heroui/react';
import { ThemeProvider } from './context/ThemeContext';
import { WallpaperProvider } from './context/WallpaperContext';
import { Routes, Route, Navigate } from 'react-router';
import ChatPage from './pages/ChatPage';
import AuthPage from './pages/Auth';
import { useAuth } from '@clerk/react';




function App() {

  const {isSignedIn, isLoaded} = useAuth();

  //TODO: Make this a better loading component, maybe a spinner or something
  if (!isLoaded) return <div>Loading...</div>

  return (
    <ThemeProvider>
    <WallpaperProvider> 
      <Routes>
        <Route path="/" element={isSignedIn ? <ChatPage /> : <Navigate to ={"/auth"} replace />} />
        <Route 
        path="/auth" 
        element={!isSignedIn ? <AuthPage /> : <Navigate to="/" replace />} />
      </Routes>
    </WallpaperProvider>
    </ThemeProvider>
  )
}

export default App
