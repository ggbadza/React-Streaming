// api/videoApi.tsx
import {CustomPlayer} from "../types/player";
import axiosClient from "./axiosClient.ts";


export interface SubtitleInfo {
    subtitleId: string;
    language: string;
}

export interface SubtitleMeta {
    hasSubtitle: string;
    count: number;
    subtitleList: SubtitleInfo[];
}

export interface VideoInfo {
    videoType: string,
    url: string,
    pixel: string,
    fileId: number,
    mimeType: string,
}

export interface UseVideoSourceProps {
    player: CustomPlayer | null;
    videoElement: HTMLVideoElement | null;
    fileId: string;
    apiUrl?: string;
    isReady: boolean;
}

export const fetchSubtitleMeta = async (fileId: number): Promise<SubtitleMeta> => {
    const response = await axiosClient.get(`/video/sub_meta?fileId=${fileId}`);
    return response.data;
};

export const fetchVideoPlayList = async (fileId: number): Promise<VideoInfo[]> => {
    const response = await axiosClient.get(`/video/playlist?fileId=${fileId}`);
    return response.data;
};