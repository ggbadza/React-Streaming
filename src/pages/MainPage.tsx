import React, { FC, PropsWithChildren } from 'react';
import Header from '../components/layouts/Header';
import Sidebar from '../components/layouts/Sidebar';
import Box from "@mui/material/Box";

const MainPage: FC<PropsWithChildren<{}>> = () => {
    return (
        <Box
            sx={{
                width: "100%",
                minHeight: "100vh",
                bgcolor: "background.default",
            }}
        >
            <Header />
            <Sidebar />
        </Box>
    );
};

export default MainPage;
