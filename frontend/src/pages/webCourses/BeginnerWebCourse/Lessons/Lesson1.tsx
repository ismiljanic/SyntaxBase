import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Header } from '../../../Header';
import { Footer } from '../../../Footer';
import { Footer2 } from '../../../Footer2';
import '../../../../styles/webCourses/BeginnerWebCourse/Lesson1.css';
import frontendBeginnerWeb from '../../../../pages/webCourses/BeginnerWebCourse/images/frontendBeginnerWeb.png';
import backendBeginnerWeb from '../../../../pages/webCourses/BeginnerWebCourse/images/backendBeginnerWeb.png';
import fsBeginnerWeb from '../../../../pages/webCourses/BeginnerWebCourse/images/fsBeginnerWeb.png';
import beginnerWebDevImage from '../../../../pages/webCourses/BeginnerWebCourse/images/beginnerWebDevImage.png';
import html1 from '../../../../pages/webCourses/BeginnerWebCourse/images/html1.png';
import css1 from '../../../../pages/webCourses/BeginnerWebCourse/images/css1.png';
import typescript1 from '../../../../pages/webCourses/BeginnerWebCourse/images/typescript1.png';
import finalp1 from '../../../../pages/webCourses/BeginnerWebCourse/images/finalp1.png';
import project1 from '../../../../pages/webCourses/BeginnerWebCourse/images/project1.png';
import firstApp from '../../../../pages/webCourses/BeginnerWebCourse/images/firstApp.png';
import contL from '../../../../pages/webCourses/BeginnerWebCourse/images/contL.png';
import courseOverview from '../../../../pages/webCourses/BeginnerWebCourse/images/courseOverview.png';
import web6 from '../../../../images/web6.png';
import { useAuth0 } from '@auth0/auth0-react';

