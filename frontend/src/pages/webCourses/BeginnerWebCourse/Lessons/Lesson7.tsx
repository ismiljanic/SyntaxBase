import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Header } from '../../../Header';
import { Footer } from '../../../Footer';
import { Footer2 } from '../../../Footer2';
import '../../../../styles/webCourses/BeginnerWebCourse/Lesson1.css';
import myportfolio from '../../../../pages/webCourses/BeginnerWebCourse/images/myportfolio.png';
import structure from '../../../../pages/webCourses/BeginnerWebCourse/images/structure.png';
import basicCSS from '../../../../pages/webCourses/BeginnerWebCourse/images/basicCSS.png';
import details from '../../../../pages/webCourses/BeginnerWebCourse/images/details.png';

export function Lesson7() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(true);
    const [feedbackSubmitted, setFeedbackSubmitted] = useState<boolean>(false);
    const location = useLocation();
    const baseUrl = process.env.REACT_APP_API_BASE_URL;

    const lessonId = 7;
    const { courseId } = useParams();
    const userId = sessionStorage.getItem('userId');

    useEffect(() => {
        const checkFeedbackStatus = async () => {
            if (!userId) {
                console.error('User ID is not found in session storage');
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`${baseUrl}/api/feedback/status?lessonId=${lessonId}&userId=${userId}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const status = await response.text();
                setFeedbackSubmitted(status === "Thank you for your feedback!");
            } catch (error) {
                console.error('Error checking feedback status:', error);
            } finally {
                setLoading(false);
            }
        };

        checkFeedbackStatus();
    }, [userId]);

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
        if (!userId) {
            console.error('User ID is not found in session storage');
            return;
        }

        try {
            const response = await fetch(`${baseUrl}/api/feedback/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    lessonId: lessonId,
                    userId: userId,
                    feedback: feedbackType
                }),
            });

            if (response.ok) {
                const numericUserId = Number(userId);
                await markLessonAsCompleted(lessonId, numericUserId);
                setFeedbackSubmitted(true);
            } else {
                console.error('Failed to send feedback');
            }
        } catch (error) {
            console.error('Error sending feedback:', error);
        }
    };

    const markLessonAsCompleted = async (lessonId: number, userId: number) => {
        try {
            const response = await fetch(`${baseUrl}/api/feedback/complete`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ lessonId, userId })
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
        const userId = sessionStorage.getItem('userId');
        const courseId = 1;
        const lessonId = 7;

        if (!userId) {
            console.error('User ID is not found in session storage');
            return;
        }

        try {
            await fetch(`${baseUrl}/api/progress/update?userId=${userId}&courseId=${courseId}&lessonId=${lessonId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
        } catch (error) {
            console.error('Error updating progress:', error);
        }
    };



    const handleNextLesson = async () => {
        await updateProgress();
        navigate(`/course/${courseId}/lesson/8`);
    };

    const handlePreviousLesson = async () => {
        await updateProgress();
        navigate(`/course/${courseId}/lesson/6`);
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className='mainContainer'>
            <Header bgColor="rgb(247, 250, 251)" />
            <div className='lessonIntroduction'>
                <h1>FINAL PROJECT</h1>
                <p>Welcome to <b>Lesson 7</b> of the <b>Beginner Web Development course</b>.</p>
            </div>
            <div className='aboutBeginnerWeb'>
                <div className="aboutCourseDiv2" style={{ paddingBottom: '7em' }}>
                    <div className="introductionDiv">Introduction</div>
                    <div className="frontImageBeginner">
                        <h1 className="headerDivText" style={{ fontSize: '1.7em' }}>
                            <div className="headerContainer" style={{ width: 'fit-content' }}>
                                CHAPTERS
                            </div>
                            <div className="imageContainer">
                                <img src={myportfolio} alt="" className="imageForCourse" />
                            </div>
                        </h1>
                    </div>

                    <div className="descriptionOfCourse">
                        For final project you will need to use your gained knowledge and build simple portfolio website for yourself. We will guide you with three following lessons and provide you examples and good practices. In this lesson we will give you basic layout of how you would need to think when creating your website. In the following lessons you will have examples provided that will guide you even further. This lesson contains three chapters.
                        <br></br>
                        <br></br>
                        <b>Goals:</b><br></br>
                        <ul>
                            <li>
                                Using learned concepts to build simple portfolio website.
                            </li>
                            <li>
                                Implement and use CSS in your project.
                            </li>
                            <li>
                                Use JavaScript to add interactivity to your website.
                            </li>
                            <li>
                                Use React to build your website.
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="aboutCourseDiv2" style={{ paddingBottom: '2em' }}>
                    <div className="introductionDiv">FIRST CHAPTER</div>
                    <div className="frontImageBeginner">
                        <h1 className="headerDivText" style={{ fontSize: '1.7em' }}>
                            <div className="headerContainer" style={{ width: 'fit-content' }}>
                                BASIC HTML STRUCTURE
                            </div>
                            <div className="imageContainer">
                                <img src={structure} alt="" className="imageForCourse" />
                            </div>
                        </h1>
                    </div>

                    <div className="descriptionOfCourse">
                        In this chapter you will need to build basic HTML structure for your website. You will need to use HTML elements and create simple layout for your website.
                        <br></br>
                        <br></br>
                        Try to think what you want to show on your website and how you want to present it.
                        <br></br>
                        <br></br>
                        Try to do it on your own and use our examples as a guide. You can use any HTML elements you want, but try to keep it simple and clean.
                    </div>
                    <p className='paragraphP' style={{ paddingTop: '9em' }}>Our example of simple portfolio can be found <a href='/beginnerWebCourse/project/portfolio' className='introductionDiv' style={{ color: 'black', textDecoration: 'none' }} target="_blank"
                        rel="noopener noreferrer">here</a><br></br>
                    </p>
                </div>

                <div className="aboutCourseDiv2" style={{ paddingBottom: '2em' }}>
                    <div className="introductionDiv">SECOND CHAPTER</div>
                    <div className="frontImageBeginner">
                        <h1 className="headerDivText" style={{ fontSize: '1.7em' }}>
                            <div className="headerContainer" style={{ width: 'fit-content' }}>
                                BASIC CSS FOR INITAL HTML
                            </div>
                            <div className="imageContainer">
                                <img src={basicCSS} alt="" className="imageForCourse" />
                            </div>
                        </h1>
                    </div>

                    <div className="descriptionOfCourse">
                        In this section you will add simple CSS to your HTML structure.
                        <br></br>
                        <br></br>
                        You will need to use CSS properties to style your website and make it look better.
                        <br></br>
                        <br></br>
                        You can use any CSS properties you want, but try to keep it simple and clean for now.
                    </div>
                    <p className='paragraphP' style={{ paddingTop: '9em' }}>Our example of simple portfolio can be found <a href='/beginnerWebCourse/project/portfolio' className='introductionDiv' style={{ color: 'black', textDecoration: 'none' }} target="_blank"
                        rel="noopener noreferrer">here</a><br></br>
                    </p>
                </div>
                <div className="aboutCourseDiv2" style={{ paddingBottom: '2em' }}>
                    <div className="introductionDiv">THIRD CHAPTER</div>
                    <div className="frontImageBeginner">
                        <h1 className="headerDivText" style={{ fontSize: '1.7em' }}>
                            <div className="headerContainer" style={{ width: 'fit-content' }}>
                                ADD DETAILS
                            </div>
                            <div className="imageContainer">
                                <img src={details} alt="" className="imageForCourse" />
                            </div>
                        </h1>
                    </div>

                    <div className="descriptionOfCourse">
                        In this chapter you will need to add more details to your website.
                        <br></br>
                        <br></br>
                        Details should be added to your HTML structure and CSS.
                        <br></br>
                        <br></br>
                        They should include images, text, links and other elements that will make your website look better.
                    </div>
                    <p className='paragraphP' style={{ paddingTop: '9em' }}>Our example of simple portfolio can be found <a href='/beginnerWebCourse/project/portfolio' className='introductionDiv' style={{ color: 'black', textDecoration: 'none' }} target="_blank"
                        rel="noopener noreferrer">here</a><br></br>
                    </p>
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
                        In this lesson you created basic HTML structure for your website.
                        You used HTML elements to create simple layout for your website.
                        You also added simple CSS to your HTML structure and styled your website.
                        Furthermore, you added details to your website and made it look better.
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
