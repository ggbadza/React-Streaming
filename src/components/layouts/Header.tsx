import React from 'react';
import { IconButton } from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { useTheme } from '@mui/material/styles';
import { useColorMode } from '../../context/ColorModeContext';
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import {useNavigate} from "react-router-dom";

const Header: React.FC = () => {
    const theme = useTheme();
    const { toggleColorMode } = useColorMode();
    const navigate = useNavigate();
    return (
        <Box sx={{
            position: 'fixed',        // 고정 위치 추가
            top: 0,
            left: 0,
            right: 0,
            height: '60px',
            display: 'flex',          // flexbox 레이아웃
            alignItems: 'center',     // 세로 중앙 정렬
            justifyContent: 'center',
            // padding: '0 20px',        // 좌우 패딩
            // bgcolor: 'background.paper', // 배경색 추가
            zIndex: theme.zIndex.appBar,
            // borderBottom: `1px solid ${theme.palette.divider}` // 하단 구분선
        }}>
            <Button
                onClick={() => navigate("/main")}
                sx={{
                    fontSize: '1.8rem',
                    color: 'text.primary',
                    fontWeight: 600,
                    position: 'absolute',
                    textTransform: 'none',
                    // margin: '0 auto',  // 중앙 정렬
                }}
            >
                TANKMILU
            </Button>
            <IconButton
                onClick={toggleColorMode}
                color="inherit"
                sx={{
                    marginLeft: 'auto',
                    right: 10,
                }}
            >
                {theme.palette.mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
        </Box>
    );
};

export default Header;
