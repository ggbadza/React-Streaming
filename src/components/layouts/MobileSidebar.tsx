import * as React from 'react';
import Box from '@mui/material/Box';
import SidebarContent from './SidebarContent';
import { Paper } from "@mui/material";

const MobileSidebar: React.FC = () => {
    return (
        <Paper elevation={3} sx={{ width: '100%' }}>
            <Box sx={{
                position: 'absolute',
                width: '100%',
                overflowX: 'auto',
                bgcolor: 'background.paper',
                // px: 1,
                display: 'flex',
                alignItems: 'center',
            }}>
                <SidebarContent isMobile={true} />
            </Box>
        </Paper>
    );
};

export default MobileSidebar;
