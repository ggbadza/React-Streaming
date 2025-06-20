// src/context/ColorModeContext.tsx
import React, { createContext, useContext, useMemo, useState, FC } from 'react';
import { createTheme, ThemeProvider, CssBaseline, responsiveFontSizes } from '@mui/material'; // responsiveFontSizes 추가 임포트

interface ColorModeContextValue {
    toggleColorMode: () => void;
}

const ColorModeContext = createContext<ColorModeContextValue>({
    toggleColorMode: () => {},
});

export const useColorMode = () => useContext(ColorModeContext);

export const CustomThemeProvider: FC<React.PropsWithChildren<object>> = ({ children }) => {
    const [mode, setMode] = useState<'light' | 'dark'>(() => {
        const storedMode = localStorage.getItem('color-mode');
        return storedMode === 'light' ? 'light' : 'dark';
    });

    const colorMode = useMemo(
        () => ({
            toggleColorMode: () => {
                setMode((prevMode) => {
                    const newMode = prevMode === 'light' ? 'dark' : 'light';
                    localStorage.setItem('color-mode', newMode);
                    return newMode;
                });
            },
        }),
        []
    );

    const theme = useMemo(
        () => {
            // 기본 테마 객체 생성
            let baseTheme = createTheme({
                palette: {
                    mode,
                    primary: {
                        main: '#90caf9', // 예시: light/dark 모드 모두에서 사용할 primary 색상
                        light: '#e3f2fd',
                        dark: '#42a5f5',
                        contrastText: '#000000', // 대비되는 텍스트 색상
                    },
                    secondary: { // secondary 색상을 연한 회색 계열로 정의
                        main: '#bdbdbd', // 중간 회색
                        light: '#efefef', // 더 밝은 회색
                        dark: '#8d8d8d',  // 더 어두운 회색
                        contrastText: '#000000', // 대비되는 텍스트 색상 (밝은 회색 위에는 검정색이 좋음)
                    },
                    ...(mode === 'dark' && {
                        background: {
                            default: '#212529',
                            paper: '#2a2f33',
                        },
                        text: {
                            primary: '#ffffff',
                            secondary: '#dddddd',
                        },
                    }),
                },
                // 여기에 typography, components, breakpoints 등 다른 테마 설정 추가
                typography: {
                    // 예시: 기본 폰트 패밀리 설정
                    fontFamily: 'Roboto, sans-serif',
                    h4: {
                        fontSize: '2rem', // 기본 크기 설정
                        '@media (min-width:600px)': {
                            fontSize: '2.5rem',
                        },
                    },
                },
                components: {
                    // 예시: 버튼의 기본 스타일 오버라이드
                    MuiButton: {
                        styleOverrides: {
                            root: {
                                borderRadius: 8, // 버튼 모서리 둥글게
                            },
                        },
                    },
                },
            });

            baseTheme = responsiveFontSizes(baseTheme);

            return baseTheme;
        },
        [mode]
    );

    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
};