import React, { useState, useEffect } from 'react';
import { Box, CircularProgress, Alert } from '@mui/material';
import RecommendRow from '../components/layouts/RecommendRow';
import { RecommendContentsResponse, fetchRecommendContents } from '../api/contentsApi.tsx';

const RecommendContentsPage: React.FC = () => {
  const [recommendContents, setRecommendContents] = useState<RecommendContentsResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await fetchRecommendContents();
        setRecommendContents(data);
        setError(null);
      } catch (error) {
        console.error('Failed to fetch recommend contents:', error);
        setError('추천 컨텐츠를 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.');
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

  if (recommendContents.length === 0) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        padding: 2
      }}>
        <Alert severity="info">
          추천 컨텐츠가 없습니다.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{
      width: '100%',
      overflowY: 'hidden',
    }}>
      {recommendContents.map((recommendContent) => (
        <RecommendRow
          key={`${recommendContent.recommendSeq}`}
          description={recommendContent.description}
          contentsList={recommendContent.contentsResponseList}
        />
      ))}
    </Box>
  );
};

export default RecommendContentsPage;