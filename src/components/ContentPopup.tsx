import React, { useEffect, useRef } from 'react';
import { Box, Card, CardMedia, CardContent, Typography, IconButton, Button, CircularProgress, List, ListItem, ListItemText, Backdrop } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useContentFiles } from '../hooks/useContentsFiles.ts';
import { useTheme } from '@mui/material/styles';

interface ContentPopupProps {
    open: boolean;
    onClose: () => void;
    title: string;
    description: string;
    posterUrl: string;
    onWatchClick: (id: number) => void;
    contentsId: number;
}

const ContentPopup: React.FC<ContentPopupProps> = ({open, onClose, title, description, posterUrl, onWatchClick, contentsId}) => {
    const { files, loading, error } = useContentFiles(open ? contentsId : null);
    const theme = useTheme();

    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            // overflow 복원
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [open]);

    if (!open) return null;

    return (
        <>
            <Backdrop
                open={open}
                onClick={onClose}
                sx={{
                    zIndex: 1400,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                }}
            />

            <Box
                sx={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 1401,
                    overflowY: 'auto',
                }}
                onClick={onClose}
            >
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'flex-start',
                        minHeight: '100vh',
                        py: 4,
                    }}
                >
                    <Card
                        onClick={(e) => e.stopPropagation()}
                        sx={{
                            position: 'relative',
                            width: { xs: '90%', sm: 600 },
                            maxWidth: '90%',
                            boxShadow: 5,
                            my: 2,
                            backgroundColor: 'background.paper',
                        }}
                    >
                        <IconButton
                            onClick={onClose}
                            sx={{
                                position: 'absolute',
                                top: 8,
                                right: 8,
                                color: 'white',
                                zIndex: 10,
                                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                '&:hover': {
                                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                }
                            }}
                        >
                            <CloseIcon />
                        </IconButton>

                        <CardMedia
                            component="img"
                            image={posterUrl}
                            alt={title}
                            sx={{ objectFit: 'cover' }}
                        />

                        <CardContent
                            sx={{
                                backgroundColor: 'background.paper',
                                color: 'text.primary',
                            }}
                        >
                            <Typography variant="h5" gutterBottom>
                                {title}
                            </Typography>
                            <Typography variant="body2" gutterBottom sx={{ textAlign: 'left' }}>
                                {description}
                            </Typography>

                            <Box sx={{ mt: 2 ,
                                        }}>
                                <Typography variant="h6" gutterBottom sx={{textAlign : 'center', borderTop : `2px solid ${theme.palette.divider}`, mt: 2, pt: 1}}>
                                    에피소드
                                </Typography>
                                {loading && <CircularProgress size={24} />}
                                {error && <Typography color="error.main">{error}</Typography>}
                                {files.length > 0 && (
                                    <List>
                                        {files.map((file, index) => ( // index를 사용하여 마지막 항목에는 경계선 제거
                                            <ListItem
                                                key={file.id}
                                                sx={{
                                                    // 마지막 항목이 아닐 경우에만 borderBottom 적용
                                                    borderBottom: index < files.length - 1 ? `1px solid ${theme.palette.divider}` : 'none',
                                                    // paddingY: 1,
                                                }}
                                            >
                                                <ListItemText
                                                    primary={file.fileName}
                                                    secondary={`${file.resolution || '해상도 정보 없음'} • ${file.hasSubtitle ? '자막 있음' : '자막 없음'}`}
                                                />
                                                <Button onClick={() => onWatchClick(file.id)}
                                                        variant="contained"
                                                        color="error"
                                                        sx={{
                                                            width: '100px',
                                                            height: '40px',
                                                            flexShrink: 0,
                                                        }}>
                                                    시청하기
                                                </Button>
                                            </ListItem>
                                        ))}
                                    </List>
                                )}
                            </Box>
                        </CardContent>
                    </Card>
                </Box>
            </Box>
        </>
    );
};

export default ContentPopup;