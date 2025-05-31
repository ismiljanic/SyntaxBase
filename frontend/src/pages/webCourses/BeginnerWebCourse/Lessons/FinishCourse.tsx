import React, { useEffect, useRef, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import '../../../../styles/webCourses/BeginnerWebCourse/Finish.css';
import { Header } from '../../../Header';
import { Footer2 } from '../../../Footer2';
import { Footer } from '../../../Footer';
import congrats from '../images/gzzzzz.png';

interface ConfettiParticle {
    x: number;
    y: number;
    r: number;
    d: number;
    color: string;
    tilt: number;
    tiltAngle: number;
    tiltAngleIncrement: number;
}

export function FinishCourse() {
    const { user, isLoading, isAuthenticated, getAccessTokenSilently } = useAuth0();
    const [auth0UserId, setAuth0UserId] = useState<string | null>(null);

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

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const confettiCount = 150;
        const confetti: ConfettiParticle[] = [];

        for (let i = 0; i < confettiCount; i++) {
            confetti.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height - canvas.height,
                r: Math.random() * 6 + 4,
                d: Math.random() * 10 + 10,
                color: `hsl(${Math.random() * 360}, 70%, 60%)`,
                tilt: Math.random() * 10 - 10,
                tiltAngle: 0,
                tiltAngleIncrement: Math.random() * 0.07 + 0.05,
            });
        }

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            confetti.forEach((c) => {
                ctx.beginPath();
                ctx.lineWidth = c.r;
                ctx.strokeStyle = c.color;
                ctx.moveTo(c.x + c.tilt + c.r / 2, c.y);
                ctx.lineTo(c.x + c.tilt, c.y + c.tilt + c.d);
                ctx.stroke();
            });
            update();
        };

        const update = () => {
            confetti.forEach((c) => {
                c.y += 2;
                c.tiltAngle += c.tiltAngleIncrement;
                c.tilt = Math.sin(c.tiltAngle) * 15;
                if (c.y > canvas.height) {
                    c.y = -10;
                    c.x = Math.random() * canvas.width;
                }
            });
        };

        const animate = () => {
            draw();
            requestAnimationFrame(animate);
        };

        animate();

        const resize = () => {
            if (!canvas) return;
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resize);
        return () => window.removeEventListener('resize', resize);
    }, []);

    const goToHomepage = () => {
        if (auth0UserId) {
            window.location.href = `/homepage/${encodeURIComponent(auth0UserId)}`;
        } else {
            alert('User information not loaded yet. Please try again.');
        }
    };

    if (isLoading) {
        return <div>Loading user info...</div>;
    }

    if (!isAuthenticated) {
        return <div>Please log in to view this page.</div>;
    }

    return (
        <div>
            <canvas ref={canvasRef} className="confetti-canvas" />
            <Header bgColor="#f6f6f6" />

            <div className="finish-content">
                <h1>Congratulations!</h1>
                <p>You’ve successfully completed the course.</p>
                <div className="congrats-img-container">
                    <img className="congrats-img" src={congrats} alt="Congratulations" />
                </div>

                <div className="finish-actions">
                    <button onClick={() => (window.location.href = `/beginnerWebDevelopmentQuiz`)}>
                        Take Final Quiz
                    </button>
                    <button onClick={() => (window.location.href = '/courses')}>Explore More Courses</button>
                    <button onClick={goToHomepage}>Go to Homepage</button>
                </div>
            </div>

            <Footer2 bgColor="#f6f6f6" />
            <Footer bgColor="#f6f6f6" />
        </div>
    );
}
