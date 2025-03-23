import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import SignInPage from './pages/SignInPage.tsx';
import SignUpPage from './pages/SignUpPage.tsx'
import MainPage from './pages/MainPage.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import { CustomThemeProvider } from './context/ColorModeContext';


function App() {

  return (
      <BrowserRouter>
          <CustomThemeProvider>
              <Routes>
                  <Route path="/login" element={<SignInPage />} />
                  <Route path="/signup" element={<SignUpPage />} />
                  <Route
                      path="/main"
                      element={
                          <AuthProvider>
                              <MainPage />
                          </AuthProvider>
                      }
                  />
              </Routes>
          </CustomThemeProvider>
      </BrowserRouter>

  )
}

export default App
