import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Header } from '../../../Header';
import { Footer } from '../../../Footer';
import { Footer2 } from '../../../Footer2';
import '../../../../styles/webCourses/BeginnerWebCourse/Lesson1.css';
import react from '../../../../pages/webCourses/BeginnerWebCourse/images/react.png';
import typescript from '../../../../pages/webCourses/BeginnerWebCourse/images/typescript.png';
import typescript2 from '../../../../pages/webCourses/BeginnerWebCourse/images/typescript2.png';
import react2 from '../../../../pages/webCourses/BeginnerWebCourse/images/react2.png';
import react3 from '../../../../pages/webCourses/BeginnerWebCourse/images/react3.png';
import magic from '../../../../pages/webCourses/BeginnerWebCourse/images/magic.png';
import { useAuth0 } from '@auth0/auth0-react';
import LoadingScreen from '../../../../components/LoadingScreen';


export function Lesson4() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(true);
    const [feedbackSubmitted, setFeedbackSubmitted] = useState<boolean>(false);
    const location = useLocation();
    const { user, getAccessTokenSilently } = useAuth0();
    const auth0UserId = user?.sub;
    const [isEnrolled, setIsEnrolled] = useState<boolean | null>(null);
    const { lessonNumber } = useParams<{ lessonNumber: string }>();
    const lessonIdNumber = lessonNumber ? parseInt(lessonNumber, 10) : null;
    const [lessonId, setLessonId] = useState<number | null>(null);
    const { courseId } = useParams();

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

            const rawText = await response.text();

            if (!response.ok) {
                console.error('Failed to update progress');
            }
        } catch (error) {
            console.error('Error updating progress:', error);
        }
    };

    if (lessonIdNumber === null) {
        return <p>Lesson ID is missing or invalid.</p>;
    }
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
                <h1>Introduction to Advanced State Management and Data Fetching</h1>
                <p>Welcome to <b>Lesson 4</b> of the <b>Intermediate Web Development course</b>.</p>
            </div>
            <div className='aboutBeginnerWeb'>
                <div className="aboutCourseDiv2" style={{ paddingBottom: '7em' }}>
                    <div className="introductionDiv">INTRODUCTION</div>

                    <div className="frontImageBeginner">
                        <h1 className="headerDivText" style={{ fontSize: '1.7em' }}>
                            <div className="headerContainer" style={{ width: 'fit-content' }}>
                                Managing State Like a Pro
                            </div>
                            <div className="imageContainer">
                                <img src={react} alt="" className="imageForCourse" onClick={() => window.open('https://react.dev/', '_blank')} style={{ cursor: 'pointer' }} />
                            </div>
                        </h1>
                    </div>

                    <div className="descriptionOfCourse">
                        In this lesson, you’ll learn how to handle state beyond useState basics.
                        We’ll explore techniques for managing complex and shared state, introduce the Context API, and use useReducer for more predictable state transitions.
                        You’ll see how these tools can help keep your application scalable and maintainable.
                    </div>
                </div>

                <div className="aboutCourseDiv2" style={{ paddingBottom: '2em' }}>
                    <div className="introductionDiv">SECOND SECTION</div>
                    <div className="frontImageBeginner">
                        <h1 className="headerDivText" style={{ fontSize: '1.7em' }}>
                            <div className="headerContainer" style={{ width: 'fit-content' }}>
                                Data Fetching and Synchronization
                            </div>
                            <div className="imageContainer">
                                <img src={typescript} alt="" className="imageForCourse" onClick={() => window.open('https://www.typescriptlang.org/', '_blank')}
                                    style={{ cursor: 'pointer' }} />
                            </div>
                        </h1>
                    </div>

                    <div className="descriptionOfCourse">
                        We’ll dive into retrieving data from APIs, handling loading and error states, and updating the UI when backend data changes.
                        You’ll also learn how to optimize state updates to reduce unnecessary re-renders, making your apps faster and more responsive.
                    </div>
                </div>

                <div className="aboutCourseDiv2" style={{ marginBottom: '-8em', marginTop: '6em' }}>
                    <div className="introductionDiv" style={{ marginLeft: '0.2em' }}>Why Would You Use This?</div>
                    <div className="frontImageBeginner">
                        <h1 className="headerDivText" style={{ fontSize: '1.7em' }}>
                            <div className="headerContainer" style={{ width: 'fit-content', marginLeft: '0.1em' }}>
                                Example highlights
                            </div>
                        </h1>
                    </div>
                </div>
                <div className='key-areas2'>
                    <div className="imageContainerWebBeginner">
                        <img src={typescript2} alt="" className="imageForWebBeginner" />
                        <div className="overlay">
                            <div className='keyAreasOfBeginnerWebDev'>
                                <strong>Context API</strong>
                                <div className='keyDescription'>
                                    Share state across deeply nested components without prop drilling
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="imageContainerWebBeginner">
                        <img src={react2} alt="" className="imageForWebBeginner" />
                        <div className="overlay">
                            <div className='keyAreasOfBeginnerWebDev2'><strong>useReducer</strong>
                                <div className='keyDescription'>
                                    Manage complex state updates with a predictable pattern
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="imageContainerWebBeginner">
                        <img src={magic} alt="" className="imageForWebBeginner" />
                        <div className="overlay">
                            <div className='keyAreasOfBeginnerWebDev'>
                                <strong>Data fetching and Performance</strong>
                                <div className='keyDescription'>
                                    Using fetch or axios effectively. Memoizing expensive calculations and components
                                </div>
                            </div>
                        </div>
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
                        This lesson covered advanced state management techniques and real-world data fetching patterns. You can now synchronize your UI with backend data efficiently while keeping your components lean.
                        In the next lesson, we’ll focus on component composition and code organization for long-term scalability.
                    </div>

                    <div className='key-areas3' style={{ marginTop: '-10em' }}>
                        <div className="imageContainerWebBeginner2">
                            <img src={react3} alt="" className="imageForWebBeginner2" />
                            <div className="overlay">
                                <div className='keyAreasOfBeginnerWebDev3'>
                                    <strong>REACT</strong>
                                    <div className='keyDescription2'>
                                        React is a popular JavaScript library for building user interfaces. It allows developers to create reusable components, manage state efficiently, and handle dynamic user interactions. React focuses on building web applications with high performance and ease of development.
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="imageContainerWebBeginner2">
                            <img src={typescript} alt="" className="imageForWebBeginner2" />
                            <div className="overlay">
                                <div className='keyAreasOfBeginnerWebDev3'><strong>TYPESCRIPT</strong>
                                    <div className='keyDescription2' style={{ fontSize: '0.9em' }}>
                                        TypeScript is a superset of JavaScript that adds static typing to your code.
                                        This means that you can declare the types of variables, function parameters, and return values in your code, making it easier to catch errors early and improve code quality.
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
            {
                feedbackSubmitted && (
                    <>
                        <div style={{ display: 'flex' }}>
                            <div className='moreCoursesDiv' onClick={handleNextLesson}>
                                Next Lesson
                            </div>
                            <div className='goToPreviousLessonDiv' onClick={handlePreviousLesson} style={{ marginLeft: '-78.3em' }}>
                                Previous Lesson
                            </div>
                        </div>
                    </>
                )
            }
            <Footer2 bgColor="rgb(247, 250, 251)" />
            <Footer bgColor="rgb(247, 250, 251)" />
        </div >
    );
}