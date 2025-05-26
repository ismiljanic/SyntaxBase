import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";

export function LoginComponent() {
    const { loginWithRedirect, isAuthenticated, user, getAccessTokenSilently } = useAuth0();

    useEffect(() => {
        const storeUserData = async () => {
            if (isAuthenticated && user) {
                const token = await getAccessTokenSilently();
                sessionStorage.setItem("userToken", token);
                sessionStorage.setItem("userId", user.sub || "");
                sessionStorage.setItem("userEmail", user.email || "");
            }
        };
        storeUserData();
    }, [isAuthenticated, user]);

    const handleLogin = () => {
        loginWithRedirect();
    };

    return (
        <div className="login-container">
            <div className="login-form-container">
                <h2>Login with Auth0</h2>
                <button className="login-button" onClick={handleLogin}>
                    Login
                </button>
            </div>
        </div>
    );
}
