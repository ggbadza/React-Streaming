import axiosClient from './axiosClient';

export interface ContentsResponse {
    contentsId: number;
    title: string;
    description: string;
    thumbnailUrl: string;
    posterUrl: string;
    type: string;
    folderId: number;
}

export interface RecommendContentsResponse {
    userId: string;
    recommendSeq: number;
    description: string;
    contentsResponseList: ContentsResponse[];
}

export interface FileInfoSummary {
    id: number;
    fileName: string;
    contentsId: number;
    hasSubtitle: boolean;
    resolution: string;
    createdAt: string;
}

export interface ContentsInfoWithFiles {
    contentsId: number;
    title: string;
    description: string;
    thumbnailUrl: string;
    posterUrl: string;
    type: string;
    filesInfoList: FileInfoSummary[];
}

export interface ContentsSearchResult {
     contentsId: number;
     title: string;
     description: string;
     type: string;
     thumbnailUrl: string;
     modifiedAt: string;
}

// 추천 컨텐츠 데이터를 불러오는 함수
export const fetchRecommendContents = async (): Promise<RecommendContentsResponse[]> => {
    const response = await axiosClient.get('/contents/recommend');
    return response.data;
};

// 컨텐츠 데이터를 불러오는 함수
export const fetchContentsById = async (contentsId: number): Promise<ContentsResponse> => {
    const response = await axiosClient.get('/contents/info', {
        params: {
            contentsId: contentsId
        }
    });
    return response.data;
};


// 컨텐츠 내의 파일을 불러오는 함수
export const fetchContentsFiles = async (contentsId: number): Promise<FileInfoSummary[]> => {
    const response = await axiosClient.get('/contents/get_files', {
        params: {
            contentsId: contentsId
        }
    });
    return response.data;
};

// 파일ID로 컨텐츠 데이터와 파일를 불러오는 함수
export const fetchContentsAndFilesByFileId = async (fileId: number): Promise<ContentsInfoWithFiles> => {
    const response = await axiosClient.get('/contents/contents_infos', {
        params: {
            fileId: fileId
        }
    });
    return response.data;
};

export const fetchSearchResults = async (query: string): Promise<ContentsSearchResult[]> => {
    console.log(`API 호출: "${query}"`);
    const response = await axiosClient.post(`/contents/search`, {
        query: query
    });
    return response.data;
};