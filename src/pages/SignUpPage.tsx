import * as React from 'react';
import { useNavigate } from "react-router-dom";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import { GoogleIcon, FacebookIcon, SitemarkIcon } from '../components/CustomIcons';
import axiosClient from "../api/axiosClient.ts";

const Card = styled(MuiCard)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    width: '100%',
    padding: theme.spacing(4),
    gap: theme.spacing(2),
    margin: 'auto',
    boxShadow:
        'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
    [theme.breakpoints.up('sm')]: {
        width: '450px',
    },
    ...theme.applyStyles('dark', {
        boxShadow:
            'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
    }),
}));

const SignUpContainer = styled(Stack)(({ theme }) => ({
    height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
    minHeight: '100%',
    padding: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
        padding: theme.spacing(4),
    },
    '&::before': {
        content: '""',
        display: 'block',
        position: 'absolute',
        zIndex: -1,
        inset: 0,
        backgroundImage:
            'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
        backgroundRepeat: 'no-repeat',
        ...theme.applyStyles('dark', {
            backgroundImage:
                'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
        }),
    },
}));

export default function SignUpPage() {
    const navigate = useNavigate();
    const [emailError, setEmailError] = React.useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
    const [passwordError, setPasswordError] = React.useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
    const [nameError, setNameError] = React.useState(false);
    const [nameErrorMessage, setNameErrorMessage] = React.useState('');
    const [regCodeError, setRegCodeError] = React.useState(false);
    const [regCodeErrorMessage, setRegCodeErrorMessage] = React.useState('');

    const validateInputs = () => {
        const userid = document.getElementById('userid') as HTMLInputElement;
        const password = document.getElementById('password') as HTMLInputElement;
        const name = document.getElementById('nickname') as HTMLInputElement;
        const regCode = document.getElementById('regcode') as HTMLInputElement;


        let isValid = true;

        if (!userid.value || userid.value.length < 4) {
            setEmailError(true);
            setEmailErrorMessage('ID는 4자리 이상이어야 합니다.');
            isValid = false;
        } else {
            setEmailError(false);
            setEmailErrorMessage('');
        }

        if (!password.value || password.value.length < 6) {
            setPasswordError(true);
            setPasswordErrorMessage('패스워드는 6자리 이상이어야 합니다.');
            isValid = false;
        } else {
            setPasswordError(false);
            setPasswordErrorMessage('');
        }

        if (!name.value || name.value.length < 1) {
            setNameError(true);
            setNameErrorMessage('닉네임은 필수 사항 입니다.');
            isValid = false;
        } else {
            setNameError(false);
            setNameErrorMessage('');
        }

        if (!regCode.value || regCode.value.length < 1) {
            setRegCodeError(true);
            setRegCodeErrorMessage('가입 코드는 필수 사항 입니다.');
            isValid = false;
        } else {
            setRegCodeError(false);
            setRegCodeErrorMessage('');
        }

        return isValid;
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!validateInputs()) return;

        const data = new FormData(event.currentTarget);

        const userId = data.get('userid');
        const password = data.get('password');
        const name = data.get('nickname');
        const regCode = data.get('regcode');

        try {
            const response = await axiosClient.post("/user/register", {
                userId: userId,
                userName : name,
                password: password,
                regCode :regCode
            });

            // 회원가입 성공 처리
            if (response.status === 200) {
                navigate("/"); // 리다이렉트
            }
        } catch (error) {
            setRegCodeError(true);
            setRegCodeErrorMessage("회원가입에 실패했습니다. 정보를 확인해주세요.");
        }

    };

    return (
        <SignUpContainer direction="column" justifyContent="space-between">
            <Card variant="outlined">
                <SitemarkIcon/>
                <Typography
                    component="h1"
                    variant="h4"
                    sx={{width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)'}}
                >
                    회원가입
                </Typography>
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{display: 'flex', flexDirection: 'column', gap: 2}}
                >
                    <FormControl>
                        <FormLabel htmlFor="id">ID</FormLabel>
                        <TextField
                            required
                            fullWidth
                            id="userid"
                            placeholder="ID"
                            name="userid"
                            autoComplete="id"
                            variant="outlined"
                            error={emailError}
                            helperText={emailErrorMessage}
                            color={passwordError ? 'error' : 'primary'}
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel htmlFor="password">Password</FormLabel>
                        <TextField
                            required
                            fullWidth
                            name="password"
                            placeholder="••••••"
                            type="password"
                            id="password"
                            autoComplete="new-password"
                            variant="outlined"
                            error={passwordError}
                            helperText={passwordErrorMessage}
                            color={passwordError ? 'error' : 'primary'}
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel htmlFor="name">닉네임</FormLabel>
                        <TextField
                            autoComplete="nickname"
                            name="nickname"
                            required
                            fullWidth
                            id="nickname"
                            placeholder="닉네임"
                            error={nameError}
                            helperText={nameErrorMessage}
                            color={nameError ? 'error' : 'primary'}
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel htmlFor="reg_code">가입 코드</FormLabel>
                        <TextField
                            autoComplete="가입코드"
                            name="regcode"
                            required
                            fullWidth
                            id="regcode"
                            placeholder="가입 코드"
                            error={regCodeError}
                            helperText={regCodeErrorMessage}
                            color={regCodeError ? 'error' : 'primary'}
                        />
                    </FormControl>
                    {/*<FormControlLabel*/}
                    {/*    control={<Checkbox value="allowExtraEmails" color="primary"/>}*/}
                    {/*    label="I want to receive updates via email."*/}
                    {/*/>*/}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        onClick={validateInputs}
                    >
                        회원가입
                    </Button>
                </Box>
                <Divider>
                    <Typography sx={{color: 'text.secondary'}}>or</Typography>
                </Divider>
                <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
                    {/*<Button*/}
                    {/*    fullWidth*/}
                    {/*    variant="outlined"*/}
                    {/*    onClick={() => alert('Sign up with Google')}*/}
                    {/*    startIcon={<GoogleIcon/>}*/}
                    {/*>*/}
                    {/*    Sign up with Google*/}
                    {/*</Button>*/}
                    {/*<Button*/}
                    {/*    fullWidth*/}
                    {/*    variant="outlined"*/}
                    {/*    onClick={() => alert('Sign up with Facebook')}*/}
                    {/*    startIcon={<FacebookIcon/>}*/}
                    {/*>*/}
                    {/*    Sign up with Facebook*/}
                    {/*</Button>*/}
                    <Typography sx={{textAlign: 'center'}}>
                        이미 계정이 있으신가요?{' '}
                        <Link
                            href="/login/"
                            variant="body2"
                            sx={{alignSelf: 'center'}}
                        >
                            로그인 하기
                        </Link>
                    </Typography>
                </Box>
            </Card>
        </SignUpContainer>
    );
}