import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Header } from '../../../Header';
import { Footer } from '../../../Footer';
import { Footer2 } from '../../../Footer2';
import '../../../../styles/webCourses/BeginnerWebCourse/Lesson1.css';
import lesson11 from '../images/lesson11.png';
import lesson12 from '../images/lesson12.png';
import spb from '../images/spb.png';
import lesson14 from '../images/lesson14.png';
import lesson15 from '../images/lesson15.png';
import wf from '../images/wf.png';
import wf2 from '../images/wf2.png';
import pic1 from '../images/pic1.png';
import commandLine from '../images/commandLine.png';
import { useAuth0 } from '@auth0/auth0-react';
import LoadingScreen from '../../../../components/LoadingScreen';

export function Lesson1() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(true);
    const [feedbackSubmitted, setFeedbackSubmitted] = useState<boolean>(false);
    const { user, getAccessTokenSilently } = useAuth0();
    const { courseId } = useParams();
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


    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <div className='mainContainer'>
            <Header bgColor="rgb(247, 250, 251)" />
            <div className='lessonIntroduction'>
                <h1>Lesson 1: Advanced Development Environment & Tooling</h1>
                <p>Welcome to the <b>Advanced Web Development Course</b>. In this lesson, we’ll configure a professional development environment optimized for building full-stack applications with <b>React, TypeScript, Spring Boot, and PostgreSQL</b>.</p>
            </div>
            <div className='aboutBeginnerWeb'>
                <div className="aboutCourseDiv2" style={{ paddingBottom: '7em' }}>
                    <div className="introductionDiv">Your Developer Toolkit</div>
                    <div className="frontImageBeginner">
                        <h1 className="headerDivText" style={{ fontSize: '1.7em' }}>
                            <div className="headerContainer" style={{ width: 'fit-content' }}>
                                Setting Up for Advanced Development
                            </div>
                            <div className="imageContainer">
                                <img src={lesson11} alt="" className="imageForCourse" />
                            </div>
                        </h1>
                    </div>
                    <div className="descriptionOfCourse">
                        A robust toolset is critical for building scalable, production-ready applications. In this lesson, we’ll set up:
                        <b> VSCode</b> with professional extensions, <b>Java & Spring Boot</b>, <b>Git & GitHub workflows</b>, and a <b>TypeScript + React project template</b>.
                    </div>
                </div>
                <div className="aboutCourseDiv2" style={{ marginBottom: '-8em' }}>
                    <div className="introductionDiv" style={{ marginLeft: '0.2em' }}>KEY AREAS</div>
                    <div className="frontImageBeginner">
                        <h1 className="headerDivText" style={{ fontSize: '1.7em' }}>
                            <div className="headerContainer" style={{ width: 'fit-content', marginLeft: '0.1em' }}>
                                Essential Tools & Setup
                            </div>
                        </h1>
                    </div>
                </div>
                <div className='key-areas2'>
                    <div className="imageContainerWebBeginner">
                        <img src={lesson14} alt="" className="imageForWebBeginner" />
                        <div className="overlay">
                            <div className='keyAreasOfBeginnerWebDev'>
                                <strong>VSCode + Extensions</strong>
                                <div className='keyDescription'>
                                    Configure advanced extensions for React, TypeScript, Prettier, ESLint, and Git integration to streamline coding and maintain consistency.
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="imageContainerWebBeginner">
                        <img src={spb} alt="" className="imageForWebBeginner" />
                        <div className="overlay">
                            <div className='keyAreasOfBeginnerWebDev2'>
                                <strong>Spring Boot & Java</strong>
                                <div className='keyDescript ion'>
                                   Install and configure Spring Boot with Java, setting up a powerful backend framework for building RESTful APIs and microservices.
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="imageContainerWebBeginner">
                        <img src={lesson12} alt="" className="imageForWebBeginner" />
                        <div className="overlay">
                            <div className='keyAreasOfBeginnerWebDev'>
                                <strong>Git & GitHub Advanced Workflows</strong>
                                <div className='keyDescription'>
                                    Master branching, rebasing, pull requests, and merge strategies to collaborate on larger projects and maintain a clean commit history.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <h3 className='subsection-title'>Modern Project Structure</h3>
                <p className='paragraph'>
                    We’ll use a professional <b>React + TypeScript + Spring Boot</b> template with a clear folder structure, preparing you to implement a production-style full-stack application with proper separation of concerns.
                </p>

                <div className='beginnerPictureContainer' style={{ marginBottom: '3em' }}>
                    <div className="imageWithDescription">
                        <img src={lesson15} alt="" className="courseImage" style={{ width: '50em', height: '30em' }} />
                        <div className="imageDescription">Clean Modular Architecture</div>
                    </div>
                    <div className="imageWithDescription">
                        <img src={commandLine} alt="" className="courseImage" style={{ width: '50em', height: '30em' }} />
                        <div className="imageDescription">Advanced Command-Line Workflows</div>
                    </div>
                    <div className="imageWithDescription">
                        <img src={wf} alt="" className="courseImage" style={{ width: '50em', height: '30em' }} />
                        <div className="imageDescription">Professional Workflows</div>
                    </div>
                    <div className="imageWithDescription">
                        <img src={pic1} alt="" className="courseImage" style={{ width: '50em', height: '30em' }} />
                        <div className="imageDescription">Continuous Learning & Debugging</div>
                    </div>
                </div>

                <div className="aboutCourseDiv2" style={{ paddingBottom: '7em' }}>
                    <div className="introductionDiv">Developer Workflows</div>
                    <div className="frontImageBeginner">
                        <h1 className="headerDivText" style={{ fontSize: '1.7em' }}>
                            <div className="headerContainer" style={{ width: 'fit-content' }}>
                                Efficient Full-Stack Workflows
                            </div>
                            <div className="imageContainer">
                                <img src={wf2} alt="" className="imageForCourse" />
                            </div>
                        </h1>
                    </div>
                    <div className="descriptionOfCourse">
                        Learn the foundations of professional workflows that will carry you through the final project:
                        <ul>
                            <li>Managing multiple environments with npm scripts</li>
                            <li>TypeScript compilation and linting automation</li>
                            <li>Running backend Spring Boot servers and connecting to PostgreSQL</li>
                            <li>Testing and debugging full-stack applications</li>
                        </ul>
                        By mastering these practices, you’ll move smoothly into building the final Full-Stack Blood Donation Management App.
                    </div>
                </div>

                {/* Lessons 2–7 text outline (brief intros) */}
                <div className='lessonIntroduction'>
                    <h1>Lesson 2: Advanced React Patterns</h1>
                    <p>Learn hooks, context, and advanced component patterns to manage state and lifecycle in large-scale applications.</p>
                </div>

                <div className='lessonIntroduction'>
                    <h1>Lesson 3: TypeScript Deep Dive</h1>
                    <p>Master type safety, interfaces, generics, and utility types to make your code more reliable and maintainable in complex applications.</p>
                </div>

                <div className='lessonIntroduction'>
                    <h1>Lesson 4: RESTful API Design with Spring Boot</h1>
                    <p>Design and implement robust, scalable APIs for your front-end to consume, including authentication, validation, and error handling.</p>
                </div>

                <div className='lessonIntroduction'>
                    <h1>Lesson 5: PostgreSQL & Database Modeling</h1>
                    <p>Learn how to model relational databases, write optimized queries, and integrate your backend with PostgreSQL for full-stack persistence.</p>
                </div>

                <div className='lessonIntroduction'>
                    <h1>Lesson 6: Full-Stack Integration</h1>
                    <p>Connect React front-end with Spring Boot APIs, handle authentication and authorization, and ensure secure and smooth data flow.</p>
                </div>

                <div className='lessonIntroduction'>
                    <h1>Lesson 7: Preparing for the Final Project</h1>
                    <p>Consolidate all your knowledge, review best practices, and prepare scaffolding for the Full-Stack Blood Donation Management System.</p>
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
                    </div>
                </>
            )}
            <Footer2 bgColor="rgb(247, 250, 251)" />
            <Footer bgColor="rgb(247, 250, 251)" />
        </div>
    );
}
