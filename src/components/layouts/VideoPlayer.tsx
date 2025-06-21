import React, { useEffect, useRef, useState, useLayoutEffect } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import Box from "@mui/material/Box";
import { CustomPlayer } from "../../types/player";

import type MenuItem from 'video.js/dist/types/menu/menu-item';
import type MenuButton from 'video.js/dist/types/menu/menu-button';
import {SubtitleInfo, SubtitleMeta} from "../../api/videoApi.tsx";
import SubtitleOctopus from "libass-wasm";

import workerUrl from 'libass-wasm/dist/js/subtitles-octopus-worker?url';
import legacyWorkerUrl from 'libass-wasm/dist/js/subtitles-octopus-worker-legacy.js?url';

type Props = { fileId: string };

export interface VideoSource {
    name: string;
    url: string;
    type: string;
}

interface VideoPlayerProps {
    fileId: string;
    sources: VideoSource[];
    subtitleMeta: SubtitleMeta;
}


const MenuItemClass = videojs.getComponent('MenuItem') as unknown as {new(player: CustomPlayer, options: any): MenuItem};
const MenuButtonClass = videojs.getComponent('MenuButton') as unknown as {new(player: CustomPlayer, options: any): MenuButton};

// 1) 각 해상도 항목을 위한 커스텀 MenuItem 클래스
class QualityMenuItem extends MenuItemClass {
    constructor(player: CustomPlayer, options: any) {
        // 옵션에 source 정보를 포함하여 전달받음
        // 메뉴 아이템 생성 시, 현재 플레이어의 소스와 이 아이템의 소스가 같으면 'selected' 상태로 설정
        options.selected = options.source.url === player.currentSrc();

        super(player, options);
        // 플레이어의 소스가 변경될 때마다 'selected' 상태를 다시 확인하여 업데이트
        (this as any).on(player, 'loadstart', () => {
            // player.src() 메서드를 사용하여 현재 소스 URL과 비교
            this.selected(this.options_.source.url === this.player_.currentSrc());
        });
    }

    // 메뉴 항목 클릭 시 실행될 핸들러
    public handleClick() {
        const player = this.player() as CustomPlayer;
        const source: VideoSource = this.options_.source;
        const currentSrcUrl = player.currentSrc();

        // 현재 재생 중인 소스와 다른 소스를 선택했을 경우에만 실행
        if (source.url !== currentSrcUrl) {
            console.log(`해상도 변경: ${source.name}`);

            const currentTime = player.currentTime(); // 재생 시간 저장

            // 플레이어 소스 변경
            player.src({ src: source.url, type: source.type });

            // 메타데이터가 로드되면 저장한 시간으로 이동 후 재생
            player.one('loadedmetadata', () => {
                player.currentTime(currentTime);
                player.play();
            });

            // 부모 MenuButton의 라벨을 현재 선택한 해상도 이름으로 업데이트
            const menuButton = player.controlBar.getChild('QualityMenuButton') as unknown as QualityMenuButton;
            // console.log("menuButton: ", menuButton);
            if (menuButton) {
                menuButton.updateLabel(source.name);
            }
        }
    }
}


//2.  해상도 선택 메뉴 버튼 클래스
class QualityMenuButton extends MenuButtonClass {
    constructor(player: CustomPlayer, options: any) {
        super(player, options);
        this.updateLabel(options.initialLabel);
    }

    public buildCSSClass(): string {
        return `vjs-quality-selector-button ${super.buildCSSClass()}`;
    }

    public createItems() {
        const player = this.player();
        const sourcesList = this.options_.sources;

        return sourcesList.map((source: { name: never; }) => {
            return new QualityMenuItem(player as CustomPlayer, {
                label: source.name,
                source: source,
            });
        });
    }

