import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

interface LogoutComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export function LogoutComponent({ className = "", children }: LogoutComponentProps) {
  const { getAccessTokenSilently, logout } = useAuth0();

  const handleLogout = async () => {
    try {
      const token = await getAccessTokenSilently();
      await fetch("http://localhost:8080/api/auth/logout", {
        method: "POST",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      logout({ logoutParams: { returnTo: window.location.origin } });
    } catch (e) {
      console.error("Logout failed", e);
    }
  };

  return (
    <button className={className} onClick={handleLogout}>
      {children || "Logout"}
    </button>
  );
}
