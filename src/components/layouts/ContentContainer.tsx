import React, { useState } from 'react';
import Box from "@mui/material/Box";
import ContentCard from '../ContentCard.tsx';
import ContentPopup from "../ContentPopup.tsx";
import {ContentsResponse} from "../../api/contentsApi.tsx";


const ContentContainer: React.FC<ContentsResponse> = ({contentsId, title, description, posterUrl, thumbnailUrl, type}) => {

    const [open, setOpen] = useState<boolean>(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleWatchClick = () => {
        // 팝업 닫기
        handleClose();
        // 실제 URL 리다이렉션 (페이지 새로고침 발생)
        window.location.href = `/watch/${contentsId}`;
    };

    return (
        <Box
            sx={{
                width: "100%",
                bgcolor: "background.default",
            }}
        >
            <ContentCard
                cardImage={thumbnailUrl}
                title={title}
                type={type}
                onClick={handleOpen}
            />
            <ContentPopup
                open={open}
                onClose={handleClose}
                title={title}
                description={description}
                posterUrl={posterUrl}
                onWatchClick={handleWatchClick}
            />
        </Box>
    );
};

export default ContentContainer;