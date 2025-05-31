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
                    // 라이트 모드의 기본 배경색과 텍스트 색상을 명시적으로 설정할 수도 있습니다.
                    // (mode === 'light' && {
                    //    background: {
                    //        default: '#ffffff',
                    //        paper: '#f5f5f5',
                    //    },
                    //    text: {
                    //        primary: '#000000',
                    //        secondary: '#555555',
                    //    },
                    // }),
                },
                // 여기에 typography, components, breakpoints 등 다른 테마 설정 추가
                typography: {
                    // 예시: 기본 폰트 패밀리 설정
                    fontFamily: 'Roboto, sans-serif',
                    h4: {
                        fontSize: '2rem', // 기본 크기 설정
                        '@media (min-width:600px)': {
                            fontSize: '2.5rem', // 반응형 설정은 responsiveFontSizes가 처리하지만, 직접 지정도 가능
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

            // 생성된 테마에 responsiveFontSizes 적용
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