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

import { renderToString } from 'react-dom/server';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeDownIcon from '@mui/icons-material/VolumeDown';
import FastRewindIcon from '@mui/icons-material/FastRewind';
import FastForwardIcon from '@mui/icons-material/FastForward';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SpeedIcon from '@mui/icons-material/Speed';
import SubtitlesIcon from '@mui/icons-material/Subtitles';

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

const Component = videojs.getComponent('Component');

// 3. 피드백 UI를 위한 커스텀 컴포넌트 클래스 등록
class OverlayDisplay extends Component {
    private timeout: any;

    constructor(player: CustomPlayer, options = {}) {
        super(player, options);
        this.timeout = null;
    }

    // 컴포넌트의 HTML 엘리먼트를 생성
    createEl() {
        const el = videojs.dom.createEl('div', {
            className: 'vjs-overlay-display'
        });
        el.innerHTML = `<span class="icon"></span><span class="text"></span>`;
        return el;
    }

    // 메세지을 보여주는 메소드
    showMessage(iconHtml: string, text: string) {
        const iconEl = this.el().querySelector('.icon') as HTMLElement;
        const textEl = this.el().querySelector('.text') as HTMLElement;

        if (iconEl) iconEl.innerHTML = iconHtml;
        if (textEl) textEl.textContent = text;

        // 이전에 설정된 timeout이 있다면 초기화
        this.player().clearTimeout(this.timeout);

        // UI를 보이도록 클래스 추가
        this.addClass('vjs-overlay-visible');

        // 1초 후에 UI를 숨김
        this.timeout = this.player().setTimeout(() => {
            this.hide();
        }, 1000);
    }

    // 피드백을 숨기는 메소드
    hide() {
        this.removeClass('vjs-overlay-visible');
    }
}



if (!videojs.getComponent('QualityMenuButton')) {
    videojs.registerComponent('QualityMenuButton', QualityMenuButton as never);
}
if (!videojs.getComponent('QualityMenuItem')) {
    videojs.registerComponent('QualityMenuItem', QualityMenuItem as never);
}

