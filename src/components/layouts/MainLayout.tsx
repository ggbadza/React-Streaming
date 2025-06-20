import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

const MainLayout = () => {

    const theme = useTheme();  // 테마 가져오기

    const sidebarWidth = theme.spacing(7);
    const headerHeight = '60px';

    const contentPaddingValue = 2; // p: 2 에 해당하는 숫자 값
    const contentPadding = theme.spacing(contentPaddingValue); // 예: '16px'
    const totalHorizontalPadding = `calc(${contentPadding} * 2)`; // 예: '32px'


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
                    mt: headerHeight,
                    p: { sm : 0,
                        xs : contentPaddingValue},
                    maxWidth: {
                        xs:`calc(100vw - ${sidebarWidth})`,
                        sm:`calc(100vw - ${sidebarWidth} - ${totalHorizontalPadding})`,},
                }}
            >
                <Outlet />
            </Box>
        </Box>
    );
};

export default MainLayout;
