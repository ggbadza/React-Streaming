import { BrowserRouter, Routes, Route, Navigate  } from 'react-router-dom';
import './App.css';
import SignInPage from './pages/SignInPage.tsx';
import SignUpPage from './pages/SignUpPage.tsx';
import MainPage from './pages/MainPage.tsx';
import AnimationPage from './pages/AnimationPage.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import { CustomThemeProvider } from './context/ColorModeContext';
import CssBaseline from '@mui/material/CssBaseline';
import MainLayout from "./components/layouts/MainLayout.tsx";
import DramaPage from "./pages/DramaPage.tsx";
import MoviePage from "./pages/MoviePage.tsx";
import TestPage from "./pages/TestPage.tsx";
import WatchPage from "./pages/WatchPage.tsx";

function App() {
    return (
        <BrowserRouter>
            <CustomThemeProvider>
                <CssBaseline />
                <Routes>
                    <Route path="/login" element={<SignInPage />} />
                    <Route path="/signup" element={<SignUpPage />} />

                    {/*AuthProvider 공유(인증된 사용자만 접근 가능)*/}
                    <Route element={<AuthProvider> <MainLayout /> </AuthProvider> }>
                        <Route path="/main" element={<MainPage />} />
                        <Route path="/test" element={<TestPage />} />
                        <Route path="/anime" element={<AnimationPage />} />
                        <Route path="/drama" element={<DramaPage />} />
                        <Route path="/movie" element={<MoviePage />} />
                        <Route path="/watch/:id" element={<WatchPage />} />
                        {/* 등록되지 않은 모든 경로에 대해 /main으로 리다이렉트 */}
                        <Route path="*" element={<Navigate to="/main" replace />} />
                    </Route>
                </Routes>
            </CustomThemeProvider>
        </BrowserRouter>
    );
}

export default App;
