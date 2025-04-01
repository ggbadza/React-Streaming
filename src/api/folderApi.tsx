import axiosClient from './axiosClient';

export interface Folder {
    folderId: string;
    name: string;
    hasFiles: boolean;
}

export interface TreeFolder extends Folder {
    children?: TreeFolder[] | null;
}

// 폴더 데이터를 불러오는 함수
export const fetchFolders = async (type: string, folderId: string = "0"): Promise<TreeFolder[]> => {
    const response = await axiosClient.get(`/contents/files?type=${type}&pid=${folderId}`);
    return response.data.map((folder: Folder) => ({
        ...folder,
        children: null,
    }));
};