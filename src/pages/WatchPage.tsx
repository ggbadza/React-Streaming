import {useNavigate, useParams} from 'react-router-dom';
import VideoPlayer from '../components/layouts/VideoPlayer';
import {useEffect, useState} from "react";
import {ContentsInfoWithFiles, fetchContentsAndFilesByFileId, FileInfoSummary} from "../api/contentsApi.tsx";
import {styled} from "@mui/material/styles";
import MuiCard from "@mui/material/Card";
import { Typography, Divider, Box, CircularProgress, Alert, List, ListItemText, ListItemButton } from '@mui/material'; // ListItemButton 추가

const Card = styled(MuiCard)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    width: '100%',
    // padding: theme.spacing(4),
    gap: theme.spacing(2),
    margin: 'auto',
    boxShadow:
        theme.palette.mode === 'dark'
            ? 'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px'
            : 'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
}));

export default function WatchPage() {
    const { id } = useParams();          // id == fileId
    const [contentsInfoWithFiles, setContentsInfoWithFiles] = useState<ContentsInfoWithFiles>();
    const [nowFileInfo, setNowFileInfo] = useState<FileInfoSummary>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const data = await fetchContentsAndFilesByFileId(Number(id));
                setContentsInfoWithFiles(data);
                setNowFileInfo(data.filesInfoList.find(file => file.id === Number(id)));
                setError(null);
            } catch (error) {
                console.error('Failed to fetch contents info:', error);
                setError('컨텐츠 정보를 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const renderContentDetails = () => {
        if (loading) {
            // 로딩 스피너를 해당 Box 내부에 표시 (전체 화면 아님)
            return (
                <Box sx={{
                    p: 2,
                    textAlign: 'left',
                    width: '80vw'
                }}>
                    <CircularProgress />
                </Box>
            );
        }

        if (error) {
            // 에러 메시지를 해당 Box 내부에 표시 (전체 화면 아님)
            return (
                <Box sx={{
                    p: 2,
                    textAlign: 'left',
                    width: '80vw'
                }}>
                    <Alert severity="error" sx={{ width: '100%', maxWidth: 600 }}>
                        {error}
                    </Alert>
                </Box>
            );
        }

        if (contentsInfoWithFiles && nowFileInfo) {
            return (
                <Box sx={{
                    p: 2,
                    textAlign: 'left',
                    width: '80vw'
                }}>
                    <h2>{nowFileInfo.fileName || '제목 없음'}</h2>
                    <p>{nowFileInfo.resolution || '해상도 정보 없음'} • {nowFileInfo.hasSubtitle ? '자막 있음' : '자막 없음'}</p>
                </Box>
            );
        }

        return null;
    };

    const onFileSelect = (file: FileInfoSummary) => {
        if (file.id && file.id !== Number(id)) { // 현재 파일과 다른 경우에만 이동
            navigate(`/watch/${file.id}`);
        }
    };





    return (
        <Box
            sx={{
                position: 'relative',
                boxSizing: 'border-box',
                overflow: 'hidden',
                width: '100%',
                display: 'flex', // flexbox를 사용하여 내부 요소를 정렬
                justifyContent: 'flex-start', // 왼쪽으로 정렬
            }}>
            <Box sx={{
                display: {
                    xs: 'relative',
                    sm: 'flex'},
                flexDirection: 'row',
                width: '100%',
            }}>
                <Box sx={{
                    display: 'relative',
                    width: {
                        xs: '100%',
                        sm: '80%'},
                }}>
                    <Box>
                        <VideoPlayer fileId={id!} />
                    </Box>
                    <Box sx={{
                        mt : 2 }}>
                        {renderContentDetails()}
                    </Box>
                </Box>
                {/*// ---------- 재생 목록 ---------- */}
                <Card sx ={{
                    width: {
                        xs: '100%',
                        sm: '20%'},
                    ml :'10px',
                    mt : '0px',
                    maxHeight: {
                        xs: '100%',
                        sm: '45vw'},
                    overflowY: 'auto'}}>
                    <Typography variant="subtitle1" sx={{ px: 2, pt: 4 ,fontWeight: 'bold' }}>
                        {contentsInfoWithFiles && contentsInfoWithFiles.title || '-'}
                    </Typography>
                    <Divider />
                    {loading && !contentsInfoWithFiles && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                            <CircularProgress size={24} />
                        </Box>
                    )}
                    {error && !contentsInfoWithFiles && (
                        <Alert severity="error" sx={{ m:1 }}>컨텐츠 목록을 불러올 수 없습니다.</Alert>
                    )}
                    {contentsInfoWithFiles && contentsInfoWithFiles.filesInfoList && contentsInfoWithFiles.filesInfoList.length > 0 ? (
                        <List dense>
                            {contentsInfoWithFiles.filesInfoList.map((file) => (
                                <ListItemButton
                                    key={file.id}
                                    onClick={() => onFileSelect(file)}
                                    selected={nowFileInfo?.id === file.id}
                                    sx={{ paddingLeft: 2, paddingRight: 2 }}
                                >
                                    <ListItemText
                                        primary={file.fileName || '이름 없는 파일'}
                                        secondary={`${file.resolution || '해상도 정보 없음'} • ${file.hasSubtitle ? '자막 있음' : '자막 없음'}`}
                                    />
                                </ListItemButton>
                            ))}
                        </List>
                    ) : (
                        !loading && <Typography sx={{ p: 2, textAlign: 'center' }} color="textSecondary">재생 가능한 파일이 없습니다.</Typography>
                    )}
                </Card>
                {/*// ---------- 재생 목록 ---------- //*/}
            </Box>
        </Box>
    );
}
