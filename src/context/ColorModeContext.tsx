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

export const CustomThemeProvider: FC<React.PropsWithChildren<{}>> = ({ children }) => {
    const [mode, setMode] = useState<'light' | 'dark'>('light');

    const colorMode = useMemo(
        () => ({
            toggleColorMode: () => {
                setMode(prev => (prev === 'light' ? 'dark' : 'light'));
            },
        }),
        []
    );

    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode, // 'light' 또는 'dark'
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
