import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';

const RatingGauge: React.FC<{ value: number, color?: string }> = ({ value, color }) => {
    const percentage = value * 10; // 10점 만점을 100% 기준으로 변환

    return (
        <Box sx={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ position: 'relative' }}>
                <CircularProgress
                    variant="determinate"
                    value={percentage}
                    size={50}
                    sx={{
                        // 칼라 존재 시 테마색이 아닌 칼라를 쓰도록
                        color: ((theme) =>
                                percentage > 70 ? theme.palette.success.main : percentage > 40 ? theme.palette.warning.main : theme.palette.error.main
                        ),
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
                    <Typography variant="caption" component="div" color="text.secondary" sx={{ fontWeight: 'bold',color: {color} }}>
                        {`${Math.round(percentage)}%`}
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};


export default RatingGauge;