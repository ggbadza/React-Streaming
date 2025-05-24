import React from 'react';
import { Card, CardMedia, CardContent, Typography, Box , CardActionArea } from '@mui/material';

interface ContentCardProps {
    cardImage: string;      // 썸네일 이미지 URL
    title: string;      // 작품 제목
    type: string;       // 작품 타입 (영화, 애니 등)
    onClick: () => void; // 클릭 시 펑션
}

const ContentCard: React.FC<ContentCardProps> = ({ cardImage, title, type, onClick }) => {
    return (
        <Card
            sx={{
                width: {
                    xs: '30vw',
                    sm: '25vw',
                    md: '20vw',
                    lg: '15vw' ,
                },
                height: '100%',
                borderRadius: 1,
                overflow: 'hidden',
                position: 'relative',
            }}
        >
            <CardActionArea onClick={onClick}>
                {/* 콘텐츠 타입 */}
                {type && (
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 8,
                            left: 8,
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                            color: '#fff',
                            padding: '2px 6px',
                            borderRadius: 1,
                            fontSize: 12,
                            zIndex: 2,
                        }}
                    >
                        {type}
                    </Box>
                )}

                {/* 썸네일 */}
                <CardMedia
                    component="img"
                    alt={title}
                    image={cardImage}
                    sx={{
                        height: {
                            xs: '15vw',
                            sm: '12.5vw',
                            md: '10vw' ,
                            lg: '7.5vw'
                        },
                        objectFit: 'cover',
                    }}
                />

                {/* 작품 제목 */}
                <CardContent
                    sx={{
                        backgroundColor: '#141414',
                        color: '#fff',
                        paddingY: 1,
                    }}
                >
                    <Typography
                        variant="body2"
                        sx={{
                            fontSize: '1.2rem',
                            lineHeight: 1,
                            whiteSpace: 'nowrap',
                            // overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            mb: 0
                        }}
                    >
                        {title}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
};

export default ContentCard;
