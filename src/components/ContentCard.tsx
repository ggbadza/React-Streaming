import React from 'react';
import { Card, CardMedia, CardContent, Typography, Box , CardActionArea } from '@mui/material';

interface ContentCardProps {
    cid: number;        // 컨텐츠 ID
    image: string;      // 썸네일 이미지 URL
    title: string;      // 작품 제목
    type: string;       // 작품 타입 (영화, 애니 등)
    fid: number;        // 폴더 ID
}

const ContentCard: React.FC<ContentCardProps> = ({ image, title, type }) => {
    return (
        <Card
            sx={{
                width: 250, // 원하는 카드 너비
                borderRadius: 1,
                overflow: 'hidden',
                position: 'relative',
            }}
        >
            <CardActionArea>
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
                    image={image}
                    sx={{
                        height: 150, // 카드 높이
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
