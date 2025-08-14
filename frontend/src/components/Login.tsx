import React, { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import "../styles/Login.css";
import { Header } from "../pages/Header";
import { Footer2 } from "../pages/Footer2";
import { Footer } from "../pages/Footer";

export function LoginComponent() {
    const { loginWithRedirect, isAuthenticated, user, getAccessTokenSilently, isLoading } = useAuth0();

    useEffect(() => {
        const sendTokensToBackend = async () => {
            if (!isAuthenticated || !user) return;

            try {
                const accessToken = await getAccessTokenSilently();

                const storageKey = Object.keys(localStorage).find(
                    (key) =>
                        key.startsWith('@@auth0spajs@@') &&
                        key.includes('https://dev-azim8sfu2yz6kzyp.us.auth0.com')
                );

                if (!storageKey) {
                    console.warn("Auth0 tokens not found in localStorage");
                    return;
                }

                const storedData = JSON.parse(localStorage.getItem(storageKey) || "{}");
                const refreshToken = storedData?.body?.refresh_token;

                if (!refreshToken) {
                    console.warn("Refresh token not found in localStorage");
                    return;
                }
                const tokens = { accessToken, refreshToken };

                const response = await fetch("http://localhost:8080/api/auth/login", {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${accessToken}`
                    },
                    body: JSON.stringify({ accessToken, refreshToken }),
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error("Failed to send tokens to backend:", errorText);
                }
            } catch (error) {
                console.error("Error sending tokens to backend", error);
            }
        };

        sendTokensToBackend();
    }, [isAuthenticated, user, getAccessTokenSilently]);

    return (
        <div className="login-container">
            <Header bgColor="#f9f9f9" />
            <div className="login-card">
                {!isAuthenticated ? (
                    <button className="login-button" onClick={() => loginWithRedirect()}>
                        Login with Auth0
                    </button>
                ) : (
                    <p>Logged in as {user?.email}</p>
                )}
            </div>
            <Footer2 bgColor="#f9f9f9" />
            <Footer bgColor="#f9f9f9" />
        </div>
    );
}