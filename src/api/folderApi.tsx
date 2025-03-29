import axiosClient from './axiosClient';

export interface Folder {
    folder_id: string;
    name: string;
    level : number;
    hasFiles: boolean;
}

export interface TreeFolder extends Folder {
    children?: TreeFolder[] | null;
}

// 폴더 데이터를 불러오는 함수
export const fetchFolders = async (type: string, folderId: string = "0"): Promise<TreeFolder[]> => {
    const response = await axiosClient.get(`/contents/files?type=${type}&folder_id=${folderId}`);
    return response.data.map((folder: Folder) => ({
        ...folder,
        children: null,
    }));
};

// 특정 폴더의 하위 -폴더들을 불러오는 함수
export const fetchFolderChildren = async (type: string, folderId: string): Promise<TreeFolder[]> => {
    const response = await axiosClient.get(`/contents/files?type=${type}&folder_id=${folderId}`);
    return response.data.map((folder: Folder) => ({
        ...folder,
        children: null,
    }));
};
