import axios from "axios";
import { useNavigate } from "react-router-dom";

const LogoutComponent = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axios.get("http://localhost:8080/api/logout");
        } catch (error) {
            console.error("Logout failed", error);
        } finally {
            sessionStorage.removeItem('userId');
            sessionStorage.removeItem('userToken');
            navigate('/login'); 
        }
    };

    return (
        <button onClick={handleLogout} className="courseButton">Logout</button>
    );
};

export default LogoutComponent;
