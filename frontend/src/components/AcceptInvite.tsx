import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

const AcceptInvite = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { getAccessTokenSilently, isAuthenticated, loginWithRedirect, user, isLoading } = useAuth0();

    useEffect(() => {
        const token = searchParams.get('token');
        if (!token) return;
        
        const acceptInvite = async () => {
            console.log("Authenticated?: " + isAuthenticated);
            if (!isAuthenticated) {
                await loginWithRedirect({
                    appState: { returnTo: window.location.pathname + window.location.search },
                });
                return;
            }

            try {
                const accessToken = await getAccessTokenSilently();
                const res = await fetch('http://localhost:8080/api/invite/accept', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify({ token }),
                });

                if (!res.ok) {
                    throw new Error('Invite failed');
                }

                const data = await res.json();
                const { courseId, lessonId } = data;

                navigate(`/dynamic-course/${courseId}/lesson/${lessonId}`);
            } catch (error) {
                console.error('Invite error:', error);
                alert('Invalid or expired invite link.');
            }
        };

        if (!isLoading) {
            acceptInvite();
        }
    }, [searchParams, getAccessTokenSilently, isAuthenticated, loginWithRedirect, navigate, isLoading]);

    return <div>Accepting invite...</div>;
};

export default AcceptInvite;
