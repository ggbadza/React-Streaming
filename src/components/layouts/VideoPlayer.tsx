import React, { useEffect, useRef, useState } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import 'videojs-contrib-quality-levels';
import 'videojs-hls-quality-selector/src/plugin';
import Box from "@mui/material/Box";
import { CustomPlayer } from "../../types/player";
// 자막 관련 훅 임포트
import useSubtitle from "../../hooks/useSubtitle";
import useVideoSource from "../../hooks/useVideoSource.ts";

type Props = { fileId: string };

const VideoPlayer: React.FC<Props> = ({ fileId }) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const playerRef = useRef<CustomPlayer | null>(null);
    const API_URL = import.meta.env.VITE_API_URL;
    const [isPlayerReadyForSubtitle, setIsPlayerReadyForSubtitle] = useState(false);

    useVideoSource({
        player: playerRef.current,
        fileId
    });

    useSubtitle({
        player: playerRef.current,
        videoElement: videoRef.current,
        fileId,
        isReady: isPlayerReadyForSubtitle
    });

    useEffect(() => {
        // 컴포넌트가 마운트되고 videoRef가 설정된 후에만 실행
        const videoElement = videoRef.current;
        if (!videoElement) return;

        // 기존 플레이어가 있으면 제거
        if (playerRef.current) {
            try {
                playerRef.current.dispose();
            } catch {
                console.error("기존 플레이어가 있으면 제거중에 에러 발생")
            }
            playerRef.current = null;
        }

        //  플레이어 변경 시 자막 준비 상태 초기화
        setIsPlayerReadyForSubtitle(false);

        const options = {
            autoplay: false,
            controls: true,
            responsive: true,
            fluid: true,
            aspectRatio: '16:9',
            textTrackSettings: false,
            html5: {
                vhs: {
                    overrideNative: true,
                    enableLowInitialPlaylist: true,
                    limitRenditionByPlayerDimensions: true,
                    useBandwidthFromLocalStorage: true,
                    useDevicePixelRatio: true,
                    withCredentials: true
                },
                nativeAudioTracks: false,
                nativeVideoTracks: false
            },
            liveui: true,
            sources: [{
                src: `${API_URL}/video/filerange?fileId=${fileId}`,
                type: 'video/mp4'
            }]
        };

        const newPlayerInstance = videojs(videoElement, options) as CustomPlayer;
        playerRef.current = newPlayerInstance;

        newPlayerInstance.on('play', () => {
            const qualityLevels = newPlayerInstance.qualityLevels();
            console.log(`Available quality levels: ${qualityLevels.length}`);


            if (newPlayerInstance.hlsQualitySelector) {
                newPlayerInstance.hlsQualitySelector({
                    displayCurrentQuality: true
                });
            }
        });

        // 플레이어가 준비되면, HLS 품질 선택기 활성화
        newPlayerInstance.on('ready', () => {
            console.log('Player is ready, 자막 초기화 준비됨.');
            //  현재 활성화된 플레이어 인스턴스와 일치할 때만 상태 업데이트
            if (playerRef.current === newPlayerInstance && !newPlayerInstance.isDisposed()) {
                setIsPlayerReadyForSubtitle(true);
            }

            if (newPlayerInstance.qualityLevels) {
                console.log('Quality levels plugin detected');
                const qualityLevels = newPlayerInstance.qualityLevels();
                // setCurrentQualityLevels(qualityLevels); // useVideoSource 훅으로 로직 이동 가능성
                console.log(`Available quality levels: ${qualityLevels.length}`);

                if (newPlayerInstance.hlsQualitySelector) {
                    newPlayerInstance.hlsQualitySelector({
                        displayCurrentQuality: true
                    });
                }
                console.log('HLS quality selector activated');
            }
            newPlayerInstance.fluid(true);
        });

        // 오류 이벤트 리스닝
        newPlayerInstance.on('error', () => {
            console.error('Video error:', newPlayerInstance.error());
        });

        // 메타데이터 로딩 이벤트
        newPlayerInstance.on('loadedmetadata', () => {
            console.log('Video metadata loaded');
        });

        newPlayerInstance.on('fullscreenchange', function() {
            if (newPlayerInstance.isFullscreen()) {
                // 전체화면 모드 진입 시
                if (screen.orientation && typeof screen.orientation.lock("landscape") === 'function') {
                    screen.orientation.lock('landscape').then(function() {
                        console.log('화면을 가로 모드로 잠갔습니다.');
                    }).catch(function(error) {
                        console.error('화면 방향 잠금 실패:', error);
                        // 사용자에게 가로 모드를 권장하는 UI를 보여줄 수도 있습니다.
                    });
                } else {
                    console.warn('Screen Orientation API가 지원되지 않습니다.');
                    // 이 경우, 사용자에게 직접 가로 모드로 전환하도록 안내 메시지를 띄울 수 있습니다.
                }
            } else {
                // 전체화면 모드 해제 시
                if (screen.orientation && typeof screen.orientation.unlock === 'function') {
                    screen.orientation.unlock();
                    console.log('화면 방향 잠금을 해제했습니다.');
                }
            }
        });

        return () => {
            if (newPlayerInstance && !newPlayerInstance.isDisposed()) {
            try {
                newPlayerInstance.dispose();
            } catch (e) {
                console.error("정리 중 플레이어 해제 오류:", e);
            }
        }
            playerRef.current = null;
            setIsPlayerReadyForSubtitle(false);
        };
    }, [fileId]);

    return (
        <Box>
            {/* VideoJS 플레이어 */}
            <div className="video-container" style={{ width: '100%' }}>
                <video
                    ref={videoRef}
                    className="video-js vjs-big-play-centered vjs-default-skin"
                    playsInline
                    controls
                    preload="auto"
                    style={{ display: 'block', margin: '0 auto' }}
                />
            </div>
        </Box>
    );
};

export default VideoPlayer;
