import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import './App.css';
import SignInPage from './pages/SignInPage.tsx';
import SignUpPage from './pages/SignUpPage.tsx';
import MainPage from './pages/MainPage.tsx';
import AnimationPage from './pages/AnimationPage.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import { CustomThemeProvider } from './context/ColorModeContext';
import CssBaseline from '@mui/material/CssBaseline';

function App() {
    return (
        <BrowserRouter>
            <CustomThemeProvider>
                <CssBaseline />
                <Routes>
                    <Route path="/login" element={<SignInPage />} />
                    <Route path="/signup" element={<SignUpPage />} />

                    {/*AuthProvider 공유(인증된 사용자만 접근 가능)*/}
                    <Route element={<AuthProvider> <Outlet /> </AuthProvider> }>
                        <Route path="/main" element={<MainPage />} />
                        <Route path="/ani" element={<AnimationPage />} />
                    </Route>
                </Routes>
            </CustomThemeProvider>
        </BrowserRouter>
    );
}

export default App;
