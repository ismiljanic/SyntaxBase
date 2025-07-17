import { useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";

const InviteHandler = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');
    const { getAccessTokenSilently, isAuthenticated, loginWithRedirect, isLoading } = useAuth0();

    useEffect(() => {
        if (!token) return;
        console.log("Token: " + token);
        const enrollUser = async () => {
            if (!isAuthenticated) {
                await loginWithRedirect({
                    appState: { returnTo: window.location.pathname },
                });
                return;
            }

            try {
                const accessToken = await getAccessTokenSilently();
                const response = await axios.post(
                    `http://localhost:8080/api/invite/accept`,
                    { token },
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );

                const { courseId, lessonId } = response.data;

                navigate(`/dynamic-course/${courseId}/lesson/${lessonId}`);
            } catch (err) {
                console.error("Invite error", err);
                alert("Invalid or expired invite link.");
                navigate("/");
            }
        };

        if (!isLoading) {
            enrollUser();
        }
    }, [token, navigate, isAuthenticated, loginWithRedirect, getAccessTokenSilently, isLoading]);

    return <div>Accepting invite, please wait...</div>;
};

export default InviteHandler;