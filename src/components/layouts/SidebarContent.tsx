import * as React from 'react';
import { Link } from 'react-router-dom';
import { styled, useTheme, Theme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import LogoutIcon from '@mui/icons-material/Logout';
import MovieIcon from '@mui/icons-material/Movie';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import MotionPhotosAutoIcon from '@mui/icons-material/MotionPhotosAuto';
import TvIcon from '@mui/icons-material/Tv';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useAuth } from "../../context/AuthContext.tsx";
import { SxProps } from "@mui/material"; // Import SxProps

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

interface MenuItem {
    id: string;
    label: string;
    icon: React.ReactElement;
    route: string;
}

const menuItems: MenuItem[] = [
    { id: 'anime', label: '애니메이션', icon: <MotionPhotosAutoIcon />, route: '/anime' },
    { id: 'drama', label: '드라마', icon: <TvIcon />, route: '/drama' },
    { id: 'movie', label: '영화', icon: <MovieIcon />, route: '/movie' },
    { id: 'streaming', label: '스트리밍', icon: <LiveTvIcon />, route: '/streaming' },
];

interface SidebarContentProps {
    open?: boolean;
    isMobile?: boolean;
}

const SidebarContent: React.FC<SidebarContentProps> = ({ open = false, isMobile = false }) => {
    const { user, logout } = useAuth();

    const listStyles: SxProps<Theme> = isMobile ? {
        display: 'flex',
        flexDirection: 'row',
        p: 0,
        backgroundColor: 'background.paper'
    } : {};

    const listItemButtonStyles: SxProps<Theme> = isMobile ? {
        flexDirection: 'column',
        minWidth: 'auto',
        px: 2,
        py: 1,
    } : {
        minHeight: 48,
        justifyContent: open ? 'initial' : 'center',
        px: 2.5,
    };

    const listItemIconStyles: SxProps<Theme> = isMobile ? {
        minWidth: 0,
        justifyContent: 'center',
    } : {
        minWidth: 0,
        mr: open ? 3 : 'auto',
        justifyContent: 'center',
    };

    const logOutStyles: SxProps<Theme> = isMobile ? {
        minWidth: 0,
        justifyContent: 'center',
        mb: 0.5,
    } : {
        mt: 'auto',
        py: 2,
        px: open ? 2 : 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: isMobile ? 'row' : 'column', height: '100%', width: '100%', overflowX: 'auto', }}>
            <List sx={listStyles}>
                {menuItems.map((item) => (
                    <BootstrapTooltip title={item.label} placement={isMobile ? "bottom" : "right"} key={item.id}>
                        <ListItem disablePadding sx={{ display: isMobile ? 'inline-block' : 'block' }}>
                            <ListItemButton
                                component={Link}
                                to={item.route}
                                sx={listItemButtonStyles}
                            >
                                <ListItemIcon sx={listItemIconStyles}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText primary={item.label} sx={{ opacity: open && !isMobile ? 1 : 0, textAlign: isMobile ? 'center' : 'left' , display: open && !isMobile ? 'block' : 'none'} }  />
                            </ListItemButton>
                        </ListItem>
                    </BootstrapTooltip>
                ))}
            </List>
            <Divider />
            <BootstrapTooltip title={"팔로잉"} placement={isMobile ? "bottom" : "right"}>
                <ListItem disablePadding sx={{ display: isMobile ? 'inline-block' : 'block' }}>
                    <ListItemButton
                        component={Link}
                        to={'/following'}
                        sx={listItemButtonStyles}
                    >
                        <ListItemIcon sx={listItemIconStyles}>
                            <FavoriteBorderIcon />
                        </ListItemIcon>
                        <ListItemText primary={"팔로잉"} sx={{ opacity: open && !isMobile ? 1 : 0, textAlign: isMobile ? 'center' : 'left' , display: open && !isMobile ? 'block' : 'none'}} />
                    </ListItemButton>
                </ListItem>
            </BootstrapTooltip>
            <Divider />

            {/*모바일용 로그아웃 레이아웃*/}
            {isMobile && (
                <BootstrapTooltip title={"로그아웃"} placement={isMobile ? "bottom" : "right"}>
                    <ListItem disablePadding sx={{ display: isMobile ? 'inline-block' : 'block' }}>
                        <ListItemButton
                            onClick={logout}
                            sx={listItemButtonStyles}
                        >
                            <ListItemIcon sx={listItemIconStyles}>
                                <LogoutIcon />
                            </ListItemIcon>
                            <ListItemText primary={"로그아웃"} sx={{ opacity: open && !isMobile ? 1 : 0, textAlign: isMobile ? 'center' : 'left', display: isMobile ? 'none' : 'block' }} />
                        </ListItemButton>
                    </ListItem>
                </BootstrapTooltip>
            )}
            {/*데스크탑용 로그아웃 레이아웃*/}
            {!isMobile && (
                <Box sx={logOutStyles}>
                    <Typography
                        variant="body1"
                        sx={{
                            mb: 1,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            textAlign: 'center'
                        }}
                    >
                        {open && ('환영합니다')}
                        <br />
                        {user?.userName} {open && ('님')}
                    </Typography>

                    <BootstrapTooltip title={"로그아웃"} placement={isMobile ? "bottom" : "right"}>
                        <Button
                            onClick={logout}
                            color="inherit"
                            sx={isMobile ? {
                            } : {
                                minWidth: 40,
                                justifyContent: open ? 'initial' : 'center',
                                px: 2.5,
                                display: 'flex',
                                alignItems: 'center',
                                width: open ? 'auto' : '100%',
                            }}
                        >
                            <Box
                                component="span"
                                sx={isMobile ? {
                                } : {
                                    minWidth: 0,
                                    mr: open && !isMobile ? 3 : 'auto',
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
                                    opacity: open && !isMobile ? 1 : 0,
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    display: open && !isMobile ? 'block' : 'none',
                                }}
                            >
                                로그아웃
                            </Typography>
                        </Button>
                    </BootstrapTooltip>
                </Box>
            )}
        </Box>
    );
};

export default SidebarContent;