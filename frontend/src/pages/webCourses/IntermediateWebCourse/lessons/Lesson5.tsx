import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Header } from '../../../Header';
import { Footer } from '../../../Footer';
import { Footer2 } from '../../../Footer2';
import '../../../../styles/webCourses/BeginnerWebCourse/Lesson1.css';
import backend from '../images/bknd.png'
import react2 from '../../../../pages/webCourses/BeginnerWebCourse/images/react2.png';
import lesson16 from '../images/lesson16.png';
import hellobackend from '../images/hellobknd.png';
import nodejs from '../images/nodejs.png';
import projectStructureExample from '../../../../pages/webCourses/BeginnerWebCourse/images/projectStructureExample.png';
import nodeModulesExample from '../../../../pages/webCourses/BeginnerWebCourse/images/node_modules.png';
import { useAuth0 } from '@auth0/auth0-react';

export function Lesson5() {
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

    if (loading) return <p>Loading...</p>;

    return (
        <div className='mainContainer'>
            <Header bgColor="rgb(247, 250, 251)" />
            <div className='lessonIntroduction'>
                <h1>BACKEND INTRODUCTION</h1>
                <p>Welcome to <b>Lesson 5</b> of the <b>Intermediate Web Development course</b>.</p>
            </div>
            <div className='aboutBeginnerWeb'>
                <div className="aboutCourseDiv2" style={{ paddingBottom: '7em' }}>
                    <div className="introductionDiv">WHY LEARN BACKEND?</div>

                    <div className="frontImageBeginner">
                        <h1 className="headerDivText" style={{ fontSize: '1.7em' }}>
                            <div className="headerContainer" style={{ width: 'fit-content' }}>
                                INTRODUCTION TO BACKEND DEVELOPMENT
                            </div>
                            <div className="imageContainer">
                                <img src={backend} alt="Backend" className="imageForCourse" />
                            </div>
                        </h1>
                    </div>
                    <div className="descriptionOfCourse">
                        In this lesson, we will introduce you to the world of backend development. Unlike frontend, which focuses on what users see and interact with, backend development handles the server, database, and application logic behind the scenes.
                        <br /><br />
                        You will learn why backend is critical in full stack applications, including managing data, handling user authentication, and integrating APIs. Understanding backend basics will empower you to build more dynamic, secure, and scalable web applications.
                    </div>
                </div>

                <div className="aboutCourseDiv2" style={{ paddingBottom: '2em' }}>
                    <div className="introductionDiv">KEY BACKEND TECHNOLOGIES</div>
                    <div className="frontImageBeginner">
                        <h1 className="headerDivText" style={{ fontSize: '1.7em' }}>
                            <div className="headerContainer" style={{ width: 'fit-content' }}>
                                Popular Backend Tools & Frameworks
                            </div>
                            <div className="imageContainer">
                                <img src={nodejs} alt="" className="imageForCourse" onClick={() => window.open('https://nodejs.org/en', '_blank')} style={{ cursor: 'pointer' }} />
                            </div>
                        </h1>
                    </div>

                    <div className="descriptionOfCourse">
                        Here are some common backend technologies you will encounter:
                        <ul>
                            <li><b>Node.js:</b> JavaScript runtime for building scalable backend applications.</li>
                            <li><b>Express.js:</b> Minimalist framework for Node.js to create APIs and handle server logic.</li>
                            <li><b>Databases:</b> Such as MongoDB (NoSQL) and PostgreSQL (SQL) to store application data.</li>
                            <li><b>REST APIs:</b> Design principles to create endpoints for frontend-backend communication.</li>
                            <li><b>Authentication:</b> Techniques to secure user access via tokens, sessions, and OAuth.</li>
                        </ul>
                        This knowledge will form the backbone of your final project backend.
                    </div>
                </div>

                <div className="aboutCourseDiv2" style={{ marginBottom: '-8em', marginTop: '6em' }}>
                    <div className="introductionDiv" style={{ marginLeft: '0.2em' }}>SETTING UP YOUR BACKEND ENVIRONMENT</div>
                    <div className="frontImageBeginner">
                        <h1 className="headerDivText" style={{ fontSize: '1.7em' }}>
                            <div className="headerContainer" style={{ width: 'fit-content', marginLeft: '0.1em' }}>
                                Workspace & Tooling
                            </div>
                        </h1>
                    </div>
                </div>
                <div className='key-areas2'>
                    <div className="imageContainerWebBeginner">
                        <img src={react2} alt="" className="imageForWebBeginner" />
                        <div className="overlay">
                            <div className='keyAreasOfBeginnerWebDev2' style={{ marginTop: '-4em' }}><strong>Creating React project</strong>
                                <div className="keyDescription">
                                    Before writing backend code, you need to set up your environment:
                                    <ul>
                                        <li>Install <b>Node.js</b> and <b>npm</b> to manage backend packages.</li>
                                        <li>Use <b>Visual Studio Code</b> for backend development.</li>
                                        <li>Initialize your backend project using <b>npm init</b> to create <code>package.json</code>.</li>
                                        <li>Install Express and other dependencies with <code>npm install express</code>.</li>
                                        <li>Set up a simple Express server to handle HTTP requests.</li>
                                    </ul>
                                    This setup will allow you to build a robust backend server to connect with your frontend application.
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="imageContainerWebBeginner">
                        <img src={projectStructureExample} alt="" className="imageForWebBeginner" />
                        <div className="overlay">
                            <div className='keyAreasOfBeginnerWebDev'>
                                <strong>Create your project structure</strong>
                                <div className='keyDescription'>
                                    When you installed React, it created a basic project structure for you. You will see folders like <b>public</b> and <b>src</b>. The <b>public</b> folder contains static files like index.html, while the <b>src</b> folder contains your React components and styles.
                                    <br></br>
                                    You can create additional folders inside src to organize your components, styles, and assets. For example, you can create a folder named <b>components</b> to store all your React components like header and footer.
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="imageContainerWebBeginner">
                        <img src={nodeModulesExample} alt="" className="imageForWebBeginner" />
                        <div className="overlay">
                            <div className='keyAreasOfBeginnerWebDev' style={{ marginTop: '-12em' }}>
                                <strong>Install all aditional dependencies</strong>
                                <div className='keyDescription' style={{ marginBottom: '-10em' }}>
                                    <br></br>
                                    When you have setup your project and created your folder structure, you can start building your application. You will need to install additional dependencies like <b>React Router</b> for routing and <b>Axios</b> for making API calls.
                                    You can install these dependencies using the following commands:
                                    <br></br>
                                    <br></br>
                                    <b>npm install react-router-dom axios</b>
                                    <br></br>
                                    <b>npm install @types/react-router-dom @types/axios</b>
                                    <br></br>
                                    <b>npm install --save-dev typescript</b>
                                    <br></br>
                                    <b>npm install --save-dev @types/react @types/react-dom</b><br></br>
                                    All other dependencies will be installed automatically when you run the command <b>npm start</b>. If you need to install any other dependencies, you can do so by running the command <b>npm install package-name</b>.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="aboutCourseDiv2" style={{ paddingBottom: '2em' }}>
                    <div className="introductionDiv">BASIC EXPRESS SERVER</div>
                    <div className="frontImageBeginner">
                        <h1 className="headerDivText" style={{ fontSize: '1.7em' }}>
                            <div className="headerContainer" style={{ width: 'fit-content' }}>
                                Your First Backend Server
                            </div>
                            <div className="imageContainer">
                                <img src={hellobackend} alt="" className="imageForCourse"></img>
                            </div>
                        </h1>
                    </div>

                    <div className="descriptionOfCourse" style={{ marginBottom: '3em' }}>
                        Here's a simple Express server example to get you started:
                        <pre style={{ backgroundColor: '#f5f5f5', padding: '1em', borderRadius: '5px' }}>
                            {`const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send('Hello from backend!');
});

app.listen(port, () => {
    console.log(\`Server running
     at http://localhost:\${port}\`);
});`}
                        </pre>
                        Running this server will respond to HTTP requests, laying the foundation for your backend API.
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
                        In this lesson, you were introduced to backend development concepts, essential tools, and how backend integrates with frontend to create full stack applications. You learned about Node.js, Express.js, databases, and setting up a basic Express server.
                        <br /><br />
                        Mastering these fundamentals will allow you to build scalable and secure backend systems, essential for your final project and beyond.
                    </div>

                    <div className='key-areas3' style={{ marginTop: '-10em' }}>
                        <div className="imageContainerWebBeginner2">
                            <img src={backend} alt="" className="imageForWebBeginner2" />
                            <div className="overlay">
                                <div className='keyAreasOfBeginnerWebDev3'>
                                    <strong>BACKEND</strong>
                                    <div className='keyDescription2'>
                                        Backend is critical in full stack applications, including managing data, handling user authentication, and integrating APIs.
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="imageContainerWebBeginner2">
                            <img src={lesson16} alt="" className="imageForWebBeginner2" />
                            <div className="overlay">
                                <div className='keyAreasOfBeginnerWebDev3'><strong>WORKSPACE & TOOLING</strong>
                                    <div className='keyDescription2' style={{ fontSize: '0.9em' }}>
                                        Setting up your backend environment is crucial. Install Node.js, npm, and Visual Studio Code to manage packages and write code efficiently.
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