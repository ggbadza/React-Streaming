import React, { FC, PropsWithChildren } from 'react';
import Box from "@mui/material/Box";
import RecommendContentsPage from "./RecommendContentsPage.tsx";

const MainPage: FC<PropsWithChildren<{}>> = () => {



    return (
        <Box>
            <Box sx={{ height: '500px' }}></Box>
            <RecommendContentsPage></RecommendContentsPage>
        </Box>
    );
};

export default MainPage;
