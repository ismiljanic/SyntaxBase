import { useAuth0 } from "@auth0/auth0-react";

const LogoutComponent = () => {
  const { logout } = useAuth0();

  const handleLogout = () => {
    sessionStorage.clear();
    logout({ logoutParams: { returnTo: window.location.origin } });
  };

  return (
    <button onClick={handleLogout} className="courseButton">
      Logout
    </button>
  );
};

export default LogoutComponent;
