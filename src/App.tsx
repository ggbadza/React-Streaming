import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import SignInPage from './pages/SignInPage.tsx';
import SignUpPage from './pages/SignUpPage.tsx'
// import MainPage from './pages/MainPage.tsx';
import { AuthProvider } from './context/AuthContext.tsx';


function App() {

  return (
      <BrowserRouter>
          <Routes>
              <Route path="/login" element={<SignInPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              {/*<AuthProvider>*/}
              {/*    <Route path="/" element={<MainPage />} />*/}
              {/*</AuthProvider>*/}
          </Routes>
      </BrowserRouter>

  )
}

export default App
