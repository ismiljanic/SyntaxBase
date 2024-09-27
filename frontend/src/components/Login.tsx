import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import '../styles/Login.css';
import axios from "axios";

export function LoginComponent() {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [loginFailed, setLoginFailed] = useState<boolean>(false);
    const [submit, setSubmit] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const navigate = useNavigate();

    const clickShowPassword = () => setShowPassword((hide) => !hide);

    const handleMouseEvent = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
    };

    async function handleSubmit(event: any) {
        event.preventDefault();
        setLoginFailed(false);
        setSubmit(true);
        setError("");

        try {
            const response = await axios.post("http://localhost:8080/api/users/login", {
                username: username,
                password: password
            }, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            });

            if (response.status === 200) {
                const id = response.data["id"];
                const userToken = response.data["token"];
                const userRole = response.data["role"]; 
            
                if (!id || isNaN(parseInt(id))) {
                    alert("Internal application error");
                    setSubmit(false);
                    return;
                }
            
                sessionStorage.setItem('userId', id); 
                sessionStorage.setItem('userToken', userToken); 
                sessionStorage.setItem('userRole', userRole);
            
                const redirectUrl = sessionStorage.getItem('redirectAfterLogin'); 
                if (redirectUrl) {
                    sessionStorage.removeItem('redirectAfterLogin');
                    navigate(redirectUrl); 
                } else {
                    navigate(`/homepage/${id}`);
                }
            }
            
        } catch (error) {
            const userError = error as { response?: { status: number } };
            if (userError.response) {
                if (userError.response.status === 401) {
                    alert("Incorrect Username and Password");
                } else if (userError.response.status === 406) {
                    alert("Username does not exist");
                } else {
                    alert("Internal application error");
                }
            }
            setSubmit(false);
            console.error("Error:", (userError.response?.status ? `HTTP ${userError.response.status}` : 'Unknown error'));
        }
    }


    const handleNavigation = () => {
        navigate("/register");
    };

    return (
        <div className='login-container'>
            <div className='login-form-container'>
                <form className="login-form">
                    <div className="input-field">
                        <input
                            type="text"
                            id="username"
                            name="username"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <label htmlFor="username">Username</label>
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
                        <label htmlFor="password">Password</label>
                        <IconButton
                            onClick={clickShowPassword}
                            onMouseDown={handleMouseEvent}
                            edge="end"
                            className="password-toggle"
                        >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </div>

                    <div className="login-error">
                        {loginFailed && <p className="error-text">Wrong username or password.</p>}
                        {error.length > 0 && <p className="error-text">{error}</p>}
                    </div>

                    <button
                        type="button"
                        className="login-button"
                        onClick={handleSubmit}
                        disabled={submit}
                    >
                        Login
                    </button>

                    <button
                        type="button"
                        className="register-button"
                        onClick={handleNavigation}
                    >
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
}
