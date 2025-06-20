import { useState, useEffect, useCallback } from 'react';
import {
    fetchIsFollowing,
    fetchRegisterFollowing,
    fetchDeleteFollowing,
} from '../api/contentsApi';

export const useContentsFollowing = (contentsId: number | null) => {
    const [isFollowing, setIsFollowing] = useState<boolean | null>(null);
    const [followingLoading, setFollowingLoading] = useState(false);

    // 초기 팔로잉 상태를 불러오는 효과
    useEffect(() => {
        if (contentsId === null) {
            setIsFollowing(null); // contentsId가 없으면 상태 초기화
            return;
        }

        const loadFollowingStatus = async () => {
            setFollowingLoading(true);
            try {
                const status = await fetchIsFollowing(contentsId);
                setIsFollowing(status);
            } catch (err) {
                console.error('팔로잉 상태를 불러오는데 실패했습니다:', err);
                setIsFollowing(false); // 에러 발생 시 팔로잉 아님으로 처리
            } finally {
                setFollowingLoading(false);
            }
        };

        loadFollowingStatus();
    }, [contentsId]); // contentsId가 변경될 때마다 실행

    // 팔로잉 상태를 토글하는 함수
    const toggleFollowing = useCallback(async () => {
        if (contentsId === null) {
            return;
        }

        setFollowingLoading(true);

        try {
            let success: boolean;
            if (isFollowing) {
                // 현재 팔로잉 중이면 팔로우 취소
                success = await fetchDeleteFollowing(contentsId);
            } else {
                // 현재 팔로잉 중이 아니면 팔로우 설정
                success = await fetchRegisterFollowing(contentsId);
            }

            if (success) {
                setIsFollowing(!isFollowing); // 상태를 반전
            } else {
                console.error(`팔로잉 ${isFollowing ? '취소' : '설정'}에 실패했습니다. (API 응답 실패)`);
                // UI 상태는 변경하지 않음 (서버와 불일치 방지)
            }
        } catch (err) {
            console.error(`팔로잉 ${isFollowing ? '취소' : '설정'} 중 오류가 발생했습니다.:`,err);
        } finally {
            setFollowingLoading(false);
        }
    }, [contentsId, isFollowing]); // contentsId 또는 isFollowing이 변경될 때마다 콜백 재생성

    return { isFollowing, followingLoading, toggleFollowing };
};