export function Lesson1() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(true);
    const [feedbackSubmitted, setFeedbackSubmitted] = useState<boolean>(false);
    const { user, getAccessTokenSilently } = useAuth0();
    const lessonId = 1;
    const { courseId } = useParams();

    const auth0UserId = user?.sub;
    useEffect(() => {
        const checkFeedbackStatus = async () => {
            if (!user?.sub) {
                console.error('User not logged in');
                setLoading(false);
                return;
            }

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
    }, [user?.sub]);

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
                await markLessonAsCompleted(lessonId);
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
        const courseId = 1;
        const lessonId = 1;

        try {
            const token = await getAccessTokenSilently();

            const response = await fetch(`http://localhost:8080/api/progress/update?courseId=${courseId}&lessonId=${lessonId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
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
        navigate(`/course/${courseId}/lesson/2`);
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className='mainContainer'>
            <Header bgColor="rgb(247, 250, 251)" />
            <div className='lessonIntroduction'>
                <h1>Introduction to Web Development</h1>
                <p>Welcome to <b>Lesson 1</b> of the <b>Beginner Web Development course</b>.</p>
            </div>
            <div className='aboutBeginnerWeb'>
                <div className="aboutCourseDiv2" style={{ paddingBottom: '7em' }}>
                    <div className="introductionDiv">Introduction</div>
                    <div className="frontImageBeginner">
                        <h1 className="headerDivText" style={{ fontSize: '1.7em' }}>
                            <div className="headerContainer" style={{ width: 'fit-content' }}>
                                What is Web Development?
                            </div>
                            <div className="imageContainer">
                                <img src={beginnerWebDevImage} alt="" className="imageForCourse" />
                            </div>
                        </h1>
                    </div>

                    <div className="descriptionOfCourse">
                        At its core, web development refers to the creation of websites and web applications that are accessible through the internet.
                        Every website you visit, from small personal blogs to massive e-commerce platforms like Amazon, has been carefully designed and built by web developers.
                    </div>
                </div>
                <div className="aboutCourseDiv2" style={{ marginBottom: '-8em' }}>
                    <div className="introductionDiv" style={{ marginLeft: '0.2em' }}>KEY AREAS</div>
                    <div className="frontImageBeginner">
                        <h1 className="headerDivText" style={{ fontSize: '1.7em' }}>
                            <div className="headerContainer" style={{ width: 'fit-content', marginLeft: '0.1em' }}>
                                Areas of Web Development
                            </div>
                        </h1>
                    </div>
                </div>
                <div className='key-areas2'>
                    <div className="imageContainerWebBeginner">
                        <img src={frontendBeginnerWeb} alt="" className="imageForWebBeginner" />
                        <div className="overlay">
                            <div className='keyAreasOfBeginnerWebDev'>
                                <strong>Frontend Development (Client-Side):</strong>
                                <div className='keyDescription'>
                                    This is what users see and interact with on a website. It involves working with languages like <b>HTML, CSS, and JavaScript</b> to build the layout, design, and functionality of a website.
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="imageContainerWebBeginner">
                        <img src={backendBeginnerWeb} alt="" className="imageForWebBeginner" />
                        <div className="overlay">
                            <div className='keyAreasOfBeginnerWebDev2'><strong>Backend Development (Server-Side):</strong>
                                <div className='keyDescription'> The backend is what happens behind the scenes. It's responsible for managing the data, servers, and databases that make a website function properly. Backend development often involves languages like <b>Python, PHP, Ruby, Node.js or Spring Boot</b>.
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="imageContainerWebBeginner">
                        <img src={fsBeginnerWeb} alt="" className="imageForWebBeginner" />
                        <div className="overlay">
                            <div className='keyAreasOfBeginnerWebDev' style={{ marginTop: '-12em' }}>
                                <strong>Full Stack Development</strong>
                                <div className='keyDescription'>
                                    A full-stack developer works on both the frontend and backend of a website, handling everything from the design to the server management.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <h3 className='subsection-title'>Why Learn Web Development?</h3>
                <p className='paragraph'>The internet is the backbone of modern society. Businesses, educational institutions, and entertainment industries all rely on websites and web applications to connect with users and provide services. Learning web development empowers you to create engaging and interactive digital experiences, no matter your goals.</p>
                <div className='beginnerPictureContainer'>
                    <div className="imageWithDescription">
                        <img src={project1} alt="" className="courseImage" style={{ width: '50em', height: '30em' }} />
                        <div className="imageDescription">Creativity Meets Technology</div>
                    </div>
                    <div className="imageWithDescription">
                        <img src={web6} alt="" className="courseImage" style={{ width: '50em', height: '30em' }} />
                        <div className="imageDescription">In-Demand Skills</div>
                    </div>
                    <div className="imageWithDescription">
                        <img src={firstApp} alt="" className="courseImage" style={{ width: '50em', height: '30em' }} />
                        <div className="imageDescription">Build Your Own Projects</div>
                    </div>
                    <div className="imageWithDescription">
                        <img src={contL} alt="" className="courseImage" style={{ width: '50em', height: '30em' }} />
                        <div className="imageDescription">Continuous Learning</div>
                    </div>
                </div>
                <div className="aboutCourseDiv2" style={{ paddingBottom: '7em' }}>
                    <div className="introductionDiv">Overview</div>
                    <div className="frontImageBeginner">
                        <h1 className="headerDivText" style={{ fontSize: '1.7em' }}>
                            <div className="headerContainer" style={{ width: 'fit-content' }}>
                                Course Overview
                            </div>
                            <div className="imageContainer">
                                <img src={courseOverview} alt="" className="imageForCourse" />
                            </div>
                        </h1>
                    </div>

                    <div className="descriptionOfCourse">
                        In this course, you'll learn the following key areas of web development including HTML, CSS, TypeScript and you will build final project with gained knowledge.
                        By the end of this course, you'll not only have the knowledge to create your own website, but you'll also understand the core principles of web development, positioning you for further learning or starting your journey as a developer.
                    </div>

                    <div className='key-areas3'>
                        <div className="imageContainerWebBeginner2">
                            <img src={html1} alt="" className="imageForWebBeginner2" />
                            <div className="overlay">
                                <div className='keyAreasOfBeginnerWebDev3'>
                                    <strong>HTML (HyperText Markup Language):</strong>
                                    <div className='keyDescription2'>
                                        The building block of any website. You'll learn how to structure content and create the elements that make up a webpage.
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="imageContainerWebBeginner2">
                            <img src={css1} alt="" className="imageForWebBeginner2" />
                            <div className="overlay">
                                <div className='keyAreasOfBeginnerWebDev3'><strong>CSS (Cascading Style Sheets):</strong>
                                    <div className='keyDescription2'>
                                        Once you've structured your content, you'll learn how to style it, making your site visually appealing and responsive across different devices.
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="imageContainerWebBeginner2">
                            <img src={typescript1} alt="" className="imageForWebBeginner2" />
                            <div className="overlay">
                                <div className='keyAreasOfBeginnerWebDev3'>
                                    <strong>TypeScript:</strong>
                                    <div className='keyDescription2'>
                                        After mastering HTML and CSS, you'll dive into JavaScript, which brings interactivity to your website. You'll learn how to make your site dynamic and responsive to user actions.
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="imageContainerWebBeginner2">
                            <img src={finalp1} alt="" className="imageForWebBeginner2" />
                            <div className="overlay">
                                <div className='keyAreasOfBeginnerWebDev3'>
                                    <strong>Final Project:</strong>
                                    <div className='keyDescription2'>
                                        At the end of this course, you'll apply everything you've learned to build a fully functional website of your own. This will be an excellent opportunity to showcase your new skills!
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
                <div className='moreCoursesDiv' onClick={handleNextLesson}>
                    Next Lesson
                </div>
            )}
            <Footer2 bgColor="rgb(247, 250, 251)" />
            <Footer bgColor="rgb(247, 250, 251)" />
        </div>
    );
}
