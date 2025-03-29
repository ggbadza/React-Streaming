// TreeView.tsx
import React, { useEffect, useState } from "react";
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { TreeItem2 } from '@mui/x-tree-view/TreeItem2';
import { TreeFolder, fetchFolders } from "../../api/folderApi";

interface TreeViewProps {
    type: string;
}

const getItemId = (item: TreeFolder) => item.folder_id;
const getItemLabel = (item: TreeFolder) => item.name;

const TreeView: React.FC<TreeViewProps> = ({ type }) => {
    const [items, setItems] = useState<TreeFolder[]>([]);

    useEffect(() => {
        fetchFolders(type)
            .then(setItems)
            .catch(error => console.error("폴더 데이터를 불러오는 중 에러 발생: ", error));
    }, [type]);

    return (
        <RichTreeView
            items={items}
            slots={{ item: TreeItem2 }}
            getItemId={getItemId}
            getItemLabel={getItemLabel}
        />
    );
};

export default TreeView;
