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

    const { currentQualityLevels, setCurrentQualityLevels } = useVideoSource({
        player: playerRef.current,
        fileId
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
                // type: 'application/x-mpegURL'
                type: 'video/mp4'
            }]
        };

        const player = videojs(videoElement, options) as CustomPlayer;
        playerRef.current = player;

        player.on('play', () => {
            const qualityLevels = player.qualityLevels();
            console.log(`Available quality levels: ${qualityLevels.length}`);


            player.hlsQualitySelector({
                displayCurrentQuality: true
            });

            if(qualityLevels.length<=1){
                setCurrentQualityLevels(qualityLevels);
            }

        });

        // 플레이어가 준비되면, HLS 품질 선택기 활성화
        player.on('ready', () => {
            console.log('Player is ready');
            console.log('Current source:', player.currentSrc());
            
            // videojs-quality-levels 플러그인이 제대로 로드되었는지 확인
            if (player.qualityLevels) {
                console.log('Quality levels plugin detected');



                // 품질 레벨 확인
                const qualityLevels = player.qualityLevels();

                setCurrentQualityLevels(qualityLevels);
                console.log(`Available quality levels: ${qualityLevels.length}`);

                player.hlsQualitySelector({
                    displayCurrentQuality: true
                });

                console.log('HLS quality selector activated');

            }

            player.fluid(true);
        });

        // 오류 이벤트 리스닝
        player.on('error', () => {
            console.error('Video error:', player.error());
        });

        // 메타데이터 로딩 이벤트
        player.on('loadedmetadata', () => {
            console.log('Video metadata loaded');
        });

        player.on('fullscreenchange', function() {
            if (player.isFullscreen()) {
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
            if (playerRef.current) {
                playerRef.current.dispose();
                playerRef.current = null;
            }
        };
    }, [fileId,videoRef]);

    // 자막 훅 사용
    const { 
        subtitleMeta, 
        isSubtitleLoaded
    } = useSubtitle({
        player: playerRef.current,
        videoElement: videoRef.current,
        fileId
    });

    // 자막 정보 로깅 (디버깅용)
    useEffect(() => {
        if (subtitleMeta) {
            console.log('자막 메타데이터 로드됨:', subtitleMeta);
        }
    }, [subtitleMeta]);

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
