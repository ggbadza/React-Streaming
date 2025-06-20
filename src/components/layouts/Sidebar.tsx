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
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MovieIcon from '@mui/icons-material/Movie';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import MotionPhotosAutoIcon from '@mui/icons-material/MotionPhotosAuto';
import TvIcon from '@mui/icons-material/Tv';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import {useAuth} from "../../context/AuthContext.tsx";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

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

const BootstrapTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.arrow}`]: {
        color: theme.palette.common.black,
    },
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: theme.palette.common.black,
        fontSize: '16px'
    },
}));


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


interface Contents {
    id: string;
    name: string;
    description: string;
}

const recommendedContents: Contents[] = [
    { id: 'folder1', name: 'Folder 1', description: "테스트1" },
    { id: 'folder2', name: 'Folder 2' , description: "테스트1"},
    { id: 'folder3', name: 'Folder 3' , description: "테스트1"},
];

const Sidebar: React.FC = () => {
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const { user, logout  } = useAuth();
    const toggleDrawer = () => {
        setOpen((prev) => !prev);
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
                        <BootstrapTooltip title={item.label} placement="right">
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
                        </BootstrapTooltip>
                    ))}
                </List>
                <Divider />
                {/* 추천 폴더 영역 */}
                <BootstrapTooltip title={"팔로잉"} placement="right">
                    <Box sx={{p: 0, mt: 2, mb: 1 }}>

                        <ListItemButton
                            component={Link}
                            to={'/following'}
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
                                <FavoriteBorderIcon />
                            </ListItemIcon>
                            <ListItemText primary={"팔로잉"} sx={{ opacity: open ? 1 : 0 }} />
                        </ListItemButton>
                    </Box>
                </BootstrapTooltip>
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
                <Box sx={{
                    mt: 'auto', // 이 부분이 핵심!
                    py: 2, // 상하 패딩 추가 (선택 사항)
                    px: open ? 2 : 0, // 열렸을 때 패딩 추가
                    display: 'flex', // 내부 요소 정렬을 위해 flex 컨테이너로 설정
                    flexDirection: 'column', // 유저 이름과 로그아웃 버튼을 세로로 정렬
                    alignItems: 'center', // 중앙정렬
                    width: '100%', // 너비를 100%로 설정
                }}>
                    {/* 유저 이름 부분 */}
                    <Typography
                        variant="body1"
                        sx={{
                            mb: 1,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            textAlign: 'center' // 이 부분을 추가합니다.
                        }}
                    >
                        {open && ('환영합니다')}
                        <br /> {/* \n 대신 <br /> 태그를 사용하여 줄바꿈을 명시적으로 처리 */}
                        {user?.userName} {open && ('님')}
                    </Typography>

                    {/* 로그아웃 버튼 부분 */}

                    <BootstrapTooltip title={"로그아웃"} placement="right">
                        <Button
                            onClick={logout}
                            color="inherit"
                            sx={{
                                minWidth: 40,
                                justifyContent: open ? 'initial' : 'center',
                                px: 2.5,
                                display: 'flex',
                                alignItems: 'center',
                                width: open ? 'auto' : '100%', // 닫혔을 땐 전체 너비
                            }}
                        >
                            <Box
                                component="span"
                                sx={{
                                    minWidth: 0,
                                    mr: open ? 3 : 'auto',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <LogoutIcon />
                            </Box>
                            <Typography
                                variant="body1"
                                sx={{
                                    opacity: open ? 1 : 0,
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    display: open ? 'block' : 'none',
                                }}
                            >
                                로그아웃
                            </Typography>
                        </Button>
                    </BootstrapTooltip>
                </Box>
            </Drawer>
        </Box>
    );
};

export default Sidebar;
