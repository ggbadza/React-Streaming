import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import MobileSidebar from './MobileSidebar.tsx';
import useMediaQuery from '@mui/material/useMediaQuery';

const MainLayout = () => {

    const theme = useTheme();  // 테마 가져오기
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const sidebarWidth = theme.spacing(7);
    const headerHeight = '60px';
    const mobileSidebarHeight = '56px'; // 모바일 사이드바의 높이를 정의합니다.

    const contentPaddingValue = 2; // p: 2 에 해당하는 숫자 값
    const contentPadding = theme.spacing(contentPaddingValue); // 예: '16px'
    const totalHorizontalPadding = `calc(${contentPadding} * 2)`; // 예: '32px'


    return (
        <Box
            sx={{
                bgcolor: 'background.default',
            }}
        >
            <Header />
            {isMobile && (
                <Box sx={{
                    position: 'absolute',
                    top: headerHeight, // Header 바로 아래에 고정
                    left: 0,
                    right: 0,
                    zIndex: theme.zIndex.appBar - 1, // Header보다는 아래, 콘텐츠보다는 위에 위치
                }}>
                    <MobileSidebar />
                </Box>
            )}
            {!isMobile && <Sidebar />}
            <Box
                sx={{
                    flex: 1,
                    ml: { xs: 0, sm: sidebarWidth },
                    // 모바일에서는 Header와 MobileSidebar의 높이를 모두 더한 만큼 콘텐츠를 내립니다.
                    mt: { xs: `calc(${headerHeight} + ${mobileSidebarHeight})`, sm: headerHeight },
                    p: 0,
                    maxWidth: {
                        xs: '100vw',
                        sm: `calc(100vw - ${sidebarWidth} - ${totalHorizontalPadding})`,
                    },
                }}
            >
                <Outlet />
            </Box>
        </Box>
    );
};

export default MainLayout;
