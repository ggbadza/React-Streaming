import { useEffect, useState, useRef } from 'react';
// import JASSUB from 'jassub';
import workerUrl from 'libass-wasm/dist/js/subtitles-octopus-worker?url';
// import wasmUrl from 'libass-wasm/dist/js/subtitles-octopus-worker.wasm?url';
import { CustomPlayer } from '../types/player';
import { SubtitleMeta, UseVideoSourceProps, fetchSubtitleMeta } from "../api/videoApi.tsx";
import SubtitleOctopus from "libass-wasm";



/**
 * 비디오 자막 관리를 위한 커스텀 훅
 */
const useSubtitle = ({ player, videoElement, fileId, isReady }: UseVideoSourceProps) => {
    const [subtitleMeta, setSubtitleMeta] = useState<SubtitleMeta | null>(null);
    const [isSubtitleLoaded, setIsSubtitleLoaded] = useState<boolean>(false);
    const rendererRef = useRef<SubtitleOctopus | null>(null);

    // 자막 메타데이터 로드
    useEffect(() => {
        const loadSubtitleMeta = async () => {
            try {
                // fileId를 number로 변환하여 API 호출
                const data = await fetchSubtitleMeta(Number(fileId));
                setSubtitleMeta(data);
                return data;
            } catch (error) {
                console.error('자막 메타데이터 로드 오류:', error);
                return null;
            }
        };

        if (fileId) {
            loadSubtitleMeta();
        }
    }, [fileId]);

    // 자막 초기화 및 설정
    useEffect(() => {
        if (!isReady || !player || !videoElement || !subtitleMeta || !subtitleMeta.hasSubtitle || subtitleMeta.count <= 0) {
            return;
        }

        // 기존 렌더러가 있으면 해제
        if (rendererRef.current) {
            rendererRef.current.dispose();
            rendererRef.current = null;
        }

        // 최초 자막 로딩 (파일 타입 혹은 kor)
        const defaultSubtitle = subtitleMeta.subtitleList.find(
            (subtitle) => subtitle.language === 'kor' || subtitle.subtitleId === 'v'
        );

        // 기본 자막을 찾았으면 해당 ID 사용, 아니면 첫 번째 자막 ID 사용 또는 빈 문자열
        const defaultSubId = defaultSubtitle
            ? defaultSubtitle.subtitleId
            : (subtitleMeta.subtitleList.length > 0
                ? subtitleMeta.subtitleList[0].subtitleId
                : '');

        if (defaultSubtitle) {
            console.log(`최초 자막 "${defaultSubtitle.language}"(${defaultSubtitle.subtitleId})이 선택 됨`);
        }

        // 새 렌더러 생성
        rendererRef.current = new SubtitleOctopus({
            video: videoElement,
            subUrl: `${import.meta.env.VITE_API_URL}/video/subtitle?fileId=${fileId}&type=${defaultSubId}`,
            availableFonts: {
                // '맑은 고딕': `${import.meta.env.VITE_API_URL}/font/malgun.ttf`,
            },
            fallbackFont: `${import.meta.env.VITE_API_URL}/font/NanumGothic.otf`,
            workerUrl : workerUrl,
        });


        // 자막 트랙 생성 및 이벤트 리스너 설정

        // 새 트랙 추가
        subtitleMeta.subtitleList.forEach((subtitle) => {
            let subtitleLabel;
            if (subtitle.subtitleId.charAt(0) === 'v') {
                subtitleLabel = subtitle.language + '(내장)';
            } else {
                subtitleLabel = subtitle.language;
            }
            const textTrack = player.addTextTrack('subtitles', subtitleLabel, subtitle.subtitleId)!;

            if (subtitle.subtitleId === defaultSubId) {
                textTrack.mode = 'showing';
            }

            textTrack.addEventListener('modechange', function () {
                if (textTrack.mode === 'showing') {
                    console.log(`자막 "${textTrack.label}"(${textTrack.language})이 활성화됨`);

                    // 자막 트랙 로드
                    if (rendererRef.current) {
                        rendererRef.current.freeTrack();
                        rendererRef.current.setTrackByUrl(
                            `${import.meta.env.VITE_API_URL}/video/subtitle?fileId=${fileId}&type=${textTrack.language}`
                        );
                    }
                }
            });
        });

        // 전체가 비활성화 되었을 경우(subtitleoff 한 경우)
        player.on('texttrackchange', () => {
            disableAllSubtitles(player);
        });

        setIsSubtitleLoaded(true);

        // 정리 함수
        return () => {
            if (rendererRef.current) {
                try {
                    rendererRef.current.dispose();
                } catch (error) {
                    console.warn('SubtitleOctopus dispose 오류:', error);
                    // 오류 무시하고 계속 진행
                }
                rendererRef.current = null;
            }
        };
    }, [player, videoElement, subtitleMeta, fileId, isReady]);

    const disableAllSubtitles = (player: CustomPlayer) => {
        const tracks = player.textTracks();
        const allDisabled = Array.from(tracks).every((track: TextTrack) => track.mode !== 'showing');

        if (allDisabled) {
            console.log('모든 자막이 비활성화됨 (Caption Off)');
            // 자막 OFF 시 실행할 로직
            if (rendererRef.current) {
                rendererRef.current.freeTrack();
            }
        }
    };

    return {
        subtitleMeta,
        isSubtitleLoaded
    };
};

export default useSubtitle;