import React from 'react';
import { Box, Typography } from '@mui/material';
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';

const RatingGauge: React.FC<{ value: number, color?: string }> = ({ value, color }) => {
    const percentage = value * 10; // 10점 만점을 100% 기준으로 변환

    return (
        <Box sx={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ position: 'relative' }}>
                <Gauge
                    cornerRadius="50%"
                    value={percentage}
                    sx={(theme) => ({

                        width: { xs: 60, sm: 80 },
                        height: { xs: 60, sm: 80 },
                        // 값(%)에 따라 게이지(valueArc)의 fill 색상을 동적으로 변경
                        [`& .${gaugeClasses.valueArc}`]: {
                            fill:
                                percentage > 70
                                    ? theme.palette.success.main
                                    : percentage > 40
                                        ? theme.palette.warning.main
                                        : theme.palette.error.main,
                        },
                        [`& .${gaugeClasses.valueText}`]: {
                            fontSize: {
                                xs: '18px',
                                sm: '25px'},
                            fontWeight: 'bold'
                        },
                        [`& .${gaugeClasses.valueText} text`]: {
                            fill: '#FFFFFF',
                        },
                        // 배경이 되는 회색 원(referenceArc) 스타일
                        [`& .${gaugeClasses.referenceArc}`]: {
                            fill: '#E0E0E0',
                        },
                    })}
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
                    {/*<Typography variant="caption" component="div" color="text.secondary" sx={{ fontWeight: 'bold',color: '#FFFFFF' }}>*/}
                    {/*    {`%`}*/}
                    {/*</Typography>*/}
                </Box>
            </Box>
        </Box>
    );
};


export default RatingGauge;