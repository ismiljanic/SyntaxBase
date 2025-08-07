import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Header } from '../../../Header';
import { Footer } from '../../../Footer';
import { Footer2 } from '../../../Footer2';
import '../../../../styles/webCourses/BeginnerWebCourse/Lesson1.css';
import lesson11 from '../images/lesson11.png';
import lesson12 from '../images/lesson12.png';
import lesson13 from '../images/lesson13.png';
import lesson14 from '../images/lesson14.png';
import lesson15 from '../images/lesson15.png';
import lesson16 from '../images/lesson16.png';
import commandLine from '../images/commandLine.png';
import contL from '../../../../pages/webCourses/BeginnerWebCourse/images/contL.png';
import courseOverview from '../../../../pages/webCourses/BeginnerWebCourse/images/courseOverview.png';
import { useAuth0 } from '@auth0/auth0-react';

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


    if (loading) return <p>Loading...</p>;

    return (
        <div className='mainContainer'>
            <Header bgColor="rgb(247, 250, 251)" />
            <div className='lessonIntroduction'>
                <h1>Lesson 1: Development Environment Setup</h1>
                <p>Welcome to the <b>Intermediate Web Development Course</b>. In this first lesson, we’ll set up the tools and environment that will power your entire development workflow.</p>
            </div>
            <div className='aboutBeginnerWeb'>
                <div className="aboutCourseDiv2" style={{ paddingBottom: '7em' }}>
                    <div className="introductionDiv">Your Developer Toolkit</div>
                    <div className="frontImageBeginner">
                        <h1 className="headerDivText" style={{ fontSize: '1.7em' }}>
                            <div className="headerContainer" style={{ width: 'fit-content' }}>
                                Setting Up for Success
                            </div>
                            <div className="imageContainer">
                                <img src={lesson11} alt="" className="imageForCourse" />
                            </div>
                        </h1>
                    </div>
                    <div className="descriptionOfCourse">
                        As you move beyond beginner-level coding, having the right tools is critical.
                        In this lesson, you'll install and configure the software needed to build modern, professional web applications using <b>TypeScript</b> and <b>React</b>.
                    </div>
                </div>
                <div className="aboutCourseDiv2" style={{ marginBottom: '-8em' }}>
                    <div className="introductionDiv" style={{ marginLeft: '0.2em' }}>KEY AREAS</div>
                    <div className="frontImageBeginner">
                        <h1 className="headerDivText" style={{ fontSize: '1.7em' }}>
                            <div className="headerContainer" style={{ width: 'fit-content', marginLeft: '0.1em' }}>
                                Core Tools & Installation
                            </div>
                        </h1>
                    </div>
                </div>
                <div className='key-areas2'>
                    <div className="imageContainerWebBeginner">
                        <img src={lesson14} alt="" className="imageForWebBeginner" />
                        <div className="overlay">
                            <div className='keyAreasOfBeginnerWebDev'>
                                <strong>Visual Studio Code (VSCode)</strong>
                                <div className='keyDescription'>
                                    A lightweight yet powerful code editor. Install extensions like React/TS plugin to start with your workflow.
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="imageContainerWebBeginner">
                        <img src={lesson13} alt="" className="imageForWebBeginner" />
                        <div className="overlay">
                            <div className='keyAreasOfBeginnerWebDev2'><strong>Node.js & npm</strong>
                                <div className='keyDescription'> Install the latest LTS version of Node.js. This gives you access to `npm`, which allows you to manage packages and run scripts for building and testing your app.
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="imageContainerWebBeginner">
                        <img src={lesson12} alt="" className="imageForWebBeginner" />
                        <div className="overlay">
                            <div className='keyAreasOfBeginnerWebDev'>
                                <strong>Git & GitHub</strong>
                                <div className='keyDescription'>
                                    Learn to clone, commit, push, and branch effectively. Use GitHub for remote repo hosting and collaboration—even if it’s just you for now.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <h3 className='subsection-title'>Modern Project Structure</h3>
                <p className='paragraph'>
                    We’ll use a modern <b>React + TypeScript</b> template with a structured folder layout. This mirrors what you’d see in professional codebases and prepares you for scalable application development.
                </p>
                <div className='beginnerPictureContainer'>
                    <div className="imageWithDescription">
                        <img src={lesson15} alt="" className="courseImage" style={{ width: '50em', height: '30em' }} />
                        <div className="imageDescription">Clean Folder Architecture</div>
                    </div>
                    <div className="imageWithDescription">
                        <img src={commandLine} alt="" className="courseImage" style={{ width: '50em', height: '30em' }} />
                        <div className="imageDescription">Command-Line Tools & Scripts</div>
                    </div>
                    <div className="imageWithDescription">
                        <img src={lesson16} alt="" className="courseImage" style={{ width: '50em', height: '30em' }} />
                        <div className="imageDescription">Developer Workflows</div>
                    </div>
                    <div className="imageWithDescription">
                        <img src={contL} alt="" className="courseImage" style={{ width: '50em', height: '30em' }} />
                        <div className="imageDescription">Continuous Learning</div>
                    </div>
                </div>
                <div className="aboutCourseDiv2" style={{ paddingBottom: '7em' }}>
                    <div className="introductionDiv">Developer Workflows</div>
                    <div className="frontImageBeginner">
                        <h1 className="headerDivText" style={{ fontSize: '1.7em' }}>
                            <div className="headerContainer" style={{ width: 'fit-content' }}>
                                Beyond the Basics
                            </div>
                            <div className="imageContainer">
                                <img src={courseOverview} alt="" className="imageForCourse" />
                            </div>
                        </h1>
                    </div>

                    <div className="descriptionOfCourse">
                        Learn the foundations of efficient, real-world workflows:
                        <ul>
                            <li>Terminal commands & shortcuts</li>
                            <li>Running local development servers</li>
                            <li>Running TypeScript compilers and tests</li>
                        </ul>
                        These habits and tools will follow you throughout the course and into professional settings.
                    </div>

                </div>
            </div>
            <div className='feedbackContainer'>
                <h3>Was this setup process smooth?</h3>
                <div className='feedbackButtons'>
                    {!feedbackSubmitted ? (
                        <>
                            <button className='thumbsUp' onClick={handleUnderstand}>
                                👍 Yes, All Set Up!
                            </button>
                            <button className='thumbsDown' onClick={handleDidntUnderstand}>
                                👎 I Had Issues
                            </button>
                        </>
                    ) : (
                        <p>Thank you for your feedback!</p>
                    )}
                </div>
            </div>
            {feedbackSubmitted && (
                <div className='moreCoursesDiv' onClick={handleNextLesson}>
                    Next Lesson
                </div>
            )}
            <Footer2 bgColor="rgb(247, 250, 251)" />
            <Footer bgColor="rgb(247, 250, 251)" />
        </div>
    );
}
