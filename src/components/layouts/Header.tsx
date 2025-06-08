import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Grid, IconButton, InputAdornment, Paper, Popper} from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import SearchIcon from '@mui/icons-material/Search';
import { useTheme } from '@mui/material/styles';
import { useColorMode } from '../../context/ColorModeContext';
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import {useNavigate} from "react-router-dom";
import TextField from "@mui/material/TextField";
import {useSearch} from "../../hooks/useSearch.ts";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import CircularProgress from "@mui/material/CircularProgress";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import {TreeFolder} from "../../api/folderApi.tsx";
import {ContentsResponse} from "../../api/contentsApi.tsx";
import ContentPopup from "../ContentPopup.tsx";
import {useContentsData} from "../../hooks/useContentsData.ts";

const Header: React.FC = () => {
    const theme = useTheme();
    const { toggleColorMode } = useColorMode();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const { searchResults, isLoading } = useSearch(searchTerm);
    const searchInputRef = useRef<HTMLDivElement>(null);
    const [selectedContentsId, setSelectedContentsId] = useState<number | null>(null);
    const [popupItem, setPopupItem] = useState<ContentsResponse | null>(null);
    const { contentsData, contentsLoading, contentsError } = useContentsData(selectedContentsId);
    const popperRef = useRef<HTMLDivElement>(null);

    const handleResultClick = (resultId: number) => {
        // 결과 항목 클릭 시 로직 (예: 해당 상세 페이지로 이동)
        // navigate(`/items/${resultId}`);
        // setSearchTerm(''); // 검색창 비우기
        setIsFocused(false);
        setSelectedContentsId(resultId);
    };

    useEffect(() => {
        if (contentsData && !contentsLoading) {
            setPopupItem(contentsData);
        }
    }, [contentsData, contentsLoading]);


    const closePopup = () => {
        setPopupItem(null);
        setSelectedContentsId(null);
    };

    const handleBlur = useCallback((event: React.FocusEvent<HTMLInputElement>) => {
        if (popperRef.current && popperRef.current.contains(event.relatedTarget as Node)) {
            return; // Popper 내부로 포커스가 이동했다면 아무것도 하지 않음
        }
        // 그 외의 경우 (Popper 외부로 포커스가 이동한 경우) Popper를 닫음
        setIsFocused(false);
    }, []);



    return (
        <>
            <Grid
                container
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '60px',
                    alignItems: 'center',
                    zIndex: theme.zIndex.appBar,
                    paddingX: 2,
                }}
            >
                {/* 왼쪽 영역 */}
                <Grid item xs={4.5} sm={3}>
                    <Box sx={{display: 'flex', ml: {xs: 6, sm: 10}, alignItems: 'left'}}>

                        <Button
                            onClick={() => navigate("/main")}
                            sx={{
                                fontSize: {xs: '1.2rem', sm: '1.8rem'},
                                color: 'text.primary',
                                fontWeight: 600,
                                textTransform: 'none',
                            }}
                        >
                            <text
                                fontFamily="맑은 고딕"
                                fontSize="20"
                                font-weight="bold"
                                fill="#FFFFFF"
                            >
                                TankMilU
                            </text>
                        </Button>
                    </Box>
                </Grid>

                {/* 중앙 영역: TextField */}
                <Grid item xs={6} sm={6}>
                    <Box sx={{position: 'relative', width: {xs: '100%', sm: '60%'}, margin: '0 auto'}}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            size="small"
                            placeholder="검색어를 입력하세요"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onFocus={() => setIsFocused(true)}
                            onBlur={handleBlur}
                            ref={searchInputRef} // Popper가 참조할 ref
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon/>
                                        </InputAdornment>
                                    ),
                                },
                            }}
                        />
                        <Popper
                            open={isFocused && searchTerm.length > 0}
                            anchorEl={searchInputRef.current}
                            placement="bottom"
                            sx={{
                                width: searchInputRef.current?.clientWidth, // TextField 너비와 동일하게 설정
                                zIndex: theme.zIndex.modal, // 다른 요소 위에 보이도록 zIndex 설정
                            }}
                            ref={popperRef}
                        >
                            <Paper elevation={3}>
                                <List>
                                    {isLoading ? (
                                        <ListItem sx={{display: 'flex', justifyContent: 'center'}}>
                                            <CircularProgress size={24}/>
                                        </ListItem>
                                    ) : searchResults && searchResults.length > 0 ? (
                                        searchResults.map((result) => (
                                            <ListItem
                                                key={result.contentsId} // key는 가장 바깥쪽 반복 요소에 유지
                                                disablePadding // ListItemButton 사용 시 권장
                                            >
                                                <ListItemButton onClick={() => handleResultClick(result.contentsId)}>
                                                    <ListItemText primary={result.title}/>
                                                </ListItemButton>
                                            </ListItem>
                                        ))
                                    ) : searchResults ? (
                                        <ListItem>
                                            <ListItemText primary="검색 결과가 없습니다."/>
                                        </ListItem>
                                    ) : null}
                                </List>
                            </Paper>
                        </Popper>
                    </Box>
                </Grid>

                {/* 오른쪽 영역: IconButton */}
                <Grid item xs={1.5} sm={3}
                      sx={{display: 'flex', justifyContent: 'flex-end', alignItems: 'right', gap: 2}}>


                    <IconButton
                        onClick={toggleColorMode}
                        color="inherit"
                    >
                        {theme.palette.mode === 'dark' ? <LightModeIcon/> : <DarkModeIcon/>}
                    </IconButton>
                </Grid>
            </Grid>
            {popupItem && (
                <ContentPopup
                    open={Boolean(popupItem)}
                    onClose={closePopup}
                    title={popupItem.title}
                    description={popupItem.description}
                    posterUrl={popupItem.posterUrl}
                    onWatchClick={(id: number) => {
                        window.location.href = `/watch/${id}`;
                    }}
                    contentsId={popupItem.contentsId}
                />
            )}
        </>
    );
};

export default Header;
