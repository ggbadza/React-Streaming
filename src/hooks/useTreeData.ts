import { useState, useEffect, useCallback } from 'react';
import { TreeFolder, fetchFolders } from '../api/folderApi';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const useTreeData = (type: string) => {
    const [items, setItems] = useState<TreeFolder[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // getItemId 함수
    const getItemId = useCallback((item: TreeFolder) => {
        if (!item.folderId) {
            return `file_${item.name}`;
        }
        return item.folderId;
    }, []);

    // list를 탐색하여 특정 folderId의 children을 업데이트하는 함수
    const updateTreeWithChildren = useCallback((
        tree: TreeFolder[],
        folderId: string,
        children: TreeFolder[]
    ): TreeFolder[] => {
        return tree.map(item => {
            const itemId = getItemId(item);
            if (itemId === folderId) {
                return { ...item, children };
            } else if (item.children) {
                return { ...item, children: updateTreeWithChildren(item.children, folderId, children) };
            }
            return item;
        });
    }, [getItemId]);

    // list를 탐색하여 folderId로 노드를 찾는 함수
    const findNode = useCallback((tree: TreeFolder[], id: string): TreeFolder | null => {
        for (const node of tree) {
            const nodeId = getItemId(node);
            if (nodeId === id) return node;
            if (node.children) {
                const found = findNode(node.children, id);
                if (found) return found;
            }
        }
        return null;
    }, [getItemId]);

    // 초기 데이터 로드
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const rootFolders = await fetchFolders(type);
                
                // 각 루트 폴더마다 1단계 자식들을 불러옵니다.
                const updatedFolders = await Promise.all(
                    rootFolders.map(async folder => {
                        try {
                            const children = await fetchFolders(type, folder.folderId);
                            return { ...folder, children };
                        } catch (error) {
                            console.error(`폴더(${folder.folderId}) 하위 폴더 불러오기 에러:`, error);
                            return folder;
                        }
                    })
                );
                
                setItems(updatedFolders);
            } catch (error) {
                console.error("최상위 폴더 불러오기 에러:", error);
                setError("폴더를 불러오는데 실패했습니다.");
            } finally {
                setLoading(false);
            }
        };

        loadInitialData();
    }, [type]);

    // 아이템 확장 토글 핸들러
    const handleItemExpansionToggle = useCallback(async (
        event: React.SyntheticEvent<Element, Event>,
        itemId: string,
        isExpanded: boolean
    ) => {
        if (!isExpanded) return;

        const node = findNode(items, itemId);
        if (!node) return;

        if (Array.isArray(node.children)) {
            try {
                const updatedChildren = await Promise.all(
                    node.children.map(async child => {
                        if (child.children === null) {
                            await delay(100);
                            try {
                                const grandchildren = await fetchFolders(type, child.folderId);
                                return { ...child, children: grandchildren };
                            } catch (error) {
                                console.error(`폴더(${child.folderId}) 하위 폴더 불러오기 에러:`, error);
                                return child;
                            }
                        }
                        return child;
                    })
                );
                setItems(prevItems => updateTreeWithChildren(prevItems, itemId, updatedChildren));
            } catch (error) {
                console.error(`폴더(${itemId}) 하위 폴더 업데이트 에러:`, error);
            }
        }
    }, [items, findNode, type, updateTreeWithChildren]);

    return {
        items,
        loading,
        error,
        getItemId,
        handleItemExpansionToggle
    };
};
