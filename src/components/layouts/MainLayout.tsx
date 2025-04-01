import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Box from '@mui/material/Box';

const MainLayout = () => {
    return (
        <Box
            sx={{
                width: '100%',
                minHeight: '100vh',
                bgcolor: 'background.default',
            }}
        >
            <Header />
            <Sidebar />
            <Outlet />
        </Box>
    );
};

export default MainLayout;
