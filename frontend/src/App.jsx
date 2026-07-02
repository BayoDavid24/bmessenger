import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/react'
import { Button } from '@heroui/react';
import { ThemeProvider } from './context/ThemeContext';
import { WallpaperProvider } from './context/WallpaperContext';
import { Routes, Route } from 'react-router';
import ChatPage from './pages/ChatPage';
import AuthPage from './pages/Auth';




function App() {
  return (
    <ThemeProvider>
    <WallpaperProvider> 
      <Routes>
        <Route path="/" element={<ChatPage />} />
        <Route path="/auth" element={<AuthPage />} />
      </Routes>
    </WallpaperProvider>
    </ThemeProvider>
  )
}

export default App
