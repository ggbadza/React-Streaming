
import React, {useEffect, useState} from 'react';
import Carousel from 'react-material-ui-carousel';
import { Paper, Box, Typography } from '@mui/material';
import RatingGauge from "./RatingGauge.tsx";
import {FeaturedBannersResponse, fetchContentsById} from "../api/contentsApi.tsx";
import {usePopup} from "../context/PopupContext.tsx";

interface CarouselItemProps {
    item: {
        description: string;
        sequenceId: number;
        contentsId: number;
        title: string;
        type: string;
        userRating: number;
        posterUrl: string;
        thumbnailUrl: string;
        seriesId: string;
        season: string;
    };
}


const Item: React.FC<CarouselItemProps> = ({ item }) => {
    const { showPopup } = usePopup();

    const handleResultClick = async () => {
        try {
            // 클릭 시점에 직접 API를 호출하여 최신 데이터를 가져옵니다.
            const data = await fetchContentsById(item.contentsId);
            if (data) {
                showPopup(data);
            }
        } catch (error) {
            console.error("Error fetching contents data:", error);
            // 에러 처리 로직 (예: 사용자에게 알림)
        }
    };

    return (
        <Paper
            elevation={4}
            onClick={handleResultClick}
            sx={{
                position: 'relative', // 자식 요소의 absolute 포지셔닝 기준
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                // width: '100%',
                height: '35VW',
                // aspectRatio: '3 / 1',
                // overflow: 'hidden', // Paper 경계를 넘어가는 요소 숨김
                overflowY: 'visible', overflowX: 'clip',
                pl: '40%', // 왼쪽 콘텐츠 영역 확보 (포스터 너비 + 여백)
                pr: 4,
                py: 4,
                // backgroundColor: '#f5f5f5',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 0, // 콘텐츠(z-index: 1 이상)보다 뒤에 위치

                    // 배경 이미지 설정 (item에서 가져오는 넓은 배경 이미지 URL)
                    backgroundImage: `url(${item.thumbnailUrl})`, // backdropUrl 같은 속성이 필요
                    backgroundSize: 'contain',
                    backgroundPosition: 'right',

                    // 블러 효과 및 밝기 조절
                    filter: 'blur(8px) brightness(0.7)',
                },

                // 3. 자식 요소들이 가상요소 위에 오도록 position과 z-index 설정
                '& > *': {
                    // position: 'relative',
                    zIndex: 1,
                },
                cursor: 'pointer', // 클릭 가능함을 나타내는 커서
            }}
        >
            {/* 1. 포스터 이미지 */}
            <Box
                component="img"
                src={item.posterUrl}
                alt={item.title}
                sx={{
                    position: 'absolute',
                    left: '20%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)', // 정확한 중앙 정렬
                    height: '80%', // Paper 높이의 80%
                    width: 'auto',
                    borderRadius: 2,
                    boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                }}
            />

            {/* 2. 텍스트 정보 (오른쪽 영역) */}
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                width: '50%',
                height: '100%',
                gap: 1.5, // 요소 간 간격
            }}>
                {/* 2-1. 이름 */}
                <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', lineHeight: 1.2, fontSize: '2.5rem' }}>
                    {item.title}
                </Typography>

                {/* 2-2. 사용자 평점 */}
                <RatingGauge value={item.userRating} />

                {/* 2-3. 설명 */}
                <Typography variant="body1" color="text.secondary" sx={{
                    // 여러 줄의 텍스트를 자르고 ...으로 표시
                    display: '-webkit-box',
                    '-webkit-line-clamp': '3',
                    '-webkit-box-orient': 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                }}>
                    {item.description}
                </Typography>
            </Box>
        </Paper>
    );
};


const CarouselComponent: React.FC<{items: FeaturedBannersResponse[]}> = ({items}) => {

    return (
        <Carousel
            sx={{ overflowY: 'visible',
                overflowX: 'clip' ,
                // aspectRatio: '3 / 1',
            }}
            navButtonsAlwaysVisible={true}>
            {
                items.map((item) => <Item key={item.sequenceId} item={item} />)
            }
        </Carousel>
    );
};

export default CarouselComponent;
