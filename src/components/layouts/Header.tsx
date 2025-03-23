import React from 'react';
import { IconButton } from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { useTheme } from '@mui/material/styles';
import { useColorMode } from '../../context/ColorModeContext';

const Header: React.FC = () => {
    const theme = useTheme();
    const { toggleColorMode } = useColorMode();

    return (
        <IconButton
            onClick={toggleColorMode}
            color="inherit"
            sx={{
                position: 'absolute',
                top: 10,
                right: 10,
            }}
        >
            {theme.palette.mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>
    );
};

export default Header;
