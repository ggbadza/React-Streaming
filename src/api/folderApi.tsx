import axiosClient from './axiosClient';

export interface Folder {
    folderId: string;
    name: string;
    hasFiles: boolean;
    contentsId: number;
    description: string;
    posterUrl: string;
}

export interface TreeFolder extends Folder {
    children?: TreeFolder[] | null;
}

// 폴더 데이터를 불러오는 함수
export const fetchFolders = async (type: string, folderId: string = "1"): Promise<TreeFolder[]> => {
    const response = await axiosClient.get(`/folder/folders?type=${type}&folderId=${folderId}`);
    return response.data.map((folder: Folder) => ({
        ...folder,
        children: null,
    }));
};