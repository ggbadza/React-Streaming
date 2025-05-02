import React, { FC, PropsWithChildren, useState } from 'react';
import Box from "@mui/material/Box";
import { Button } from '@mui/material';
import ContentsPopup from '../components/layouts/ContentsPopup';
import ContentCard from '../components/ContentCard';

interface ContentData {
    id: number;
    title: string;
    imageUrl: string;
    rating?: string;
}

const TestPage: FC<PropsWithChildren<{}>> = () => {

    const [open, setOpen] = useState<boolean>(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [contents, setContents] = useState<ContentData[]>([]);


    return (
        <Box
            sx={{
                width: "100%",
                minHeight: "100vh",
                bgcolor: "background.default",
            }}
        >
            <Button variant="contained" onClick={handleOpen}>
                콘텐츠 상세보기
            </Button>
            <ContentCard
                image="https://via.placeholder.com/800x450.png?text=Thumbnail"
                title="약사의 혼잣말"
                type="anime"
            />
            <ContentsPopup
                open={open}
                onClose={handleClose}
                title="약사의 혼잣말"
                description="역사서 고증격책 걸 지내며 양산선태..."
                thumbnailUrl="https://via.placeholder.com/800x450.png?text=Thumbnail"
            />
        </Box>
    );
};

export default TestPage;
