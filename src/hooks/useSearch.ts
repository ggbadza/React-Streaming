import { useState, useEffect } from 'react';
import { fetchSearchResults, ContentsSearchResult } from '../api/contentsApi';

/**
 * 검색어 자동완성 기능을 위한 커스텀 훅
 * @param query - 검색어
 * @param delay - 디바운싱 지연 시간 (ms)
 * @returns { searchResults, isLoading }
 */
export const useSearch = (query: string, delay: number = 300) => {
    const [searchResults, setSearchResults] = useState<ContentsSearchResult[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        // 검색어가 비어있으면 결과 목록을 null로 설정하고 종료
        if (!query.trim()) {
            setSearchResults(null);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);

        // 디바운싱을 위한 타이머 설정
        const debounceTimer = setTimeout(() => {
            fetchSearchResults(query)
                .then(data => {
                    setSearchResults(data);
                })
                .catch(error => {
                    console.error("검색 결과를 가져오는 중 오류 발생:", error);
                    setSearchResults([]); // 오류 발생 시 빈 배열로 처리
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }, delay);

        // 클린업 함수: 컴포넌트가 언마운트되거나 query가 변경될 때 이전 타이머를 제거
        return () => clearTimeout(debounceTimer);

    }, [query, delay]); // query 또는 delay가 변경될 때마다 이 효과를 다시 실행

    return { searchResults, isLoading };
};