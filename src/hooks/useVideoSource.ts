// src/hooks/useVideoSource.ts
import {useEffect, useRef, useState} from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import 'videojs-contrib-quality-levels';
import 'videojs-hls-quality-selector/src/plugin';
import { CustomPlayer } from '../types/player';
import {fetchVideoPlayList, VideoInfo, UseVideoSourceProps} from "../api/videoApi.tsx";
import QualityLevelList from "videojs-contrib-quality-levels/dist/types/quality-level-list";

// 이 훅에서 사용할 Props 정의
export interface UseVideoSourceHookProps {
    player: CustomPlayer | null;
    fileId: string;
}

export const useVideoSource = ({ player, fileId }: UseVideoSourceHookProps) => {
    const playerRef = useRef<CustomPlayer | null>(null);
    const [videoInfoList, setVideoInfoList] = useState<VideoInfo[] | null>(null);
    const [currentQualityLevels, setCurrentQualityLevels] = useState<QualityLevelList | null>(null);
    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const loadVideoMeta = async () => {
            try {
                // fileId를 number로 변환하여 API 호출
                const data = await fetchVideoPlayList(Number(fileId));
                setVideoInfoList(data);
                console.log('비디오 메타데이터 로드 됨:', data);
                return data;
            } catch (error) {
                console.error('비디오 메타데이터 로드 오류:', error);
                return null;
            }
        };

        if (fileId) {
            loadVideoMeta();
        }
    }, [fileId]);

    useEffect(() => {
        console.log("TTTT1");
        if (!currentQualityLevels||!videoInfoList) return;

        console.log("TTTT2");
        if (playerRef.current) {
            playerRef.current.dispose();
            playerRef.current = null;
        }


        console.log("TTTT3");

        if(player) {
            playerRef.current = player;

            console.log("TTTT4");

            videoInfoList.forEach((item) => {
                currentQualityLevels.addQualityLevel({
                    bitrate: 2000,
                    enabled: function(enable?: boolean) {
                        if (typeof enable === 'boolean') {
                            this._isEnabled = enable;

                        }
                        console.log(`${item.videoType} is ${this._isEnabled ? 'enabled' : 'disabled'}`);
                        if(this._isEnabled){
                            const newSrcObject = {
                                src: API_URL+item.url,
                                type: item.mimeType
                            };
                            const wasPlaying = !player.paused();
                            const savedTime = player.currentTime();

                            player.src(newSrcObject);

                            player.on('loadedmetadata', () => {
                                // 저장된 시간으로 이동
                                player.currentTime(savedTime);
                                // if(wasPlaying) player.play();

                                // setCurrentQualityLevels(player.qualityLevels());
                            });
                        }
                        return this._isEnabled;
                    },
                    frameRate: 30,
                    height: item.pixel,
                    width: item.pixel,
                    _isEnabled: true,
                    id: item.videoType});
            })



        }

        return () => {
            try {
                if (playerRef.current) {
                    console.log('Disposing video player from hook.');
                    playerRef.current.dispose();
                    playerRef.current = null;
                }
            } catch {
                console.log('비디오 소스 해제 중 에러 발생.')
                playerRef.current = null;
            }
        };
    }, [fileId, player, videoInfoList, currentQualityLevels]);

    return {currentQualityLevels, setCurrentQualityLevels};
};

export default useVideoSource;