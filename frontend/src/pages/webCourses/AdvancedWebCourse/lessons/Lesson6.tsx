import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Header } from '../../../Header';
import { Footer } from '../../../Footer';
import { Footer2 } from '../../../Footer2';
import '../../../../styles/webCourses/BeginnerWebCourse/Lesson1.css';
import lesson6 from '../images/lesson6.png';
import auth0 from '../images/auth0.png'
import spb from '../images/spb.png';
import pic2 from '../images/pic2.png';
import { useAuth0 } from '@auth0/auth0-react';
import LoadingScreen from '../../../../components/LoadingScreen';

export function Lesson6() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(true);
    const [feedbackSubmitted, setFeedbackSubmitted] = useState<boolean>(false);
    const location = useLocation();
    const { courseId } = useParams();
    const { user, getAccessTokenSilently } = useAuth0();
    const auth0UserId = user?.sub;
    const [isEnrolled, setIsEnrolled] = useState<boolean | null>(null);
    const { lessonNumber } = useParams<{ lessonNumber: string }>();
    const lessonIdNumber = lessonNumber ? parseInt(lessonNumber, 10) : null;
    const [lessonId, setLessonId] = useState<number | null>(null);

    async function fetchLessonId() {
        if (!courseId || !lessonNumber) return;

        try {
            const token = await getAccessTokenSilently();
            const response = await fetch(
                `http://localhost:8080/api/progress/getLessonId?courseId=${courseId}&lessonNumber=${lessonNumber}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            if (!response.ok) throw new Error('Failed to fetch lessonId');

            const data = await response.json();
            setLessonId(data.lessonId);
        } catch (error) {
            console.error('Error fetching lessonId:', error);
        }
    }

    useEffect(() => {
        fetchLessonId();
    }, [courseId, lessonNumber, getAccessTokenSilently]);

    useEffect(() => {
        async function checkEnrollment() {
            if (!user) {
                navigate('/login');
                return;
            }
            try {
                const token = await getAccessTokenSilently();
                const response = await fetch(
                    `http://localhost:8080/api/progress/isEnrolled?courseId=${courseId}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                if (response.status === 403) {
                    navigate('/forbidden');
                    return;
                }
                if (!response.ok) throw new Error('Network error');
                setIsEnrolled(true);
            } catch (err) {
                console.error(err);
                navigate('/error');
            }
        }
        checkEnrollment();
    }, [user, courseId, getAccessTokenSilently, navigate]);

    useEffect(() => {
        if (!user?.sub || lessonId === null) {
            setLoading(false);
            return;
        }

        const checkFeedbackStatus = async () => {
            try {
                const token = await getAccessTokenSilently();
                const response = await fetch(`http://localhost:8080/api/feedback/status?lessonId=${lessonId}`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) throw new Error('Network response not ok');
                const status = await response.text();
                setFeedbackSubmitted(status === "Thank you for your feedback!");
            } catch (error) {
                console.error('Error checking feedback status:', error);
            } finally {
                setLoading(false);
            }
        };

        checkFeedbackStatus();
    }, [user?.sub, lessonId, getAccessTokenSilently]);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const scrollTo = params.get('scrollTo');
        if (scrollTo) {
            const targetSection = document.getElementById(scrollTo);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, [location.search]);

    if (lessonIdNumber === null) {
        return <p>Lesson ID is missing or invalid.</p>;
    }

    const sendFeedback = async (feedbackType: string) => {
        if (!user?.sub) {
            console.error('User is not logged in');
            return;
        }

        try {
            const token = await getAccessTokenSilently();
            const response = await fetch(`http://localhost:8080/api/feedback/submit`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    lessonId: lessonId,
                    feedback: feedbackType,
                }),
            });

            if (response.ok) {
                if (lessonId !== null) {
                    await markLessonAsCompleted(lessonId);
                } else {
                    console.error('lessonId is null, cannot mark lesson as completed');
                }
                setFeedbackSubmitted(true);
            } else {
                console.error('Failed to send feedback');
            }
        } catch (error) {
            console.error('Error sending feedback:', error);
        }
    };

    const markLessonAsCompleted = async (lessonId: number) => {
        try {
            const token = await getAccessTokenSilently();

            const response = await fetch(`http://localhost:8080/api/feedback/complete`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ lessonId }),
            });

            if (!response.ok) {
                console.error('Failed to mark lesson as completed');
            } else {
                await fetchLessonId();
            }
        } catch (error) {
            console.error('Error marking lesson as completed:', error);
        }
    };
    const handleUnderstand = async () => {
        await sendFeedback('understood');
    };

    const handleDidntUnderstand = async () => {
        await sendFeedback('didntUnderstand');
    };

    const updateProgress = async () => {
        if (!auth0UserId) {
            console.error('User is not authenticated');
            return;
        }

        try {
            const token = await getAccessTokenSilently();

            const response = await fetch(`http://localhost:8080/api/progress/update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    courseId: courseId,
                    lessonId: lessonIdNumber,
                }),
            });

            if (!response.ok) {
                console.error('Failed to update progress');
            }
        } catch (error) {
            console.error('Error updating progress:', error);
        }
    };

    const handleNextLesson = async () => {
        await updateProgress();
        const nextLessonId = lessonIdNumber + 1;
        navigate(`/course/${courseId}/lesson/${nextLessonId}`);
    };

    const handlePreviousLesson = async () => {
        await updateProgress();
        const previousLessonId = lessonIdNumber - 1;
        navigate(`/course/${courseId}/lesson/${previousLessonId}`);
    };

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <div className='mainContainer'>
            <Header bgColor="rgb(247, 250, 251)" />

            <div className='lessonIntroduction'>
                <h1>Full-Stack Integration</h1>
                <p>
                    Welcome to <b>Lesson 6</b> of the <b>Advanced Web Development course</b>.
                    Connect your React frontend with Spring Boot APIs, handle authentication and authorization, and ensure secure and smooth data flow across your stack.
                </p>
            </div>

            <div className='aboutBeginnerWeb'>
                <div className="aboutCourseDiv2" style={{ paddingBottom: '7em' }}>
                    <div className="introductionDiv">Introduction</div>
                    <div className="frontImageBeginner">
                        <h1 className="headerDivText" style={{ fontSize: '1.7em' }}>
                            <div className="headerContainer" style={{ width: 'fit-content' }}>
                                Why Full-Stack Integration?
                            </div>
                            <div className="imageContainer">
                                <img src={lesson6} alt="Full-Stack Integration" className="imageForCourse" />
                            </div>
                        </h1>
                    </div>

                    <div className="descriptionOfCourse">
                        Building a full-stack application requires seamless communication between frontend and backend. In this lesson, you’ll integrate React with Spring Boot APIs,
                        manage authentication with JWT, handle authorization, and ensure data flows securely and efficiently between layers.
                    </div>
                </div>

                <div className="aboutCourseDiv2" style={{ paddingBottom: '0em' }}>
                    <div className="introductionDiv">Core Concepts</div>
                    <div className="frontImageBeginner">
                        <h1 className="headerDivText" style={{ fontSize: '1.7em' }}>
                            <div className="headerContainer" style={{ width: 'fit-content' }}>
                                Data Flow, Auth & API Consumption
                            </div>
                            <div className="imageContainer">
                                <img src={auth0} alt="API Integration" className="imageForCourse" />
                            </div>
                        </h1>
                    </div>

                    <div className="descriptionOfCourse">
                        Key full-stack integration concepts include:
                        <ul>
                            <li><b>API Consumption:</b> fetch data with <code>fetch</code> or Axios, handle async responses, and manage loading/error states.</li>
                            <li><b>Authentication:</b> secure endpoints using JWT, store tokens safely (e.g., HttpOnly cookies or local storage), and implement login/logout flows.</li>
                            <li><b>Authorization:</b> role-based access control (ADMIN, USER, ORG) to protect frontend routes and backend resources.</li>
                            <li><b>State Management:</b> propagate API data to React state, using Context API, Redux, or other state libraries.</li>
                            <li><b>Error Handling:</b> capture API errors, show user-friendly messages, and retry failed requests where appropriate.</li>
                            <li><b>Security:</b> enable CORS properly, sanitize inputs, and avoid exposing sensitive endpoints directly.</li>
                            <li><b>End-to-End Testing:</b> validate that frontend actions trigger expected backend behavior and responses.</li>
                        </ul>
                    </div>
                </div>

                <div className="aboutCourseDiv2" style={{ paddingBottom: '7em' }}>
                    <div className="introductionDiv">Summary</div>
                    <div className="frontImageBeginner">
                        <h1 className="headerDivText" style={{ fontSize: '1.7em' }}>
                            <div className="headerContainer" style={{ width: 'fit-content' }}>
                                Lesson Summary
                            </div>
                            <div className="imageContainer" style={{ marginTop: '15em' }}>
                            </div>
                        </h1>
                    </div>

                    <div className="descriptionOfCourse">
                        By the end of this lesson, you will be able to securely connect React with Spring Boot APIs, manage authentication and authorization,
                        handle asynchronous data, and ensure smooth and reliable full-stack application behavior.
                    </div>

                    <div className='key-areas3' style={{ marginTop: '-10em' }}>
                        <div className="imageContainerWebBeginner2">
                            <img src={spb} alt="Authentication & Authorization" className="imageForWebBeginner2" />
                            <div className="overlay">
                                <div className='keyAreasOfBeginnerWebDev3'>
                                    <strong>Authentication & Authorization:</strong>
                                    <div className='keyDescription2'>
                                        Implement login flows, JWT security, and role-based access across frontend and backend.
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="imageContainerWebBeginner2">
                            <img src={pic2} alt="Data Flow" className="imageForWebBeginner2" />
                            <div className="overlay">
                                <div className='keyAreasOfBeginnerWebDev3'>
                                    <strong>Data Flow:</strong>
                                    <div className='keyDescription2'>
                                        Fetch, manage, and synchronize API data efficiently in the React frontend.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className='feedbackContainer'>
                <h3>Was this lesson easy to understand?</h3>
                <div className='feedbackButtons'>
                    {!feedbackSubmitted ? (
                        <>
                            <button className='thumbsUp' onClick={handleUnderstand}>
                                👍 I Understand
                            </button>
                            <button className='thumbsDown' onClick={handleDidntUnderstand}>
                                👎 I Didn't Understand
                            </button>
                        </>
                    ) : (
                        <p>Thank you for your feedback!</p>
                    )}
                </div>
            </div>

            {feedbackSubmitted && (
                <div style={{ display: 'flex' }}>
                    <div className='moreCoursesDiv' onClick={handleNextLesson}>
                        Next Lesson
                    </div>
                    <div className='goToPreviousLessonDiv' onClick={handlePreviousLesson} style={{ marginLeft: '-77.5em' }}>
                        Previous Lesson
                    </div>
                </div>
            )}

            <Footer2 bgColor="rgb(247, 250, 251)" />
            <Footer bgColor="rgb(247, 250, 251)" />
        </div>
    );
}