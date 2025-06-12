import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

export const useRefreshToken = () => {
  const { getAccessTokenSilently, logout } = useAuth0();

  const handleLogout = async () => {
    try {
      const token = await getAccessTokenSilently();
      await fetch("http://localhost:8080/api/auth/logout", {
        method: "POST",
        credentials: "include",
        headers: { Authorization: `Bearer ${token}` },
      });
      logout({ logoutParams: { returnTo: window.location.origin } });
    } catch (e) {
      console.error("Logout failed", e);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(async () => {
      try {
        const accessToken = await getAccessTokenSilently();

        const res = await fetch("http://localhost:8080/api/auth/refresh", {
          method: "POST",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          console.warn("Failed to refresh token:", res.status);
          if (res.status === 401 || res.status === 403) {
            handleLogout();
          }
        } else {
          console.log("Token refreshed successfully");
        }
      } catch (e) {
        console.error("Error refreshing token", e);
      }
    }, 10 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [getAccessTokenSilently]);
};
