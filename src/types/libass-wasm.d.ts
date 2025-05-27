declare module "libass-wasm" {
  interface SubtitleOctopusOptions {
    video: HTMLVideoElement;
    subUrl?: string;
    subContent?: string | ArrayBuffer;
    fonts?: { [key: string]: string | ArrayBuffer };
    availableFonts?: { [key: string]: string };
    fallbackFont?: string;
    workerUrl?: string;
    blendRender?: boolean;
    renderAhead?: number;
    dropAllAnimations?: boolean;
    libassMemoryLimit?: number;
    libassGlyphLimit?: number;
    targetFps?: number;
    prescaleFactor?: number;
    prescaleHeightLimit?: number;
    maxRenderHeight?: number;
    isOurCanvas?: boolean;
  }

  interface SubtitleOctopusEvents {
    ready: () => void;
    error: (error: Error) => void;
    heartbeat: () => void;
  }

  class SubtitleOctopus {
    constructor(options: SubtitleOctopusOptions);

    // 기본 메서드들
    dispose(): void;
    setTrack(content: string | ArrayBuffer): void;
    setTrackByUrl(url: string): void;
    freeTrack(): void;
    render(time: number): void;
    resize(): void;
    resizeWithAspectRatio(maxWidth: number, maxHeight: number, videoWidth: number, videoHeight: number): void;

    // 이벤트 관련
    on<K extends keyof SubtitleOctopusEvents>(event: K, callback: SubtitleOctopusEvents[K]): void;
    off<K extends keyof SubtitleOctopusEvents>(event: K, callback: SubtitleOctopusEvents[K]): void;

    // 속성들
    canvas: HTMLCanvasElement;
    canvasParent: HTMLElement;
    video: HTMLVideoElement;

    // 상태 확인
    isPaused: boolean;

    // 폰트 관련
    createFont(fontName: string, fontData: ArrayBuffer): void;
    setFont(fontName: string): void;

    // 설정 관련
    setLibassMemoryLimit(limit: number): void;
    setLibassGlyphLimit(limit: number): void;
  }

  export default SubtitleOctopus;
}
