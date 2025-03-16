// AuthContext.tsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

interface User {
    userId: string;
    userName: string;
    userPlan: string;
}

interface AuthContextValue {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

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

    return (
        <AuthContext.Provider value={{ user, setUser }}>
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