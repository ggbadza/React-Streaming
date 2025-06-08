import React, {useEffect, useState, useRef } from 'react';
import {Card, CardMedia, CardContent, Typography, Box, CardActionArea, keyframes} from '@mui/material';

const scrollText = keyframes`
  0% { transform: translateX(0%); }
  100% { transform: translateX(-50%); }
`;

interface ContentCardProps {
    cardImage: string;      // 썸네일 이미지 URL
    title: string;      // 작품 제목
    type: string;       // 작품 타입 (영화, 애니 등)
    onClick: () => void; // 클릭 시 펑션
}

const ContentCard: React.FC<ContentCardProps> = ({ cardImage, title, type, onClick }) => {
    const textRef = useRef<HTMLDivElement>(null); // Typography의 ref
    const containerRef = useRef<HTMLDivElement>(null); // Box의 ref
    const [isTextOverflowing, setIsTextOverflowing] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [animationDuration, setAnimationDuration] = useState('0s');
    // 텍스트 초과 여부 감지 및 애니메이션 시간 계산
    useEffect(() => {
        const checkOverflow = () => {
            if (textRef.current && containerRef.current) {
                const textWidth = textRef.current.scrollWidth; // 실제 텍스트의 전체 너비
                const containerWidth = containerRef.current.offsetWidth; // 부모 Box의 너비

                // 텍스트가 컨테이너를 넘어가는지 확인 (여유 공간 5px 둠)
                if (textWidth > containerWidth + 5) {
                    setIsTextOverflowing(true);
                    // 텍스트 길이에 비례하여 애니메이션 시간 조절 (100px 당 1.5초)
                    const duration = title.length/10;
                    setAnimationDuration(`${duration}s`);
                } else {
                    setIsTextOverflowing(false);
                    setAnimationDuration('0s');
                }
            }
        };

        // 컴포넌트 마운트 시, title 변경 시, 창 크기 변경 시 체크
        checkOverflow();
        window.addEventListener('resize', checkOverflow);

        return () => window.removeEventListener('resize', checkOverflow);
    }, [title]); // title이 변경될 때 다시 체크

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
            <CardActionArea onClick={onClick}
                            onMouseEnter={() => isTextOverflowing && setIsHovered(true)}
                            onMouseLeave={() => isTextOverflowing && setIsHovered(false)}>
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
                    <Box
                        ref={containerRef} // 이 Box가 텍스트를 감싸고 overflow를 처리
                        sx={{
                            overflow: 'hidden', // 넘치는 텍스트 숨김
                            whiteSpace: 'nowrap', // 텍스트 줄바꿈 방지
                            position: 'relative',
                            width: '100%',
                        }}
                    >
                        <Typography
                            ref={textRef} // 이 Typography가 실제 텍스트
                            variant="body2"
                            sx={{
                                fontSize: '1.2rem',
                                lineHeight: 1,
                                display: 'inline-block', // 애니메이션 적용을 위해 필요
                                mb: 0,
                                // 텍스트가 넘치고, 호버됐을 때만 애니메이션 적용
                                animation: isHovered && isTextOverflowing
                                    ? `${scrollText} ${animationDuration} linear infinite alternate`
                                    : 'none',
                                // 호버가 풀리면 원래 위치로
                                transform: !isHovered || !isTextOverflowing ? 'translateX(0%)' : undefined,
                            }}
                        >
                            {title}
                        </Typography>
                    </Box>
                </CardContent>
            </CardActionArea>
        </Card>
    );
};

export default ContentCard;
