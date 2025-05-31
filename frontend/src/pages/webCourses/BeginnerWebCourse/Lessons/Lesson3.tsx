import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Header } from '../../../Header';
import { Footer } from '../../../Footer';
import { Footer2 } from '../../../Footer2';
import '../../../../styles/webCourses/BeginnerWebCourse/Lesson1.css';
import htmlStructure from '../../../../pages/webCourses/BeginnerWebCourse/images/htmlStructure.png';
import cssProps from '../../../../pages/webCourses/BeginnerWebCourse/images/cssProps.png';
import html1 from '../../../../pages/webCourses/BeginnerWebCourse/images/html1.png';
import css1 from '../../../../pages/webCourses/BeginnerWebCourse/images/css1.png';
import firstExample from '../../../../pages/webCourses/BeginnerWebCourse/images/firstExample.png';
import secondExample from '../../../../pages/webCourses/BeginnerWebCourse/images/secondExample.png';
import thirdExample from '../../../../pages/webCourses/BeginnerWebCourse/images/thirdExample.png';
import fourthExample from '../../../../pages/webCourses/BeginnerWebCourse/images/fourthExample.png';
import { useAuth0 } from '@auth0/auth0-react';


export function Lesson3() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(true);
    const [feedbackSubmitted, setFeedbackSubmitted] = useState<boolean>(false);
    const location = useLocation();

    const lessonId = 3;
    const { courseId } = useParams();
    const { user, getAccessTokenSilently } = useAuth0();

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

    const handleScrollToSection = (sectionId: string) => {
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            window.history.pushState(null, '', `?scrollTo=${sectionId}`);
            targetSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

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
        const lessonId = 3;

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
        navigate(`/course/${courseId}/lesson/4`);
    };

    const handlePreviousLesson = async () => {
        await updateProgress();
        navigate(`/course/${courseId}/lesson/2`);
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className='mainContainer'>
            <Header bgColor="rgb(247, 250, 251)" />
            <div className='lessonIntroduction'>
                <h1>Introduction to CSS</h1>
                <p>Welcome to <b>Lesson 3</b> of the <b>Beginner Web Development course</b>.</p>
            </div>
            <div className='aboutBeginnerWeb'>
                <div className="aboutCourseDiv2" style={{ paddingBottom: '7em' }}>
                    <div className="introductionDiv">Introduction</div>
                    <div className="frontImageBeginner">
                        <h1 className="headerDivText" style={{ fontSize: '1.7em' }}>
                            <div className="headerContainer" style={{ width: 'fit-content' }}>
                                What is CSS?
                            </div>
                            <div className="imageContainer">
                                <img src={css1} alt="" className="imageForCourse" />
                            </div>
                        </h1>
                    </div>

                    <div className="descriptionOfCourse">
                        CSS is Cascading Style Sheets. It describes how HTML elements are displayed on the screen and it can also control the layout of multiple web pages at once.
                    </div>
                </div>
                <div className="aboutCourseDiv2" style={{ paddingBottom: '2em' }}>
                    <div className="introductionDiv">Syntax</div>
                    <div className="frontImageBeginner">
                        <h1 className="headerDivText" style={{ fontSize: '1.7em' }}>
                            <div className="headerContainer" style={{ width: 'fit-content' }}>
                                CSS Syntax
                            </div>
                            <div className="imageContainer">
                                <img src={cssProps} alt="" className="imageForCourse" />
                            </div>
                        </h1>
                    </div>

                    <div className="descriptionOfCourse">
                        A CSS rule consists of a selector and a declaration block.<br></br>
                        The selector points to the HTML element you want to style.<br></br>
                        The declaration block contains one or more declarations separated by semicolons.<br></br>
                        Each declaration includes a CSS property name and a value, separated by a colon.<br></br>
                        Multiple CSS declarations are separated with semicolons, and declaration blocks are surrounded by curly braces.
                    </div>
                </div>

                <h3 className='subsection-title'>Easy CSS examples</h3>
                <p className='paragraph'>
                    In this section we are going to showcase four simple examples of area we covered. These examples will show you what you can do by yourself today. We highly recommend exploring futher with our examples.
                </p>
                <div className='beginnerPictureContainer'>
                    <div
                        className="imageWithDescription"
                        onClick={() => window.open('/showCase1Lesson3/lesson3', '_blank')}
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
                        onClick={() => window.open('/showCase2Lesson3/lesson3', '_blank')}
                        style={{ cursor: 'pointer' }}
                        aria-label="Open showcase 2 lesson 2 in a new tab"
                    >
                        <img src={secondExample} alt="" className="courseImage" style={{ width: '50em', height: '30em' }} />
                        <div className="imageDescription">Try it yourself</div>
                    </div>

                    <div
                        className="imageWithDescription"
                        onClick={() => window.open('/showCase3Lesson3/lesson3', '_blank')}
                        style={{ cursor: 'pointer' }}
                        aria-label="Open showcase 3 lesson 2 in a new tab"
                    >
                        <img src={thirdExample} alt="" className="courseImage" style={{ width: '50em', height: '30em' }} />
                        <div className="imageDescription">Try it yourself</div>
                    </div>

                    <div
                        className="imageWithDescription"
                        onClick={() => window.open('/showCase4Lesson3/lesson3', '_blank')}
                        style={{ cursor: 'pointer' }}
                        aria-label="Open showcase 4 lesson 2 in a new tab"
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
                        In this lesson, you learned about the CSS Flexbox layout model and its importance in creating responsive designs.
                        You gained insight into how Flexbox simplifies the alignment and distribution of elements within a container.
                        Four practical examples guided you through setting up a basic layout, creating flexible boxes, and applying styles for enhanced visual appeal.
                        In the next lesson, you will explore more advanced CSS techniques to further customize and optimize your web layouts.
                    </div>

                    <div className='key-areas3' style={{ marginTop: '-10em' }}>
                        <div className="imageContainerWebBeginner2">
                            <img src={css1} alt="" className="imageForWebBeginner2" />
                            <div className="overlay">
                                <div className='keyAreasOfBeginnerWebDev3'>
                                    <strong>CSS</strong>
                                    <div className='keyDescription2'>
                                        CSS is Cascading Style Sheets. It describes how HTML elements are displayed on the screen and it can also control the layout of multiple web pages at once.
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="imageContainerWebBeginner2">
                            <img src={css1} alt="" className="imageForWebBeginner2" />
                            <div className="overlay">
                                <div className='keyAreasOfBeginnerWebDev3'><strong>CSS elements</strong>
                                    <div className='keyDescription2' style={{ fontSize: '0.9em' }}>
                                        A CSS rule consists of a selector and a declaration block.<br></br>
                                        The selector points to the HTML element you want to style.<br></br>
                                        The declaration block contains one or more declarations separated by semicolons.<br></br>
                                        Each declaration includes a CSS property name and a value, separated by a colon.<br></br>
                                        Multiple CSS declarations are separated with semicolons, and declaration blocks are surrounded by curly braces.
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
                        <div className='goToPreviousLessonDiv' onClick={handlePreviousLesson} style={{ marginLeft: '-78.3em' }}>
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
