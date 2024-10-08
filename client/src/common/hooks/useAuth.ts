import { SyntheticEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from './redux';
import { logout, saveToken } from '../../redux/slices/auth';
import { login, register } from '../../services/auth';
import { fetchQuestions } from '../../redux/slices/question';
import { fetchReadingQuestions } from '../../redux/slices/readingQuestion';
import { ERROR, SUCCESS } from '../constants';
import useInputForm from './useInputForm';
import { setUser } from '../../redux/slices/user';
import { getUserInfo } from '../../services/user';
import useToast from './useToast';


export default function useAuth() {
    const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { toast } = useToast();
    
    // Call useInputForm hook with correspondent RegEx
    const { value: username, setValue: setUsername, isValid: usernameIsValid } = useInputForm({ regex: /^(?=.{6,20})[a-zA-Z0-9]+/g });
    const { value: email, setValue: setEmail, isValid: emailIsValid } = useInputForm({ regex: /^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/gm });
    const { value: password, setValue: setPassword, isValid: passwordIsValid } = useInputForm({ regex: /(?=.{4,})[a-zA-Z0-9.!_?]+/g });
    const { value: password2, setValue: setPassword2, isValid: password2IsValid } = useInputForm({ regex: /(?=.{4,})[a-zA-Z0-9.!_?]+/g });
    
    const handleLogout = () => {
        dispatch(logout());
        localStorage.removeItem('accessToken');
        localStorage.removeItem('username');
    }

    const handleLogin = async (event: SyntheticEvent | null = null) => {
        if (event) event.preventDefault();
        const { token, error } = await login(username, password);
        
        if (token) { // login successful
            loginActions(token, username);
        } else {
            toast(ERROR, error);
        }
    };

    const handleRegister = async (event: SyntheticEvent) => {
        event.preventDefault();
        const { user, error } = await register(username, email, password, password2);
        if (user) { // login user when register successful
            handleLogin();
            toast(SUCCESS, `Welcome aboard, ${username}!`);
        } else {
            toast(ERROR, error);
        }
    }

    const loginActions = async (token: string, username: string) => {
        localStorage.setItem('accessToken', token);
        localStorage.setItem('username', username);

        // Save to redux slices
        dispatch(saveToken(token)); // authSlice
        dispatch(setUser(await getUserInfo(username))); // userSlice
        // fetch reading and non-reading questions
        dispatch(fetchQuestions());
        dispatch(fetchReadingQuestions());
        // Redirect
        navigate('/');
    }

    return {
        username,
        usernameIsValid,
        setUsername,
        email,
        emailIsValid,
        setEmail,
        password,
        passwordIsValid,
        setPassword,
        password2,
        password2IsValid,
        setPassword2,
        isAuthenticated,
        logout: handleLogout,
        login: handleLogin,
        register: handleRegister,
        refreshLogin: loginActions,
    }
};