// Login.tsx
import { useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate, Link } from 'react-router-dom';
import { LoginComponent } from "../components/Login";
import '../styles/Login.css';

export function Login() {
    const { isAuthenticated, user, getAccessTokenSilently } = useAuth0();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTokenAndSyncUser = async () => {
            if (isAuthenticated && user) {
                try {
                    const token = await getAccessTokenSilently();

                    sessionStorage.setItem("userToken", token);
                    sessionStorage.setItem("userId", user.sub || "");
                    sessionStorage.setItem("userEmail", user.email || "");

                    const res = await fetch("http://localhost:8080/api/users/sync-auth0", {
                        method: "POST",
                        headers: {
                            "Authorization": `Bearer ${token}`,
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            email: user.email,
                            name: user.given_name || "NoName",
                            surname: user.family_name || "NoSurname"
                        })
                    });

                    const text = await res.text();
                    console.log("Backend response:", text);

                    // Redirect
                    navigate(`/homepage/${encodeURIComponent(user.sub || "")}`);
                } catch (e) {
                    console.error("Failed to sync user with backend", e);
                }
            }
        };

        fetchTokenAndSyncUser();
    }, [isAuthenticated, user, getAccessTokenSilently, navigate]);

    return (
        <div className="login-page">
            <div className="login-header">
                <h1>Welcome Back!</h1>
                <p>Please log in to access your account.</p>
            </div>
            <LoginComponent />
            <div className="login-footer">
                <Link to="/forgot-password" className="footer-link">Forgot Password?</Link>
                <div className="footer-text" style={{ marginLeft: '3em' }}>
                    Don't have an account? <Link to="/register" className="footer-link">Sign Up</Link>
                </div>
                <div className="footer-text" style={{ marginTop: '-1em', marginLeft: '3em' }}>
                    Go to <Link to="/" className="footer-link">Homepage</Link>
                </div>
            </div>
        </div>
    );
}
