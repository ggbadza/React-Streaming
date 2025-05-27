import { useState, useEffect } from 'react';
import { fetchContentsById, ContentsResponse } from '../api/contentsApi';

export const useContentsData = (contentsId: number | null) => {
    const [contentsData, setContentsData] = useState<ContentsResponse | null>();
    const [contentsLoading, setContentsLoading] = useState(false);
    const [contentsError, setContentsError] = useState<string | null>(null);

    useEffect(() => {
        if (!contentsId) {
            setContentsData(null);
            return;
        }

        const loadFiles = async () => {
            setContentsLoading(true);
            setContentsError(null);

            try {
                const tempContentsData = await fetchContentsById(contentsId);
                setContentsData(tempContentsData);
            } catch (err) {
                setContentsError('콘텐츠 정보를 불러오는데 실패했습니다.');
                console.error('Failed to fetch contents data:', err);
            } finally {
                setContentsLoading(false);
            }
        };

        loadFiles();
    }, [contentsId]);

    return { contentsData, contentsLoading, contentsError };
};