import { IconButton } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Register, registerUser } from "../functions/RegisterFunc";
import PersonIcon from '@mui/icons-material/Person';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { AxiosError } from "axios";
import { ErrorResponse } from "../models/Login";
import { setUserData } from "../functions/LoginFunc";
import '../styles/Register.css';

export function RegisterComponent() {
    const [name, setName] = useState<string>("");
    const [surname, setSurname] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [passwordAgain, setPasswordAgain] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [error, setError] = useState<string[]>([]);
    const [registerFailed, setRegisterFailed] = useState<boolean>(false);
    const [submit, setSubmit] = useState<boolean>(false);
    const navigate = useNavigate();

    const clickShowPassword = () => setShowPassword((prev) => !prev);
    const handleMouseEvent = (e: React.MouseEvent<HTMLButtonElement>) => e.preventDefault();

    const valid = (): string[] => {
        let error: string[] = [];
        if (!name) error.push("You must enter your name");
        if (!surname) error.push("You must enter your surname");
        if (!username) error.push("You must enter your username");
        if (username.length < 6) error.push("Username must contain more than 6 characters");
        if (username.length > 20) error.push("Username must contain less than 20 characters");
        if (password.length < 6) error.push("More characters required for password");
        if (password !== passwordAgain) error.push("Passwords don't match");
        return error;
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        setRegisterFailed(false);
        let errorMessage: string[] = valid();
        if (errorMessage.length !== 0) {
            setError(errorMessage);
        } else {
            setSubmit(true);
            setError([]);
            const data = { name, surname, username, password };

            registerUser(data)
                .then((response) => {
                    if (response.status >= 200 && response.status < 300) {
                        const userId = response.data.id.id;
                        if (userId) {
                            sessionStorage.setItem('userId', userId); 
                            navigate(`/homepage/${userId}`);
                        } else {
                            setRegisterFailed(true);
                        }
                    } else {
                        setRegisterFailed(true);
                    }
                })
                .catch((e: AxiosError<ErrorResponse>) => {
                    if (e.response) {
                        errorMessage.push(e.response.data.errorMessage);
                    }
                    setError(errorMessage);
                    setRegisterFailed(true);
                })
                .finally(() => setSubmit(false));
        }
    };

    return (
        <div className='register-container'>
            <div className='register-form-container'>
                <form className="register-form">
                    <div className="input-field">
                        <input
                            type="text"
                            id="name"
                            name="name"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <label htmlFor="name">Name</label>
                    </div>

                    <div className="input-field">
                        <input
                            type="text"
                            id="surname"
                            name="surname"
                            required
                            value={surname}
                            onChange={(e) => setSurname(e.target.value)}
                        />
                        <label htmlFor="surname">Surname</label>
                    </div>

                    <div className="input-field">
                        <input
                            type="text"
                            id="username"
                            name="username"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <label htmlFor="username">
                            <PersonIcon sx={{ width: "20px", height: "20px" }} /> Username
                        </label>
                    </div>

                    <div className="input-field">
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            name="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <label htmlFor="password">
                            <LockRoundedIcon sx={{ width: "20px", height: "20px" }} /> Password
                        </label>
                        <IconButton
                            onClick={clickShowPassword}
                            onMouseDown={handleMouseEvent}
                            edge="end"
                            className="password-toggle"
                        >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </div>

                    <div className="input-field">
                        <input
                            type="password"
                            id="passwordAgain"
                            name="passwordAgain"
                            required
                            value={passwordAgain}
                            onChange={(e) => setPasswordAgain(e.target.value)}
                        />
                        <label htmlFor="passwordAgain">Re-enter Password</label>
                    </div>

                    <div className="register-error">
                        {[...error].map((errorMessage: string, key: number) => (
                            <p key={key} className="error-text">{errorMessage}</p>
                        ))}
                        {registerFailed && <p className="error-text">Registration failed. Try again.</p>}
                    </div>

                    <button
                        type="button"
                        className="register-button"
                        onClick={handleSubmit}
                        disabled={submit}
                    >
                        Register
                    </button>

                    <button
                        type="button"
                        className="login-button"
                        onClick={() => navigate('/login')}
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}
