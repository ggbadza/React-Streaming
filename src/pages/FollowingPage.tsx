import React, { useState, useEffect } from 'react';
import { Box, CircularProgress, Alert } from '@mui/material';
import RecommendRow from '../components/layouts/RecommendRow';
import {ContentsResponse, fetchFollowingContents} from '../api/contentsApi.tsx';

const FollowingPage: React.FC = () => {
    const [followingContents, setFollowingContents] = useState<ContentsResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const data = await fetchFollowingContents();
                setFollowingContents(data);
                setError(null);
            } catch (error) {
                console.error('Failed to fetch following contents:', error);
                setError('팔로잉 컨텐츠를 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh'
            }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                padding: 2
            }}>
                <Alert severity="error" sx={{ maxWidth: 500 }}>
                    {error}
                </Alert>
            </Box>
        );
    }

    if (followingContents.length === 0) {
        return (
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                padding: 2
            }}>
                <Alert severity="info">
                    팔로잉 컨텐츠가 없습니다.
                </Alert>
            </Box>
        );
    }

    return (
        <Box>
            <Box sx={{ height: '300px' }}></Box>
            <Box sx={{
                width: '100%',
                maxWidth: '100%',
                overflowX: 'hidden',
                display: 'flex',
                justifyContent: 'flex-start',
            }}>
                <RecommendRow
                    key={`${0}`}
                    description={"팔로잉 중인 컨텐츠"}
                    contentsList={followingContents}
                />
            </Box>
        </Box>
    );
};

export default FollowingPage;