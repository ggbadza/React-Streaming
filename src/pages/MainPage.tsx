import React, { FC, PropsWithChildren } from 'react';
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
        </Box>
    );
};

export default MainPage;
