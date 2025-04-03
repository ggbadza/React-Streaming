import { createTheme, responsiveFontSizes } from '@mui/material/styles';

let theme = createTheme({
    // 원하는 설정 추가
});
theme = responsiveFontSizes(theme);

export default theme;