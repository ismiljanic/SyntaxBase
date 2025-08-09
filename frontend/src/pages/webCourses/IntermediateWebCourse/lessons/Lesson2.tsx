import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Header } from '../../../Header';
import { Footer } from '../../../Footer';
import { Footer2 } from '../../../Footer2';
import '../../../../styles/webCourses/BeginnerWebCourse/Lesson1.css';
import react from '../../../../pages/webCourses/BeginnerWebCourse/images/react.png';
import details from '../../../../pages/webCourses/BeginnerWebCourse/images/details.png';
import html1 from '../../../../pages/webCourses/BeginnerWebCourse/images/html1.png';
import css1 from '../../../../pages/webCourses/BeginnerWebCourse/images/css1.png';
import typescript1 from '../../../../pages/webCourses/BeginnerWebCourse/images/typescript1.png';
import finalp1 from '../../../../pages/webCourses/BeginnerWebCourse/images/finalp1.png';
import firstExample from '../../../../pages/webCourses/BeginnerWebCourse/images/firstExample.png';
import secondExample from '../../../../pages/webCourses/BeginnerWebCourse/images/secondExample.png';
import thirdExample from '../../../../pages/webCourses/BeginnerWebCourse/images/thirdExample.png';
import fourthExample from '../../../../pages/webCourses/BeginnerWebCourse/images/fourthExample.png';
import { useAuth0 } from '@auth0/auth0-react';


