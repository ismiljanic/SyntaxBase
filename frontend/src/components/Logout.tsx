import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

export function LogoutComponent() {
  const { logout } = useAuth0();

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:8080/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      logout({ logoutParams: { returnTo: window.location.origin } });
    } catch (e) {
      console.error("Logout failed", e);
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
}
