// src/context/ColorModeContext.tsx
import React, { createContext, useContext, useMemo, useState, FC } from 'react';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';

interface ColorModeContextValue {
    toggleColorMode: () => void;
}

const ColorModeContext = createContext<ColorModeContextValue>({
    toggleColorMode: () => {},
});

export const useColorMode = () => useContext(ColorModeContext);

export const CustomThemeProvider: FC<React.PropsWithChildren<object>> = ({ children }) => {
    const [mode, setMode] = useState<'light' | 'dark'>(() => {
        const storedMode = localStorage.getItem('color-mode'); // 로컨 스토리지에서 컬러모드에 대한 정보 들고옴.
        return storedMode === 'light' ? 'light' : 'dark';
    });


    const colorMode = useMemo(
        () => ({
            toggleColorMode: () => {
                setMode((prevMode) => {
                    const newMode = prevMode === 'light' ? 'dark' : 'light';
                    localStorage.setItem('color-mode', newMode); // 컬러모드 로컬 스토리지 저장.
                    return newMode;
                });
            },
        }),
        []
    );

    const theme = useMemo(
        () =>
            createTheme({
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
                },
            }),
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
