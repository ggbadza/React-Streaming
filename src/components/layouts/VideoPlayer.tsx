import React, { useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import 'videojs-contrib-quality-levels';
import 'videojs-hls-quality-selector/src/plugin';
import Box from "@mui/material/Box";
import { CustomPlayer } from "../../types/player";
// 자막 관련 훅 임포트
import useSubtitle from "../../hooks/useSubtitle";

type Props = { fileId: string };

const VideoPlayer: React.FC<Props> = ({ fileId }) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const playerRef = useRef<CustomPlayer | null>(null);
    // 환경 변수에서 API URL 가져오기
    const API_URL = import.meta.env.VITE_API_URL;
    const videoUrl = `${API_URL}/video/hls_m3u8_master?fileId=${fileId}`;

    useEffect(() => {
        // 컴포넌트가 마운트되고 videoRef가 설정된 후에만 실행
        const videoElement = videoRef.current;
        if (!videoElement) return;

        // 기존 플레이어가 있으면 제거
        if (playerRef.current) {
            playerRef.current.dispose();
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
                    withCredentials: false
                },
                nativeAudioTracks: false,
                nativeVideoTracks: false
            },
            liveui: true,
            sources: [{
                src: videoUrl,
                type: 'application/x-mpegURL'
            }]
        };

        const player = videojs(videoElement, options) as CustomPlayer;
        playerRef.current = player;

        // 플레이어가 준비되면, HLS 품질 선택기 활성화
        player.on('ready', () => {
            console.log('Player is ready');
            console.log('Current source:', player.currentSrc());
            
            // videojs-quality-levels 플러그인이 제대로 로드되었는지 확인
            if (player.qualityLevels) {
                console.log('Quality levels plugin detected');

                player.hlsQualitySelector({
                    displayCurrentQuality: true
                });

                console.log('HLS quality selector activated');

                // 품질 레벨 확인
                const qualityLevels = player.qualityLevels();
                console.log(`Available quality levels: ${qualityLevels.length}`);
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

        return () => {
            if (playerRef.current) {
                playerRef.current.dispose();
                playerRef.current = null;
            }
        };
    }, [fileId, videoUrl]);

    // 자막 훅 사용
    const { 
        subtitleMeta, 
        isSubtitleLoaded
    } = useSubtitle({
        player: playerRef.current,
        videoElement: videoRef.current,
        fileId,
        apiUrl: API_URL
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
