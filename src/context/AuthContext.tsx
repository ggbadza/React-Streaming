// AuthContext.tsx
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axiosClient from '../api/axiosClient';
import { useNavigate } from 'react-router-dom';

interface User {
    userId: string;
    userName: string;
    userPlan: string;
}

interface AuthContextValue {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        // 백엔드에 "현재 유저 정보" 요청
        axiosClient.get('/user/me')
            .then(response => {
                setUser(response.data);  // 받아온 user 정보 저장
            })
            .catch(error => {
                // 401 등 에러가 나면 로그인 안된 상태
                setUser(null);
            });
    }, []);

    const logout = useCallback(async () => {
        try {
            await axiosClient.post('/user/logout');
            setUser(null); // 클라이언트 상태 초기화
            // localStorage.removeItem('accessToken');
            // localStorage.removeItem('refreshToken');
            console.log('로그아웃 성공');
            navigate('/login');
        } catch (error) {
            console.error('로그아웃 실패:', error);
            setUser(null);
        }
    }, [navigate]);

    return (
        <AuthContext.Provider value={{ user, setUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}