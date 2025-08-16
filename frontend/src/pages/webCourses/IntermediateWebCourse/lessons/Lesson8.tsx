import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Header } from '../../../Header';
import { Footer } from '../../../Footer';
import { Footer2 } from '../../../Footer2';
import '../../../../styles/webCourses/BeginnerWebCourse/Lesson1.css';
import bkndDB from '../images/bkndDB.png';
import folders from '../images/folders.png';
import auth from '../images/authflow.png';
import { useAuth0 } from '@auth0/auth0-react';
import LoadingScreen from '../../../../components/LoadingScreen';

export function Lesson8() {
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

    if (loading) {
        return <LoadingScreen />;
    }
    
    return (
        <div className='mainContainer'>
            <Header bgColor="rgb(247, 250, 251)" />
            <div className='lessonIntroduction'>
                <h1>FULL-STACK TICKETING APP - PROJECT KICKOFF</h1>
                <p>Welcome to <b>Lesson 8</b> of the <b>Intermediate Web Development course</b>.</p>
            </div>
            <div className='aboutBeginnerWeb'>

                <div className="aboutCourseDiv2" style={{ paddingBottom: '0em' }}>
                    <div className="introductionDiv">CHAPTER 1</div>
                    <div className="frontImageBeginner">
                        <h1 className="headerDivText" style={{ fontSize: '1.7em' }}>
                            <div className="headerContainer" style={{ width: 'fit-content' }}>
                                PROJECT STRUCTURE & INITIAL SETUP
                            </div>
                            <div className="imageContainer">
                                <img src={folders} alt="" className="imageForCourse" />
                            </div>
                        </h1>
                    </div>

                    <div className="descriptionOfCourse">
                        In this chapter, we kick off the <b>Full-Stack Ticketing App</b> build. This project will bring together all the intermediate concepts you’ve learned so far:
                        <ul>
                            <li>React for building a responsive frontend UI.</li>
                            <li>Node.js & Express for backend API development.</li>
                            <li>PostgreSQL for persistent data storage.</li>
                            <li>OAuth2 & OpenID Connect for secure authentication.</li>
                            <li>QR Code generation for ticket verification.</li>
                        </ul>
                        <br />
                        <b>Your Task:</b>
                        <ol>
                            <li>Create a main project folder and inside it, add <code>/client</code> for frontend and <code>/server</code> for backend.</li>
                            <li>Initialize React in <code>/client</code> using Create React App or Vite.</li>
                            <li>Initialize Node.js in <code>/server</code> and install Express.</li>
                            <li>Set up Git for version control.</li>
                            <li>Create a <code>.env</code> file in each project to store environment variables.</li>
                        </ol>
                        Once this is done, verify that both frontend and backend can run independently.
                    </div>
                </div>

                <div className="aboutCourseDiv2" style={{ paddingBottom: '2em' }}>
                    <div className="introductionDiv">CHAPTER 2</div>
                    <div className="frontImageBeginner">
                        <h1 className="headerDivText" style={{ fontSize: '1.7em' }}>
                            <div className="headerContainer" style={{ width: 'fit-content' }}>
                                BACKEND SETUP & DATABASE CONNECTION
                            </div>
                            <div className="imageContainer">
                                <img src={bkndDB} alt="" className="imageForCourse" />
                            </div>
                        </h1>
                    </div>

                    <div className="descriptionOfCourse">
                        Before we can store tickets, events, or user data, we need a reliable database connection. In this step, we’ll connect our backend to PostgreSQL and prepare the data models.
                        <br /><br />
                        <b>Your Task:</b>
                        <ol>
                            <li>Install <code>pg</code> and <code>sequelize</code> (or Prisma) in the backend.</li>
                            <li>Configure your database connection in a separate <code>config</code> file.</li>
                            <li>Create an initial <code>users</code> table that will store authentication IDs from OAuth.</li>
                            <li>Run your first migration to confirm the database is connected.</li>
                        </ol>
                    </div>
                </div>

                <div className="aboutCourseDiv2" style={{ paddingBottom: '2em' }}>
                    <div className="introductionDiv">CHAPTER 3</div>
                    <div className="frontImageBeginner">
                        <h1 className="headerDivText" style={{ fontSize: '1.7em' }}>
                            <div className="headerContainer" style={{ width: 'fit-content' }}>
                                AUTHENTICATION & AUTHORIZATION
                            </div>
                            <div className="imageContainer">
                                <img src={auth} alt="" className="imageForCourse" />
                            </div>
                        </h1>
                    </div>

                    <div className="descriptionOfCourse">
                        Our ticketing app needs secure logins to identify users and protect event data. In this chapter, you will integrate <b>OAuth2</b> with an external provider such as <b>Auth0</b> or <b>Google</b>.
                        <br /><br />
                        <b>Your Task:</b>
                        <ol>
                            <li>Register an application in your chosen OAuth provider.</li>
                            <li>Configure client ID, client secret, and callback URL in your backend.</li>
                            <li>Create login and logout endpoints.</li>
                            <li>Verify that after login, the user’s details are stored in your <code>users</code> table.</li>
                        </ol>
                    </div>
                </div>

                <div className="aboutCourseDiv2" style={{ paddingBottom: '0em' }}>
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
                        In this lesson, you created the foundational structure of your Full-Stack Ticketing App, connected your backend to a database, and integrated OAuth2 authentication.
                        You now have the core building blocks in place to start building ticket creation, QR code generation, and event management features in the next lessons.
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