// CustomPlayer 타입 정의

import Player from "video.js/dist/types/player";

// CustomPlayer 확장
export interface CustomPlayer extends Player {
  textTracks(): TextTrackList;
  qualityLevels(): QualityLevelList;
  hlsQualitySelector(options?: { displayCurrentQuality?: boolean }): void;

  dispose(): void;

  on(ready: string, param2: () => void): void;
}

// TextTrack 관련 타입
export type TextTrackList = Array<TextTrack>;

// // Quality Level 타입들
// export interface QualityLevel {
//   enabled: function;
//   height: number;
//   width: number;
//   bitrate: number;
//   id: string;
//   frameRate: number;
// }
//
// export interface Representation {
//   id: string,
//   width: number,
//   height: number,
//   bitrate: number,
//   frameRate: number,
//   enabled: function
// }
//
//
// export interface QualityLevelList {
//   length: number;
//   selectedIndex: number;
//   [index: number]: QualityLevel;
//   addQualityLevel(representation: Representation): Representation;
//   removeQualityLevel(qualityLevel: QualityLevel): QualityLevel | null;
//   getQualityLevelById(id: string): QualityLevel | null;
// }

export interface VideojsComponentOptions {
  children?: (string | { name: string; options?: VideojsComponentOptions })[];
  [key: string]: any; // 가장 일반적인 경우를 위해 모든 추가 속성 허용
  controlText?: string; // 버튼 컴포넌트에서 사용되는 툴팁 텍스트
  onClick?: (...args: any[]) => void; // 버튼 클릭 핸들러
}

export {};
