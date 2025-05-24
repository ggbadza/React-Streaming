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

// Quality Level 타입들
export interface QualityLevel {
  enabled: boolean;
  height: number;
  width: number;
  bitrate: number;
  id: string;
}

export interface QualityLevelList {
  length: number;
  selectedIndex: number;
  [index: number]: QualityLevel;
  addQualityLevel(qualityLevel: QualityLevel): QualityLevel;
  removeQualityLevel(qualityLevel: QualityLevel): QualityLevel | null;
  getQualityLevelById(id: string): QualityLevel | null;
}

export {};
