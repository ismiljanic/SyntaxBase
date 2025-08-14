import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Header } from '../../../Header';
import { Footer } from '../../../Footer';
import { Footer2 } from '../../../Footer2';
import '../../../../styles/webCourses/BeginnerWebCourse/Lesson1.css';
import auth0 from '../images/intermediate6.png';
import lesson16 from '../images/lesson16.png';
import contL from '../images/contL.png';
import sdks from '../images/sdks.png';
import authflow from '../images/authflow.png';
import tenant from '../images/tenant.png';
import { useAuth0 } from '@auth0/auth0-react';
import LoadingScreen from '../../../../components/LoadingScreen';

export function Lesson6() {
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
                <h1>AUTH0 INTRODUCTION</h1>
                <p>Welcome to <b>Lesson 6</b> of the <b>Intermediate Web Development course</b>.</p>
            </div>
            <div className='aboutBeginnerWeb'>
                <div className="aboutCourseDiv2" style={{ paddingBottom: '7em' }}>
                    <div className="introductionDiv">WHY USE AUTH0?</div>

                    <div className="frontImageBeginner">
                        <h1 className="headerDivText" style={{ fontSize: '1.7em' }}>
                            <div className="headerContainer" style={{ width: 'fit-content' }}>
                                INTRODUCTION TO AUTH0 AUTHENTICATION
                            </div>
                            <div className="imageContainer">
                                <img src={auth0} alt="Auth0" className="imageForCourse" />
                            </div>
                        </h1>
                    </div>
                    <div className="descriptionOfCourse">
                        In this lesson, we will introduce you to <b>Auth0</b>, a leading authentication and authorization platform that simplifies securing your applications.
                        <br /><br />
                        Unlike traditional authentication methods, Auth0 provides a robust, scalable, and secure identity management solution. You'll learn how to integrate Auth0 with your frontend and backend to manage user login, logout, and access control seamlessly.
                        <br /><br />
                        Understanding Auth0 will empower you to implement modern authentication flows with minimal effort, improve security, and comply with best industry practices.
                    </div>
                </div>

                <div className="aboutCourseDiv2" style={{ paddingBottom: '2em' }}>
                    <div className="introductionDiv">KEY AUTH0 CONCEPTS</div>
                    <div className="frontImageBeginner">
                        <h1 className="headerDivText" style={{ fontSize: '1.7em' }}>
                            <div className="headerContainer" style={{ width: 'fit-content' }}>
                                Essential Authentication Components
                            </div>
                            <div className="imageContainer">
                                <img src={contL} alt="" className="imageForCourse" />
                            </div>
                        </h1>
                    </div>

                    <div className="descriptionOfCourse">
                        Key concepts you need to grasp for effective Auth0 integration:
                        <ul>
                            <li><b>Tenant:</b> Your isolated Auth0 environment managing your applications and users.</li>
                            <li><b>Applications:</b> Client-side (SPA, Native) or backend apps registered with Auth0.</li>
                            <li><b>Authentication Flows:</b> Authorization Code Flow, Implicit Flow, etc., used for securely obtaining tokens.</li>
                            <li><b>JWT Tokens:</b> JSON Web Tokens used for securely transmitting user info and permissions.</li>
                            <li><b>Rules & Hooks:</b> Serverless functions that customize authentication and authorization behavior.</li>
                        </ul>
                        Mastering these components is crucial for building secure user sessions and protecting your resources.
                    </div>
                </div>

                <div className="aboutCourseDiv2" style={{ marginBottom: '-8em', marginTop: '6em' }}>
                    <div className="introductionDiv" style={{ marginLeft: '0.2em' }}>SETTING UP YOUR AUTH0 ENVIRONMENT</div>
                    <div className="frontImageBeginner">
                        <h1 className="headerDivText" style={{ fontSize: '1.7em' }}>
                            <div className="headerContainer" style={{ width: 'fit-content', marginLeft: '0.1em' }}>
                                Tenant Creation & Configuration
                            </div>
                        </h1>
                    </div>
                </div>
                <div className='key-areas2'>
                    <div className="imageContainerWebBeginner">
                        <img src={tenant} alt="" className="imageForWebBeginner" />
                        <div className="overlay">
                            <div className='keyAreasOfBeginnerWebDev2' style={{ marginTop: '-4em' }}><strong>Creating Your Auth0 Tenant</strong>
                                <div className="keyDescription">
                                    Before integrating Auth0, set up your environment:
                                    <ul>
                                        <li>Sign up and create a new <b>Auth0 tenant</b> on the Auth0 dashboard.</li>
                                        <li>Register your application (SPA, backend, or native) within the tenant.</li>
                                        <li>Configure callback URLs, allowed origins, and logout URLs.</li>
                                        <li>Generate Client ID and Client Secret needed for authentication flows.</li>
                                    </ul>
                                    This foundation is necessary to link your app with Auth0's identity services securely.
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="imageContainerWebBeginner">
                        <img src={authflow} alt="Auth0 Logo" className="imageForWebBeginner" />
                        <div className="overlay">
                            <div className='keyAreasOfBeginnerWebDev2' style={{ marginTop: '-4em' }}>
                                <strong>Understanding Auth0 Authentication Flows</strong>
                                <div className="keyDescription">
                                    Auth0 supports various authentication flows depending on your app type:
                                    <ul>
                                        <li><b>Authorization Code Flow with PKCE:</b> Recommended for Single Page Applications for secure token exchange.</li>
                                        <li><b>Implicit Flow:</b> Legacy SPA flow, now less recommended due to security concerns.</li>
                                        <li><b>Client Credentials Flow:</b> For machine-to-machine authentication, such as backend services.</li>
                                        <li><b>Resource Owner Password Flow:</b> Used sparingly; involves direct username/password exchange.</li>
                                    </ul>
                                    Knowing these flows will help you implement the right authentication method securely and effectively.
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="imageContainerWebBeginner">
                        <img src={sdks} alt="" className="imageForWebBeginner" />
                        <div className="overlay">
                            <div className='keyAreasOfBeginnerWebDev2' style={{ marginTop: '-6em' }}>
                                <strong>Implementing Auth0 SDK</strong>
                                <div className='keyDescription'>
                                    Use Auth0 SDKs to streamline authentication:
                                    <ul>
                                        <li>For frontend SPAs, use <b>@auth0/auth0-react</b> to handle login/logout and token management.</li>
                                        <li>For backend, use Auth0 middleware to validate JWT tokens and secure APIs.</li>
                                        <li>Understand how to use Auth0 hooks to customize login behavior.</li>
                                    </ul>
                                    This approach ensures secure and user-friendly authentication flows.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="aboutCourseDiv2" style={{ paddingBottom: '2em' }}>
                    <div className="introductionDiv">AUTH0 BASIC LOGIN FLOW</div>
                    <div className="frontImageBeginner">
                        <h1 className="headerDivText" style={{ fontSize: '1.7em' }}>
                            <div className="headerContainer" style={{ width: 'fit-content' }}>
                                Your First Auth0 Authentication Flow
                            </div>
                            <div className="imageContainer">
                                <img src={auth0} alt="" className="imageForCourse"></img>
                            </div>
                        </h1>
                    </div>

                    <div className="descriptionOfCourse" style={{ marginBottom: '3em' }}>
                        Here's a basic example of an Auth0 login using React SDK:
                        <pre style={{ backgroundColor: '#f5f5f5', padding: '1em', borderRadius: '5px' }}>
                            {`import { useAuth0 } from "@auth0/auth0-react";

function LoginButton() {
  const { loginWithRedirect } = useAuth0();

  return <button onClick={()
   => loginWithRedirect()}>Log In</button>;
}`}
                        </pre>
                        This simple component triggers the Auth0 hosted login page, initiating a secure user authentication.
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
                        This lesson introduced Auth0 as a comprehensive solution for authentication and authorization. You learned about tenants, applications, and authentication flows.
                        <br /><br />
                        You also saw how to configure your environment, integrate Auth0 SDKs, and implement a basic login flow.
                        <br /><br />
                        Mastering Auth0 enables you to secure your applications effectively and focus on building features rather than reinventing authentication.
                    </div>

                    <div className='key-areas3' style={{ marginTop: '-10em' }}>
                        <div className="imageContainerWebBeginner2">
                            <img src={auth0} alt="" className="imageForWebBeginner2" />
                            <div className="overlay">
                                <div className='keyAreasOfBeginnerWebDev3'>
                                    <strong>AUTH0</strong>
                                    <div className='keyDescription2'>
                                        Auth0 provides enterprise-grade authentication with ease of integration, ensuring your apps are secure and compliant.
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="imageContainerWebBeginner2">
                            <img src={lesson16} alt="" className="imageForWebBeginner2" />
                            <div className="overlay">
                                <div className='keyAreasOfBeginnerWebDev3'><strong>ENVIRONMENT SETUP</strong>
                                    <div className='keyDescription2' style={{ fontSize: '0.9em' }}>
                                        Setting up your Auth0 tenant and applications correctly is fundamental for secure authentication.
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