import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";

export const useTokenExpiryChecker = () => {
  const { logout, getIdTokenClaims } = useAuth0();

  useEffect(() => {
    const check = async () => {
      const claims = await getIdTokenClaims();
      const exp = claims?.exp;

      if (typeof exp !== "number") return;

      const now = Math.floor(Date.now() / 1000);
      const expiresIn = exp - now;

      if (expiresIn < 10) {
        console.warn("Token is about to expire, logging out...");
        logout({ logoutParams: { returnTo: window.location.origin } });
      } else {
        const nextCheckIn = (expiresIn - 10) * 1000;
        console.log(`Checking again in ${expiresIn - 10}s`);
        setTimeout(check, nextCheckIn);
      }
    };

    check();
  }, [getIdTokenClaims, logout]);
};