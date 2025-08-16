import React, { useEffect, useRef, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import '../../styles/webCourses/BeginnerWebCourse/Finish.css';
import { Header } from '../Header';
import { Footer2 } from '../Footer2';
import { Footer } from '../Footer';
import congrats from '../../images/gzzzzz.png';
import { useNavigate, useParams } from 'react-router-dom';
import LoadingScreen from '../../components/LoadingScreen';

export function FinishTutorial() {
    const { user, isLoading, isAuthenticated, getAccessTokenSilently } = useAuth0();
    const [auth0UserId, setAuth0UserId] = useState<string | null>(null);
    const { courseId } = useParams<{ courseId?: string }>();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAuth0UserId = async () => {
            if (!isLoading && isAuthenticated && user?.sub) {
                try {
                    const token = await getAccessTokenSilently();
                    const res = await fetch(`http://localhost:8080/api/users/by-auth0-id/${encodeURIComponent(user.sub)}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    if (!res.ok) throw new Error('Failed to fetch user Auth0 ID');
                    const data = await res.json();
                    setAuth0UserId(data.auth0id);
                } catch (err) {
                    console.error('Error fetching user Auth0 ID:', err);
                    setAuth0UserId(null);
                }
            }
        };

        fetchAuth0UserId();
    }, [isLoading, isAuthenticated, user, getAccessTokenSilently]);

    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const goToHomepage = () => {
        if (auth0UserId) {
            window.location.href = `/homepage/${encodeURIComponent(auth0UserId)}`;
        } else {
            alert('User information not loaded yet. Please try again.');
            window.location.href = '/';
        }
    };

    if (isLoading) {
        return <LoadingScreen/>;
    }
    
    return (
        <div>
            <canvas ref={canvasRef} className="confetti-canvas" />
            <Header bgColor="#f6f6f6" />

            <div className="finish-content">
                <h1>Congratulations!</h1>
                <p>You’ve successfully completed tutorial.</p>
                <div className="congrats-img-container">
                    <img className="congrats-img" src={congrats} alt="Congratulations" />
                </div>

                <div className="finish-actions">
                    <button onClick={() => (window.location.href = '/tutorials')}>Explore More Tutorials</button>
                    <button onClick={goToHomepage}>Go to Homepage</button>
                </div>
            </div>

            <Footer2 bgColor="#f6f6f6" />
            <Footer bgColor="#f6f6f6" />
        </div>
    );
}