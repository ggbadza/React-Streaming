import React from "react";
import TreeView from "../components/layouts/TreeView.tsx";
import MuiCard from '@mui/material/Card';
import {styled} from "@mui/material/styles";
import Box from "@mui/material/Box";

const Card = styled(MuiCard)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    width: '100%',
    padding: theme.spacing(4),
    gap: theme.spacing(2),
    margin: 'auto',
    [theme.breakpoints.up('sm')]: {
        maxWidth: '1000px',
    },
    boxShadow:
        theme.palette.mode === 'dark'
            ? 'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px'
            : 'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
}));

const AnimationPage: React.FC = () => {
    return (
        <Box sx={{ mt : 10, minHeight: '100vh' }}>
            <Card variant="outlined">
                <div>
                    <h1>애니메이션 리스트</h1>
                    <TreeView type="anime" />
                </div>
            </Card>
        </Box>
    );
};

export default AnimationPage;
