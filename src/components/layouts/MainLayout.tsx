import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

const MainLayout = () => {

    const theme = useTheme();  // 테마 가져오기
    const sidebarWidth = `calc(${theme.spacing(7)} + 11px)`;

    return (
        <Box
            sx={{
                // width: '100vw',
                // minHeight: '90vh',
                bgcolor: 'background.default',
            }}
        >
            <Header />
            <Sidebar />
            <Box
                sx={{
                    flex: 1,
                    ml: sidebarWidth,
                    mt: '60px',  // 헤더 높이만큼 상단 마진 추가
                    p: 2,        // 내용 패딩 추가
                }}
            >
                <Outlet />
            </Box>
        </Box>
    );
};

export default MainLayout;