    public updateLabel(newLabel: string) {
        const buttonTextEl = this.el().querySelector('.vjs-icon-placeholder');
        if (buttonTextEl) {
            buttonTextEl.innerHTML = newLabel;
        } else {
            // 엘리먼트가 없을 경우를 대비하여 새로 생성
            const newEl = document.createElement('span');
            newEl.className = 'vjs-control-text';
            // newEl.setAttribute('aria-live', 'polite');
            newEl.innerHTML = newLabel;
            this.el().appendChild(newEl);
        }
    }
}

if (!videojs.getComponent('QualityMenuButton')) {
    videojs.registerComponent('QualityMenuButton', QualityMenuButton as never);
}
if (!videojs.getComponent('QualityMenuItem')) {
    videojs.registerComponent('QualityMenuItem', QualityMenuItem as never);
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ fileId, sources, subtitleMeta}) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const playerRef = useRef<CustomPlayer | null>(null);
    const API_URL = import.meta.env.VITE_API_URL;
    const rendererRef = useRef<SubtitleOctopus | null>(null);

    // useSubtitle({
    //     player: playerRef.current,
    //     videoElement: videoRef.current,
    //     fileId,
    //     isReady: isPlayerReadyForSubtitle
    // });


    useLayoutEffect(() => {
        // 플레이어가 이미 생성되었거나, 비디오를 담을 컨테이너가 없으면 중단
        console.log("fileId: ", fileId);
        console.log("sources: ", sources);
        console.log("subtitleMeta: ", subtitleMeta);
        if (playerRef.current || !videoRef.current || sources.length === 0 || subtitleMeta==null) {
            return;
        }

        console.log("player ref: ", playerRef.current);
        console.log("video ref: ", videoRef.current);


        const videoElement = videoRef.current;

        // ========================================================================
        // --- 1. video.js 커스텀 컴포넌트 정의 ---
        // ========================================================================

        const options = {
            autoplay: false,
            controls: true,
            responsive: true,
            fluid: true,
            aspectRatio: '16:9',
            textTrackSettings: false,
            html5: {
                vhs: {
                    // overrideNative: true,
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
            sources: [
                // {
                // src: `${API_URL}/video/filerange?fileId=${fileId}`,
                // type: 'video/mp4'
                // },
                {
                src: `${API_URL}/video/hls_m3u8_ts?fileId=${fileId}&type=0`,
                type: 'application/vnd.apple.mpegurl' // 두 번째 소스: HLS (m3u8)
                }]
        };

        // 플레이어 인스턴스 생성
        const newPlayerInstance = videojs(videoElement, options) as CustomPlayer;
        playerRef.current = newPlayerInstance;


        // ========================================================================
        // --- 2. SubtitleOctopus 자막 컴포넌트 생성 ---
        // ========================================================================

        // 받아 온 자막 리스트 중 기본 자막 설정
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

        // if (defaultSubId) {
        //     rendererRef.current = new SubtitleOctopus({
        //         video: videoNode,
        //         subUrl: `${API_URL}/video/subtitle?fileId=${fileId}&type=${defaultSubId}`,
        //         fallbackFont: `${API_URL}/font/NanumGothic.otf`,
        //         workerUrl: workerUrl,
        //         // @ts-ignore
        //         legacyWorkerUrl: legacyWorkerUrl
        //     });
        // }



        // 플레이어가 준비되면, 자막 및 소스 리스트 선택 준비
        newPlayerInstance.on('ready', () => {
            console.log('Player is ready, 해상도 및 자막 초기화 준비됨.');

            if (sources.length > 1) {
                console.log('해상도 설정 준비: ',sources);
                newPlayerInstance.controlBar.addChild('QualityMenuButton', {
                    sources: sources,
                    initialLabel: sources[0]?.name || 'Quality'
                }, 11);
            }


            setTimeout(() => {
                // 새로 videoRef를 찾는 이유는 iOS에서만 video 관련 DOM을 새로 만들어 냄
                const foundVideoElement = document.querySelector('.vjs-tech') as HTMLVideoElement | null;
                if (foundVideoElement) {
                    videoRef.current = foundVideoElement;
                    console.log("videoRef.current를 document.querySelector로 찾은 요소로 지정했습니다.");
                }
                console.log("videoNode",videoRef.current)
                try {
                    if (defaultSubId) {
                        rendererRef.current = new SubtitleOctopus({
                            video: videoRef.current!,
                            subUrl: `${API_URL}/video/subtitle?fileId=${fileId}&type=${defaultSubId}`,
                            fallbackFont: `${API_URL}/font/NanumGothic.otf`,
                            workerUrl: workerUrl,
                            // @ts-ignore
                            legacyWorkerUrl: legacyWorkerUrl
                        });
                    }
                }
                catch (e) {
                    console.error(e);
                }
            }, 1000); // 1000 밀리초 = 1초

            // 새 트랙 추가
            console.log('자막 설정 준비: ',subtitleMeta);
            subtitleMeta.subtitleList.forEach((subtitle) => {
                console.log('자막 설정 중: ',subtitle);
                let subtitleLabel;
                if (subtitle.subtitleId.charAt(0) === 'v') {
                    subtitleLabel = subtitle.language + '(내장)';
                } else {
                    subtitleLabel = subtitle.language;
                }
                const textTrack = newPlayerInstance.addTextTrack('subtitles', subtitleLabel, subtitle.subtitleId)!;

                if (subtitle.subtitleId === defaultSubId) {
                    textTrack.mode = 'showing';
                }
            });

            const textTracks = newPlayerInstance.textTracks();
            let currentActiveSubId = defaultSubId;
            // @ts-ignore
            textTracks.addEventListener('change', () => {
                // 'showing' 상태인 트랙을 찾습니다.
                let activeTrack = null;
                for (let i = 0; i < textTracks.length; i++) {
                    if (textTracks[i].mode === 'showing') {
                        activeTrack = textTracks[i];
                        break;
                    }
                }
                // 새로 활성화된 자막의 ID (없으면 빈 문자열)
                const newActiveSubId = activeTrack ? activeTrack.language : '';

                // 새로 활성화된 자막 ID가 이전에 기억된 ID와 다를 경우에만 로직을 실행
                if (newActiveSubId !== currentActiveSubId) {
                    console.log(`자막 상태 변경 처리: ${currentActiveSubId || '끄기'} -> ${newActiveSubId || '끄기'}`);

                    // 현재 상태를 새로운 ID로 업데이트 (가장 중요)
                    currentActiveSubId = newActiveSubId;

                    if (rendererRef.current) {
                        rendererRef.current.freeTrack();
                        if (newActiveSubId) { // 새 자막 ID가 있을 경우에만 setTrackByUrl 호출
                            rendererRef.current.setTrackByUrl(
                                `${API_URL}/video/subtitle?fileId=${fileId}&type=${newActiveSubId}`
                            );
                        }
                    }
                } else {
                    // ID가 동일하면 iOS 등에서 발생하는 중복 호출이므로 무시
                    console.log(`자막 상태 변경 무시 (중복 호출 감지): ${newActiveSubId}`);
                }
            });

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
                    });
                } else {
                    console.warn('Screen Orientation API가 지원되지 않습니다.');
                }
            } else {
                // 전체화면 모드 해제 시
                if (screen.orientation && typeof screen.orientation.unlock === 'function') {
                    screen.orientation.unlock();
                    console.log('화면 방향 잠금을 해제했습니다.');
                }
            }
        });

        // 자막

        return () => {
            if (newPlayerInstance && !newPlayerInstance.isDisposed()) {
            try {
                newPlayerInstance.dispose();
            } catch (e) {
                console.error("정리 중 플레이어 해제 오류:", e);
            }
        }
            playerRef.current = null;
        };
    }, [videoRef, fileId, sources, subtitleMeta]);


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
