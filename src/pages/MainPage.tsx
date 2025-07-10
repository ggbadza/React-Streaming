import React, {FC, PropsWithChildren, useEffect, useState} from 'react';
import Box from "@mui/material/Box";
import CircularProgress from '@mui/material/CircularProgress'
import RecommendContentsPage from "./RecommendContentsPage.tsx";
import {FeaturedBannersResponse, fetchFeaturedBanners} from "../api/contentsApi.tsx";
import CarouselComponent from "../components/Carousel.tsx";

const MainPage: FC<PropsWithChildren<{}>> = () => {
    const [featuredBanners, setFeaturedBanners] = useState<FeaturedBannersResponse[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchFeaturedData = async () => {
            try {
                const data = await fetchFeaturedBanners();
                setFeaturedBanners(data);
            } catch (error) {
                console.error('Failed to fetch featured contents:', error);
            } finally {
                setTimeout(() => {
                    setLoading(false);
                }, 300);
            }
        };

        fetchFeaturedData();
    }, []);



    return (
        <Box>
            {loading ? (
                // 로딩 중일 때는 로딩 인디케이터를 표시합니다.
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '35vw', // 캐러셀의 높이와 맞춰 레이아웃 변경을 최소화합니다.
                        minHeight: '200px', // 작은 화면을 위한 최소 높이
                        backgroundColor: '#1a1a1a', // (선택 사항) 캐러셀과 유사한 배경색
                    }}
                >
                    <CircularProgress color="primary" /> {/* Material-UI 로딩 스피너 */}
                </Box>
            ) : featuredBanners.length > 0 ? (
                // 로딩이 완료되고 데이터가 있으면 캐러셀을 렌더링합니다.
                <CarouselComponent items={featuredBanners} />
            ) : (
                // 로딩 완료 후에도 데이터가 없는 경우를 처리합니다.
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '35vw',
                    backgroundColor: '#1a1a1a',
                    color: 'white',
                }}>
                    콘텐츠를 불러올 수 없습니다.
                </Box>
            )}
            <RecommendContentsPage />
        </Box>
    );
};

export default MainPage;
