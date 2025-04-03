// TreeView.tsx
import React, { useEffect, useState } from "react";
import Box from '@mui/material/Box';
import { RichTreeView } from "@mui/x-tree-view/RichTreeView";
import CustomTreeItem from '../CustomTreeItem';
import { TreeFolder, fetchFolders } from "../../api/folderApi";

interface TreeViewProps {
    type: string;
}

const getItemId = (item: TreeFolder) => item.folderId;
const getItemLabel = (item: TreeFolder) => item.name;


const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const TreeView: React.FC<TreeViewProps> = ({ type }) => {
    const [items, setItems] = useState<TreeFolder[]>([]);

    // list를 탐색하여 특정 folderId의 children을 업데이트하는 함수
    const updateTreeWithChildren = (
        tree: TreeFolder[],
        folderId: string,
        children: TreeFolder[]
    ): TreeFolder[] => {
        return tree.map(item => {
            if (item.folderId === folderId) {
                return { ...item, children };
            } else if (item.children) {
                return { ...item, children: updateTreeWithChildren(item.children, folderId, children) };
            }
            return item;
        });
    };

// list를 탐색하여 folderId로 노드를 찾는 함수.. map 형식으로 개선 필요
    const findNode = (tree: TreeFolder[], id: string): TreeFolder | null => {
        for (const node of tree) {
            if (node.folderId === id) return node;
            if (node.children) {
                const found = findNode(node.children, id);
                if (found) return found;
            }
        }
        return null;
    };

    // 초기 로딩 시 최상위 폴더(루트)의 1단계 자식들을 불러옵니다.
    useEffect(() => {
        // 먼저 최상위 폴더들을 불러옵니다.
        fetchFolders(type)
            .then(async rootFolders => {
                // 각 루트 폴더마다 1단계 자식들을 불러옵니다.
                const updatedFolders = await Promise.all(
                    rootFolders.map(async folder => {
                        try {
                            const children = await fetchFolders(type, folder.folderId);
                            return { ...folder, children };
                        } catch (error) {
                            console.error("폴더(" + folder.folderId + ") 하위 폴더 불러오기 에러:", error);
                            return folder;
                        }
                    })
                );
                setItems(updatedFolders);
            })
            .catch(error => console.error("최상위 폴더 불러오기 에러:", error));
    }, [type]);

    // 아이템 클릭 시(확장 이벤트) 해당 폴더의 1단계 자식들을 불러옴.
    const handleItemExpansionToggle = async (
        event: React.SyntheticEvent<Element, Event>,
        itemId: string,
        isExpanded: boolean
    ) => {
        if (!isExpanded) return; // 축소 시는 무시

        const node = findNode(items, itemId); // 클릭한 TreeFolder 객체 가져옴
        if (!node) return;

        if (Array.isArray(node.children)) {
            try {
                const updatedChildren = await Promise.all(
                    node.children.map(async child => {
                        // 자식의 children이 null인 경우에만 불러오기
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
    };



    return (
        <Box
            sx={{
                textAlign: 'left',
                minWidth: {
                    xs: 'auto', // 모바일 및 태블릿에서는 auto 또는 원하는 기본값
                    md: '100vh', // 데스크탑에서는 100vh 적용
                },
            }}>
            <RichTreeView
                items={items}
                slots={{ item: CustomTreeItem }}
                getItemId={getItemId}
                getItemLabel={getItemLabel}
                onItemExpansionToggle={handleItemExpansionToggle}
            />
        </Box>
    );
};

export default TreeView;
