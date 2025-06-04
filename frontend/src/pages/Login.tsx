import React, { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { LoginComponent } from "../components/Login";

export function Login() {
  const { isAuthenticated, user, getAccessTokenSilently, isLoading } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading || !isAuthenticated || !user) return;

    const syncUserWithBackend = async () => {
      try {
        const token = await getAccessTokenSilently();

        const response = await fetch("http://localhost:8080/api/users/sync-auth0", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            email: user.email,
            name: user.given_name || "",
            surname: user.family_name || "",
          }),
        });

        if (!response.ok) {
          throw new Error("Sync failed");
        }

        const userData = await response.json();
        if (userData.role === "ADMIN") {
          navigate('/admin');
        } else {
          navigate(`/homepage/${encodeURIComponent(user.sub || "")}`);
        }
      } catch (error) {
        console.error("User sync failed", error);
      }
    };

    syncUserWithBackend();
  }, [isAuthenticated, user, getAccessTokenSilently, isLoading, navigate]);


  return (
    <div>
      <LoginComponent />
    </div>
  );
}