export function Lesson2() {
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

    if (loading) return <p>Loading...</p>;

    return (
        <div className='mainContainer'>
            <Header bgColor="rgb(247, 250, 251)" />
            <div className='lessonIntroduction'>
                <h1>Introduction to React Basics and Routing</h1>
                <p>Welcome to <b>Lesson 2</b> of the <b>Intermediate Web Development course</b>.</p>
            </div>
            <div className='aboutBeginnerWeb'>
                <div className="aboutCourseDiv2" style={{ paddingBottom: '7em' }}>
                    <div className="introductionDiv">Introduction</div>
                    <div className="frontImageBeginner">
                        <h1 className="headerDivText" style={{ fontSize: '1.7em' }}>
                            <div className="headerContainer" style={{ width: 'fit-content' }}>
                                Getting Started with React
                            </div>
                            <div className="imageContainer">
                                <img src={react} alt="" className="imageForCourse" />
                            </div>
                        </h1>
                    </div>

                    <div className="descriptionOfCourse">
                        In this lesson, we'll dive into the fundamentals of React.
                        You will learn how to create components, manage JSX syntax, and understand React's component lifecycle.
                        Additionally, we'll cover routing with React Router to enable navigation between pages.
                    </div>
                </div>
                <div className="aboutCourseDiv2" style={{ paddingBottom: '2em' }}>
                    <div className="introductionDiv">Semantic HTML</div>
                    <div className="frontImageBeginner">
                        <h1 className="headerDivText" style={{ fontSize: '1.7em' }}>
                            <div className="headerContainer" style={{ width: 'fit-content' }}>
                                Why Semantics Matter
                            </div>
                            <div className="imageContainer">
                                <img src={details} alt="" className="imageForCourse" />
                            </div>
                        </h1>
                    </div>

                    <div className="descriptionOfCourse">
                        React components allow you to build reusable UI elements.
                        JSX is a syntax extension that looks like HTML but compiles to JavaScript.
                        Understanding how to structure components and pass props is crucial for scalable React applications.
                    </div>
                    <p className='paragraphP' style={{ paddingTop: '9em' }}>
                        For example:
                        <code>
                            &lt;<span style={{ color: 'rgb(97, 218, 251)' }}>MyComponent</span> /&gt;
                        </code>
                        is a React component instance.
                        <br />
                        Components can be functional or class-based.
                        <div className='htmlElementsDiv'>
                            <ul>
                                <li><code>Functional Components</code> - simple, stateless components</li>
                                <li><code>Class Components</code> - components with state and lifecycle methods</li>
                                <li><code>JSX Syntax</code> - JavaScript XML for templating UI</li>
                            </ul>
                        </div>
                    </p>
                </div>

                <h3 className='subsection-title'>Routing with React Router</h3>
                <p className='paragraph'>
                    React Router enables dynamic navigation in your app without page reloads.
                    Learn to configure routes, link components, and use route parameters to build multi-page experiences.
                </p>
                <div className='beginnerPictureContainer' style={{ marginBottom: '3em' }}>
                    <div
                        className="imageWithDescription"
                        onClick={() => window.open(`/showCase/1/lesson/2/course/${courseId}`, '_blank')}
                        style={{ cursor: 'pointer' }}
                    >
                        <img
                            src={firstExample}
                            alt=""
                            className="courseImage"
                            style={{ width: '50em', height: '30em' }}
                        />
                        <div className='imageDescription'>Try it yourself</div>
                    </div>

                    <div
                        className="imageWithDescription"
                        onClick={() => window.open(`/showCase/2/lesson/2/course/${courseId}`, '_blank')}
                        style={{ cursor: 'pointer' }}
                    >
                        <img src={secondExample} alt="" className="courseImage" style={{ width: '50em', height: '30em' }} />
                        <div className="imageDescription">Try it yourself</div>
                    </div>

                    <div
                        className="imageWithDescription"
                        onClick={() => window.open(`/showCase/3/lesson/2/course/${courseId}`, '_blank')}
                        style={{ cursor: 'pointer' }}
                    >
                        <img src={thirdExample} alt="" className="courseImage" style={{ width: '50em', height: '30em' }} />
                        <div className="imageDescription">Try it yourself</div>
                    </div>

                    <div
                        className="imageWithDescription"
                        onClick={() => window.open(`/showCase/4/lesson/2/course/${courseId}`, '_blank')}
                        style={{ cursor: 'pointer' }}
                    >
                        <img src={fourthExample} alt="" className="courseImage" style={{ width: '50em', height: '30em' }} />
                        <div className="imageDescription">Try it yourself</div>
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
                        This lesson covered the basics of React components, JSX, and routing.
                        You now know how to build reusable UI elements and navigate your application efficiently.
                        In the next lesson, we will explore state management using React hooks.
                    </div>

                    <div className='key-areas3' style={{ marginTop: '-10em' }}>
                        <div className="imageContainerWebBeginner2">
                            <img src={react} alt="React Logo" className="imageForWebBeginner2" />
                            <div className="overlay">
                                <div className='keyAreasOfBeginnerWebDev3'>
                                    <strong>React Components:</strong>
                                    <div className='keyDescription2'>
                                        Reusable building blocks of your UI that encapsulate logic and presentation.
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="imageContainerWebBeginner2">
                            <img src={react} alt="React Logo" className="imageForWebBeginner2" />
                            <div className="overlay">
                                <div className='keyAreasOfBeginnerWebDev3'>
                                    <strong>Routing:</strong>
                                    <div className='keyDescription2'>
                                        <ul>
                                            <li>Configure multiple routes and nested paths</li>
                                            <li>Use <code>&lt;Link&gt;</code> to navigate without reload</li>
                                            <li>Access route parameters for dynamic content</li>
                                        </ul>
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
                <>
                    <div style={{ display: 'flex' }}>
                        <div className='moreCoursesDiv' onClick={handleNextLesson}>
                            Next Lesson
                        </div>
                        <div className='goToPreviousLessonDiv' onClick={handlePreviousLesson} style={{ marginLeft: '-77.5em' }}>
                            Previous Lesson
                        </div>
                    </div>
                </>
            )}
            <Footer2 bgColor="rgb(247, 250, 251)" />
            <Footer bgColor="rgb(247, 250, 251)" />
        </div>
    );
}