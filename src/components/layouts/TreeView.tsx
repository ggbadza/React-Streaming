// TreeView.tsx
import React, {useState, useCallback, useEffect} from "react";
import Box from '@mui/material/Box';
import { RichTreeView } from "@mui/x-tree-view/RichTreeView";
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import CustomTreeItem from '../CustomTreeItem';
import { useTreeData } from '../../hooks/useTreeData';
import { TreeFolder } from "../../api/folderApi";
import ContentPopup from "../ContentPopup.tsx";
import { useContentsData } from '../../hooks/useContentsData.ts'
import {ContentsResponse} from "../../api/contentsApi";

interface TreeViewProps {
    type: string;
}

const getItemLabel = (item: TreeFolder) => item.name;

const TreeView: React.FC<TreeViewProps> = ({ type }) => {
    const { items, loading, error, getItemId, handleItemExpansionToggle } = useTreeData(type);

    const [popupItem, setPopupItem] = useState<ContentsResponse | null>(null);
    const [selectedContentsId, setSelectedContentsId] = useState<number | null>(null);
    const { contentsData, contentsLoading, contentsError } = useContentsData(selectedContentsId);

    // contentsData가 로드되면 팝업 열기
    useEffect(() => {
        if (contentsData && !contentsLoading) {
            setPopupItem(contentsData);
        }
    }, [contentsData, contentsLoading]);

    // 아이템 선택 시 콜백 함수
    const handleItemSelect = useCallback(
        (_event: React.SyntheticEvent, itemId: string | number, isSelected: boolean) => {
            if (!isSelected) return;

            const findItem = (nodes: TreeFolder[]): TreeFolder | undefined => {
                for (const n of nodes) {
                    if (getItemId(n) === itemId) return n;
                    if (n.children) {
                        const r = findItem(n.children);
                        if (r) return r;
                    }
                }
            };

            const item = findItem(items);

            if (item && item.hasFiles && item.contentsId) {
                setSelectedContentsId(item.contentsId); // Hook이 데이터를 로드하도록 트리거
            }
        },
        [items, getItemId],
    );

    const closePopup = () => {
        setPopupItem(null);
        setSelectedContentsId(null);
    };

    if (loading) {
        return (
            <Box sx={{
                display: 'flex',
                justifyContent: 'center', // 수평 가운데
                minWidth: {
                    xs: 'auto',
                    md: '90vw', },
                minHeight: '10vh', }}>
                <CircularProgress />
            </Box>
        );
    }


    if (error) {
        return (
            <Box sx={{
                textAlign: 'left',
                minWidth: {
                    xs: 'auto',
                    md: '90vw',
                },
                minHeight: '10vh',  }}>
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                textAlign: 'left',
                minWidth: {
                    xs: 'auto',
                    md: '90vw',},
                minHeight: '10vh'
            }}>
            <RichTreeView
                items={items}
                slots={{ item: CustomTreeItem }}
                getItemId={getItemId}
                getItemLabel={getItemLabel}
                onItemExpansionToggle={handleItemExpansionToggle}
                onItemSelectionToggle={handleItemSelect}
            />
            {popupItem && (
                <ContentPopup
                    open={Boolean(popupItem)}
                    onClose={closePopup}
                    title={popupItem.title}
                    description={popupItem.description}
                    posterUrl={popupItem.posterUrl}
                    onWatchClick={(id:number) => {
                        window.location.href = `/watch/${id}`;
                    }}
                    contentsId={popupItem.contentsId}
                />
            )}
        </Box>
    );
};

export default TreeView;
