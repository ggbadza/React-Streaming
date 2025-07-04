import React, {FC, PropsWithChildren, useEffect, useState} from 'react';
import Box from "@mui/material/Box";
import RecommendContentsPage from "./RecommendContentsPage.tsx";
import {FeaturedBannersResponse, fetchFeaturedBanners} from "../api/contentsApi.tsx";
import CarouselComponent from "../components/Carousel.tsx";

const MainPage: FC<PropsWithChildren<{}>> = () => {
    const [featuredBanners, setFeaturedBanners] = useState<FeaturedBannersResponse[]>([]);

    useEffect(() => {

        const fetchFeaturedData = async () => {
            try {
                const data = await fetchFeaturedBanners();
                setFeaturedBanners(data);
            } catch (error) {
                console.error('Failed to fetch featured contents:', error);
            }
        };

        fetchFeaturedData();
    }, []);



    return (
        <Box>
            {featuredBanners && featuredBanners.length > 0 ? (
                <CarouselComponent items={featuredBanners} />
            ) : (
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                </Box>
            )}
            <RecommendContentsPage />
        </Box>
    );
};

export default MainPage;
