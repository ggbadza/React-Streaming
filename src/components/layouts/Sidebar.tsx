import * as React from 'react';
import { Link } from 'react-router-dom';
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MovieIcon from '@mui/icons-material/Movie';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import MotionPhotosAutoIcon from '@mui/icons-material/MotionPhotosAuto';
import TvIcon from '@mui/icons-material/Tv';

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // 앱 바 아래 컨텐츠 배치를 위해 필요함
    ...theme.mixins.toolbar,
}));

// Sidebar용 Drawer 컴포넌트
const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })<{ open: boolean }>(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    })
);


// 상단 메뉴 항목 타입 및 데이터
interface MenuItem {
    id: string;
    label: string;
    icon: React.ReactElement;
    route: string;
}

const topMenuItems: MenuItem[] = [
    { id: 'anime', label: '애니메이션', icon: <MotionPhotosAutoIcon />, route: '/anime' },
    { id: 'drama', label: '드라마', icon: <TvIcon />, route: '/drama' },
    { id: 'movie', label: '영화', icon: <MovieIcon />, route: '/movie' },
    { id: 'streaming', label: '스트리밍', icon: <LiveTvIcon />, route: '/streaming' },
];

// 추천 폴더 타입 및 예시 데이터
interface Folder {
    id: string;
    name: string;
}

const recommendedFolders: Folder[] = [
    { id: 'folder1', name: 'Folder 1' },
    { id: 'folder2', name: 'Folder 2' },
    { id: 'folder3', name: 'Folder 3' },
];

const Sidebar: React.FC = () => {
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const [isPlanCollapsed, setPlanCollapsed] = React.useState(true);

    const toggleDrawer = () => {
        setOpen((prev) => !prev);
    };

    const togglePlan = () => {
        setPlanCollapsed((prev) => !prev);
    };

    return (
        <Box>
            <Drawer variant="permanent" open={open}>
                <DrawerHeader>
                    <IconButton onClick={toggleDrawer}>
                        {open
                            ? theme.direction === 'rtl'
                                ? <ChevronRightIcon />
                                : <ChevronLeftIcon />
                            : <MenuIcon />}
                    </IconButton>
                </DrawerHeader>
                <Divider />
                {/* 상단 메뉴 영역 */}
                <List>
                    {topMenuItems.map((item) => (
                        <ListItem key={item.id} disablePadding sx={{ display: 'block' }}>
                            <ListItemButton
                                component={Link}
                                to={item.route}
                                sx={{
                                    minHeight: 48,
                                    justifyContent: open ? 'initial' : 'center',
                                    px: 2.5,
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : 'auto',
                                        justifyContent: 'center',
                                    }}
                                >
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText primary={item.label} sx={{ opacity: open ? 1 : 0 }} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
                <Divider />
                {/* 추천 폴더 영역 */}
                <Box sx={{ p: 2 }}>
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>
                        추천
                    </Typography>
                    <List>
                        {recommendedFolders.map((folder) => (
                            <ListItem key={folder.id} disablePadding sx={{ display: 'block' }}>
                                <ListItemButton
                                    sx={{
                                        minHeight: 40,
                                        justifyContent: open ? 'initial' : 'center',
                                        px: 2.5,
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            minWidth: 0,
                                            mr: open ? 3 : 'auto',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <InboxIcon />
                                    </ListItemIcon>
                                    <ListItemText primary={folder.name} sx={{ opacity: open ? 1 : 0 }} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Box>
                <Divider />
                {/* 하단 플랜 정보 영역 (접이식) */}
                {/*<Box sx={{ p: 2, cursor: 'pointer' }} onClick={togglePlan}>*/}
                {/*    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>*/}
                {/*        <Typography variant="subtitle1">플랜</Typography>*/}
                {/*        <Typography variant="subtitle1">{isPlanCollapsed ? '+' : '-'}</Typography>*/}
                {/*    </Box>*/}
                {/*    {!isPlanCollapsed && (*/}
                {/*        <Box sx={{ mt: 1 }}>*/}
                {/*            <Typography variant="body2">현재 사용 중인 플랜: 무료 플랜</Typography>*/}
                {/*            <Typography variant="body2">업그레이드 가능</Typography>*/}
                {/*        </Box>*/}
                {/*    )}*/}
                {/*</Box>*/}
            </Drawer>
        </Box>
    );
};

export default Sidebar;
