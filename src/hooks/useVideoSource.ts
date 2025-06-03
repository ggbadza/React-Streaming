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
    const [videoInfoList, setVideoInfoList] = useState<VideoInfo[] | null>(null);
    const [currentQualityLevels, setCurrentQualityLevels] = useState<QualityLevelList | null>(null);
    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const loadVideoMeta = async () => {
            try {
                // fileId를 number로 변환하여 API 호출
                const data = await fetchVideoPlayList(Number(fileId));
                if (player && !player.isDisposed()) setVideoInfoList(data);
                console.log('비디오 메타데이터 로드 됨:', data);
                return data;
            } catch (error) {
                console.error('비디오 메타데이터 로드 오류:', error);
                return null;
            }
        };

        if (fileId && player && !player.isDisposed()) {
            loadVideoMeta();
        }
    }, [fileId, player]);

    useEffect(() => {
        console.log("TTTT1");
        if (player && player.qualityLevels && typeof player.qualityLevels === 'function' && !player.isDisposed()) {
            const qualityLevelsInstance = player.qualityLevels();
            setCurrentQualityLevels(qualityLevelsInstance);
        } else {
            setCurrentQualityLevels(null); // 플레이어가 유효하지 않으면 초기화
        }
    }, [player]); // 이 효과는 player 인스턴스가 변경될 때 currentQualityLevels를 업데이트함

    useEffect(() => {
        if (!player || player.isDisposed() || !currentQualityLevels || !videoInfoList) {
            return;
        }

        console.log("TTTT3");

        if(player) {

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

    }, [fileId, player, videoInfoList, currentQualityLevels]);

    return {currentQualityLevels, setCurrentQualityLevels};
};

export default useVideoSource;