if (!videojs.getComponent('OverlayDisplay')) {
    videojs.registerComponent('OverlayDisplay', OverlayDisplay);
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

        let newRate;
        let newVolume;

        const options = {
            autoplay: false,
            controls: true,
            responsive: true,
            fluid: true,
            aspectRatio: '16:9',
            textTrackSettings: false,
            playbackRates: [0.2 ,0.5, 1, 1.5, 2, 3, 4],
            userActions: {
                hotkeys: function(this: CustomPlayer, event: {
                    ctrlKey: boolean;
                    which: number; preventDefault: () => void; }) {

                    const overlayDisplay = this.getChild('OverlayDisplay') as OverlayDisplay;
                    if (!overlayDisplay) return; // 피드백 컴포넌트가 없으면 아무것도 안함

                    switch(event.which) {
                    // 왼쪽 방향 키 (ArrowLeft)
                        case 37:
                            event.preventDefault(); // 브라우저 기본 동작 방지 (스크롤 등)
                            // @ts-ignore
                            this.currentTime(this.currentTime() - 10); // 현재 시간에서 10초 뒤로 이동
                            this.focus();
                            overlayDisplay.showMessage(renderToString(<FastRewindIcon />), '-10초');
                            break;
                    // 오른쪽 방향 키 (ArrowRight)
                        case 39:
                            event.preventDefault(); // 브라우저 기본 동작 방지 (스크롤 등)
                            // @ts-ignore
                            this.currentTime(this.currentTime() + 10); // 현재 시간에서 10초 앞으로 이동
                            this.focus();
                            overlayDisplay.showMessage(renderToString(<FastForwardIcon />), '+10초');
                            break;
                    // 스페이스바
                        case 32:
                            event.preventDefault(); // 브라우저 기본 동작 방지 (페이지 스크롤 등)
                            if (this.paused()) { // 현재 비디오가 멈춰있다면
                                this.play();       // 재생
                                overlayDisplay.showMessage(renderToString(<PlayArrowIcon />), '재생');
                            } else {             // 현재 비디오가 재생 중이라면
                                this.pause();      // 멈춤
                                overlayDisplay.showMessage(renderToString(<PauseIcon />), '일시정지');
                            }
                            this.focus();
                            break;
                    // F1, 엔터
                        case 112:
                        case 13 :
                            event.preventDefault(); // 브라우저 기본 동작 방지
                            if (this.isFullscreen()) {
                                this.exitFullscreen();
                            } else {
                                this.requestFullscreen();
                            }
                            this.focus();
                            break;
                    // 'M'키
                        case 77:
                            event.preventDefault(); // 브라우저 기본 동작 방지
                            if (!this.muted()) {
                                this.muted(true); // 음소거 설정
                                overlayDisplay.showMessage(renderToString(<VolumeOffIcon />), '음소거');
                            } else{
                                this.muted(false);
                                overlayDisplay.showMessage(renderToString(<VolumeUpIcon />), '음소거 해제');
                            }
                            this.focus(); // 키 입력 후 플레이어에 다시 포커스
                            break;

                    // 'X' 키 (재생 속도 0.1 감소)
                        case 88:
                            event.preventDefault(); // 브라우저 기본 동작 방지
                            // @ts-ignore
                            newRate = this.playbackRate() - 0.1;
                            newRate = parseFloat(newRate.toFixed(2));
                            if (newRate < 0.1) { // 최소 속도 제한
                                newRate = 0.1;
                            }
                            this.playbackRate(newRate);
                            this.focus(); // 키 입력 후 플레이어에 다시 포커스
                            overlayDisplay.showMessage(renderToString(<SpeedIcon />), `재생속도: ${newRate}배`);
                            break;
                    // 'C' 키 (재생 속도 0.1 증가)
                        case 67:
                            event.preventDefault(); // 브라우저 기본 동작 방지
                            // @ts-ignore
                            newRate = this.playbackRate() + 0.1;
                            newRate = parseFloat(newRate.toFixed(2));

                            if (newRate > 4.0) { // 최대 속도 제한
                                newRate = 4.0;
                            }
                            this.playbackRate(newRate);
                            this.focus(); // 키 입력 후 플레이어에 다시 포커스
                            overlayDisplay.showMessage(renderToString(<SpeedIcon />), `재생속도: ${newRate}배`);
                            break;
                    // 위쪽 방향 키 (볼륨 0.1 증가)
                        case 38:
                            event.preventDefault();
                            // @ts-ignore
                            newVolume = this.volume() + 0.1;
                            newVolume = parseFloat(newVolume.toFixed(2)); // 소수점 오차 방지
                            if (newVolume > 1.0) {
                                newVolume = 1.0;
                            }
                            this.volume(newVolume);
                            // 볼륨이 0이 아니면 음소거 해제
                            if (this.muted() && newVolume > 0) {
                                this.muted(false);
                            }
                            overlayDisplay.showMessage(renderToString(<VolumeUpIcon />), `볼륨: ${Math.round(newVolume * 100)}%`);
                            this.focus();
                            break;
                    // 아래쪽 방향 키 (볼륨 0.1 감소)
                        case 40:
                            event.preventDefault();
                            // @ts-ignore
                            newVolume = this.volume() - 0.1;
                            newVolume = parseFloat(newVolume.toFixed(2)); // 소수점 오차 방지
                            if (newVolume < 0.0) { // 최소 볼륨 제한 (0.0 = 0%)
                                newVolume = 0.0;
                            }
                            this.volume(newVolume);
                            // 볼륨이 0이 되면 음소거 설정
                            if (newVolume === 0) {
                                this.muted(true);
                            }
                            overlayDisplay.showMessage(renderToString(<VolumeDownIcon />), `볼륨: ${Math.round(newVolume * 100)}%`);
                            this.focus();
                            break;
                    // ',' 키 (자막 싱크 느리게)
                        case 188:
                            event.preventDefault();
                            if(rendererRef.current) {
                                let offsetTime = 0;
                                if (event.ctrlKey) offsetTime = 2;
                                else offsetTime = 0.1
                                rendererRef.current.timeOffset = parseFloat((rendererRef.current.timeOffset - offsetTime).toFixed(1));
                                overlayDisplay.showMessage(renderToString(
                                    <SubtitlesIcon/>), `자막 싱크: ${offsetTime}초 느리게 (${-rendererRef.current?.timeOffset}초)`);
                            }
                            this.focus();
                            break;
                    // '.' 키 (자막 싱크 빠르게)
                        case 190:
                            event.preventDefault();
                            if(rendererRef.current) {
                                let offsetTime = 0;
                                if (event.ctrlKey) offsetTime = 2;
                                else offsetTime = 0.1
                                rendererRef.current.timeOffset = parseFloat((rendererRef.current.timeOffset + offsetTime).toFixed(1));
                                overlayDisplay.showMessage(renderToString(
                                    <SubtitlesIcon/>), `자막 싱크: ${offsetTime}초 빠르게 (${-rendererRef.current?.timeOffset}초)`);
                            }
                            this.focus();
                            break;

                    //  '/' 키 (자막 싱크 초기화)
                        case 191:
                            event.preventDefault();
                            if(rendererRef.current) {
                                rendererRef.current.timeOffset = 0;
                                overlayDisplay.showMessage(renderToString(
                                    <SubtitlesIcon/>), `자막 싱크: 기본값`);
                            }
                            this.focus();
                            break;
                    }
                }
            },
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
                {
                src: `${API_URL}/video/filerange?fileId=${fileId}`,
                type: 'video/mp4'
                },
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

        newPlayerInstance.on('click', function() {
            newPlayerInstance.focus(); // 클릭 시 플레이어에 포커스 부여
        });

        // 더블클릭 이벤트 수정: 화면 좌/우에 따라 다른 기능 수행
        // @ts-ignore
        newPlayerInstance.on('dblclick', function(event) {
            const overlayDisplay = newPlayerInstance.getChild('OverlayDisplay') as OverlayDisplay;

            // 플레이어 요소의 경계와 클릭 위치 가져오기
            const playerRect = newPlayerInstance.el().getBoundingClientRect();
            const clickX = event.clientX;

            // 플레이어의 가로 중앙 지점 계산
            const midpoint = playerRect.left + playerRect.width / 2;

            if (clickX > midpoint) {
                // 오른쪽 영역 더블클릭: 10초 앞으로
                newPlayerInstance.currentTime(newPlayerInstance.currentTime()! + 10);
                if (overlayDisplay) {
                    overlayDisplay.showMessage(renderToString(<FastForwardIcon />), '+10초');
                }
            } else {
                // 왼쪽 영역 더블클릭: 10초 뒤로
                newPlayerInstance.currentTime(newPlayerInstance.currentTime()! - 10);
                if (overlayDisplay) {
                    overlayDisplay.showMessage(renderToString(<FastRewindIcon />), '-10초');
                }
            }
        });



        // 플레이어가 준비되면, 자막 및 소스 리스트 선택 준비
        newPlayerInstance.on('ready', () => {
            console.log('Player is ready, 해상도 및 자막 초기화 준비됨.');

            // 플레이어 준비 시 포커스 함 (키보드 작업 그대로 가능하게)
            newPlayerInstance.focus();


            // 오버레이 디스플레이 추가
            const overlay = newPlayerInstance.addChild('OverlayDisplay', {});

            // ResizeObserver를 사용하여 플레이어 크기 변경 감지
            const playerEl = newPlayerInstance.el();
            const resizeObserver = new ResizeObserver(entries => {
                for (let entry of entries) {
                    const playerWidth = entry.contentRect.width;
                    // 플레이어 너비에 비례하여 기본 크기 계산 (값은 조절 가능)
                    const baseSize = playerWidth / 50;
                    // CSS 변수로 --overlay-base-size 설정
                    (overlay.el() as HTMLElement).style.setProperty('--overlay-base-size', `${baseSize}px`);
                }
            });

            resizeObserver.observe(playerEl);


            if (sources.length > 1) {
                console.log('해상도 설정 준비: ',sources);
                newPlayerInstance.controlBar.addChild('QualityMenuButton', {
                    sources: sources,
                    initialLabel: sources.find(source => source.url === newPlayerInstance.currentSrc())?.name || 'Quality' // 소스의 현재 url과 일치하는 소스목록의 name을 가져 옴
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
            }, 1000); // 1000 밀리초

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


        // 드래그로 탐색 기능 구현
        let isDragging = false;
        let isDoubleTap = false;
        let startX = 0;
        let startTime = 0;
        const playerElement = newPlayerInstance.el();

        let lastTapTime = 0;
        const DOUBLE_TAP_THRESHOLD = 300;

        const handleMouseDown = (e: Event) => {
            if (!('clientX' in e || 'touches' in e)) return;

            const currentTime = new Date().getTime();
            // 더블 탭 일시
            if (currentTime - lastTapTime < DOUBLE_TAP_THRESHOLD) {

                isDoubleTap = true;
                isDragging = false;


                return

            }

            // 첫 번째 탭/클릭인 경우
            lastTapTime = currentTime;

            isDragging = true;
            // @ts-ignore
            startX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
            startTime = newPlayerInstance.currentTime()!;
            (playerElement as HTMLElement).style.cursor = 'grabbing';
        };

        const handleMouseMove = (e: Event) => {
            if (!isDragging || !('clientX' in e || 'touches' in e)) return;

            // @ts-ignore
            const currentX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
            const deltaX = currentX - startX;
            const timeToSeek = deltaX / 5;
            const newTime = Math.max(0, Math.min(newPlayerInstance.duration()!, startTime + timeToSeek));

            newPlayerInstance.currentTime(newTime);

            const overlayDisplay = newPlayerInstance.getChild('OverlayDisplay') as OverlayDisplay;
            if (overlayDisplay) {
                const timeChange = newTime - startTime;
                const icon = timeChange > 0 ? renderToString(<FastForwardIcon />) : renderToString(<FastRewindIcon />);
                const text = `${timeChange > 0 ? '+' : ''}${Math.round(timeChange)}초`;
                overlayDisplay.showMessage(icon, text);
            }
        };

        const handleMouseUp = (e: Event) => {
            const overlayDisplay = newPlayerInstance.getChild('OverlayDisplay') as OverlayDisplay;
            
            if (isDoubleTap) {

                // 플레이어 요소의 경계와 클릭 위치 가져오기
                const playerRect = newPlayerInstance.el().getBoundingClientRect();
                // @ts-ignore

                // 플레이어의 가로 중앙 지점 계산
                const midpoint = playerRect.left + playerRect.width / 2;

                if (startX > midpoint) {
                    // 오른쪽 영역 더블클릭: 10초 앞으로
                    newPlayerInstance.currentTime(newPlayerInstance.currentTime()! + 10);
                    if (overlayDisplay) {
                        overlayDisplay.showMessage(renderToString(<FastForwardIcon />), '+10초');
                    }
                } else {
                    // 왼쪽 영역 더블클릭: 10초 뒤로
                    newPlayerInstance.currentTime(newPlayerInstance.currentTime()! - 10);
                    if (overlayDisplay) {
                        overlayDisplay.showMessage(renderToString(<FastRewindIcon />), '-10초');
                    }
                }
                isDoubleTap = false;
            }
            if (isDragging) {
                isDragging = false;
                (playerElement as HTMLElement).style.cursor = 'pointer';
            }
        };

        // playerElement.addEventListener('mousedown', handleMouseDown);
        // playerElement.addEventListener('mousemove', handleMouseMove);
        // playerElement.addEventListener('mouseup', handleMouseUp);
        // playerElement.addEventListener('mouseleave', handleMouseUp); // 플레이어 영역 밖으로 나가도 드래그 종료

        playerElement.addEventListener('touchstart', handleMouseDown, { passive: true });
        playerElement.addEventListener('touchmove', handleMouseMove, { passive: true });
        playerElement.addEventListener('touchend', handleMouseUp);
        playerElement.addEventListener('touchcancel', handleMouseUp);



        // 오류 이벤트 리스닝
        newPlayerInstance.on('error', () => {
            console.error('Video error:', newPlayerInstance.error());
        });

        // 메타데이터 로딩 이벤트
        newPlayerInstance.on('loadedmetadata', () => {
            console.log('Video metadata loaded');
        });

        newPlayerInstance.on('fullscreenchange', function() {

            // 타이밍 이슈를 피하기 위해 setTimeout 사용
            setTimeout(function() {
                if (rendererRef.current) {

                    rendererRef.current.setCurrentTime(0);
                    setTimeout(function() {
                        if (rendererRef.current) {
                            // @ts-ignore
                            const currentTime = videoRef.current!.currentTime; // video.js 플레이어의 현재 시간
                            const offsetTime = rendererRef.current.timeOffset;
                            rendererRef.current.setCurrentTime(currentTime+offsetTime);
                        }
                    }, 100); // 100~150ms 정도로 넉넉하게 설정

                }
            }, 100); // 100~150ms 정도로 넉넉하게 설정

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
            // 드래그 이벤트 리스너 제거
            // playerElement.removeEventListener('mousedown', handleMouseDown);
            // playerElement.removeEventListener('mousemove', handleMouseMove);
            // playerElement.removeEventListener('mouseup', handleMouseUp);
            // playerElement.removeEventListener('mouseleave', handleMouseUp);
            playerElement.removeEventListener('touchstart', handleMouseDown);
            playerElement.removeEventListener('touchmove', handleMouseMove);
            playerElement.removeEventListener('touchend', handleMouseUp);
            playerElement.removeEventListener('touchcancel', handleMouseUp);

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
