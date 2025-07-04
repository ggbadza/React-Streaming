import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import CarouselComponent from "./Carousel.tsx";

const RatingGauge: React.FC<{ value: number }> = ({ value }) => {
    const percentage = value * 10; // 10점 만점을 100% 기준으로 변환

    return (
        <Box sx={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ position: 'relative' }}>
                <CircularProgress
                    variant="determinate"
                    value={percentage}
                    size={50}
                    sx={{
                        color: (theme) =>
                            percentage > 70 ? theme.palette.success.main : percentage > 40 ? theme.palette.warning.main : theme.palette.error.main,
                    }}
                />
                <Box
                    sx={{
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        position: 'absolute',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Typography variant="caption" component="div" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                        {`${Math.round(percentage)}%`}
                    </Typography>
                </Box>
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{value.toFixed(1)}</Typography>
        </Box>
    );
};


export default RatingGauge;