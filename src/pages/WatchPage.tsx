import { useParams } from 'react-router-dom';
import VideoPlayer from '../components/layouts/VideoPlayer';
import Box from '@mui/material/Box';

export default function WatchPage() {
    const { id } = useParams();          // id == fileId

    return (
        <Box
            sx={{
                position: 'absolute',
                left: 10,
                right: 0,
                width: '100%',
                paddingLeft: { xs: '64px', sm: '64px' }, // 사이드바 너비만큼 패딩
                boxSizing: 'border-box',
                overflow: 'hidden'
            }}
        >
            <VideoPlayer fileId={id!} />
        </Box>
    );
}
