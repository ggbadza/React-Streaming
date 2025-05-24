import React from 'react';
import { Box, Modal, Card, CardMedia, CardContent, Typography, IconButton, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface ContentPopupProps {
    open: boolean;
    onClose: () => void;
    title: string;
    description: string;
    posterUrl: string;
    onWatchClick: () => void;
    // releaseYear: string;
}

const ContentPopup: React.FC<ContentPopupProps> = ({open, onClose, title, description, posterUrl, onWatchClick}) => {
    return (
        <Modal
            open={open}
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: { xs: '90%', sm: 600 },
                    maxWidth: '90%',
                    outline: 'none',
                }}
            >
                <Card
                    sx={{
                        position: 'relative',
                        boxShadow: 5,
                    }}
                >
                    {/* 닫기 버튼 */}
                    <IconButton
                        onClick={onClose}
                        sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            color: 'white',
                            zIndex: 10,
                        }}
                    >
                        <CloseIcon />
                    </IconButton>

                    {/* 콘텐츠 썸네일 */}
                    <CardMedia
                        component="img"
                        // height="300"
                        image={posterUrl}
                        alt={title}
                        sx={{ objectFit: 'cover' }}
                    />

                    {/* 제목, 설명 및 액션 버튼 */}
                    <CardContent
                        sx={{
                            backgroundColor: '#141414',
                            color: '#fff',
                        }}
                    >
                        <Typography variant="h5" gutterBottom>
                            {title}
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                            {description}
                        </Typography>

                        <Box sx={{ mt: 2 }}>
                            <Button onClick={onWatchClick} variant="contained" color="error">
                                시청하기
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </Modal>
    );
};

export default ContentPopup;
