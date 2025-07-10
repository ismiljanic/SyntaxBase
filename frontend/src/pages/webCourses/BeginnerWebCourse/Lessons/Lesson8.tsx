import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Header } from '../../../Header';
import { Footer } from '../../../Footer';
import { Footer2 } from '../../../Footer2';
import '../../../../styles/webCourses/BeginnerWebCourse/Lesson1.css';
import myportfolio from '../../../../pages/webCourses/BeginnerWebCourse/images/myportfolio.png';
import structure from '../../../../pages/webCourses/BeginnerWebCourse/images/structure.png';
import details from '../../../../pages/webCourses/BeginnerWebCourse/images/details.png';
import header from '../../../../pages/webCourses/BeginnerWebCourse/images/lesson8Header.png';
import footer from '../../../../pages/webCourses/BeginnerWebCourse/images/lesson8Footer.png';
import { useAuth0 } from '@auth0/auth0-react';

export function Lesson8() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(true);
    const [feedbackSubmitted, setFeedbackSubmitted] = useState<boolean>(false);
    const location = useLocation();
    const lessonId = 8;
    const { courseId } = useParams();
    const { user, getAccessTokenSilently } = useAuth0();

    const [isEnrolled, setIsEnrolled] = useState<boolean | null>(null);

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
        const lessonId = 8;

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
        navigate(`/course/${courseId}/lesson/9`);
    };

    const handlePreviousLesson = async () => {
        await updateProgress();
        navigate(`/course/${courseId}/lesson/7`);
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className='mainContainer'>
            <Header bgColor="rgb(247, 250, 251)" />
            <div className='lessonIntroduction'>
                <h1>FIRST CHAPTER</h1>
                <p>Welcome to <b>Lesson 8</b> of the <b>Beginner Web Development course</b>.</p>
            </div>
            <div className='aboutBeginnerWeb'>
                <div className="aboutCourseDiv2" style={{ paddingBottom: '7em' }}>
                    <div className="introductionDiv">INTRODUCTION</div>
                    <div className="frontImageBeginner">
                        <h1 className="headerDivText" style={{ fontSize: '1.7em' }}>
                            <div className="headerContainer" style={{ width: 'fit-content' }}>
                                STRUCTURE
                            </div>
                            <div className="imageContainer">
                                <img src={myportfolio} alt="" className="imageForCourse" />
                            </div>
                        </h1>
                    </div>

                    <div className="descriptionOfCourse">
                        In this chapter you will need to build basic HTML structure for your website. You will need to use HTML elements and create simple layout for your website.
                        <br></br>
                        <br></br>
                        Try to think what you want to show on your website and how you want to present it.
                    </div>
                </div>
                <div className="aboutCourseDiv2" style={{ paddingBottom: '2em' }}>
                    <div className="introductionDiv">HEADER, FOOTER, BODY</div>
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
                        Generate your own header, footer and body for your website. You can be creative and use any HTML elements you want.
                        <br></br>
                        <br></br>
                    </div>
                    <p className='paragraphP' style={{ paddingTop: '9em' }}>Our example can be found <a href='/beginnerWebCourse/project/portfolio' className='introductionDiv' style={{ color: 'black', textDecoration: 'none' }} target="_blank"
                        rel="noopener noreferrer">here</a><br></br>
                    </p>
                </div>

                <div className="aboutCourseDiv2" style={{ paddingBottom: '2em' }}>
                    <div className="introductionDiv">SECOND CHAPTER</div>
                    <div className="frontImageBeginner">
                        <h1 className="headerDivText" style={{ fontSize: '1.7em' }}>
                            <div className="headerContainer" style={{ width: 'fit-content' }}>
                                HEADER
                            </div>
                            <div className="imageContainer">
                                <img src={header} alt="" className="imageForCourse" />
                            </div>
                        </h1>
                    </div>

                    <div className="descriptionOfCourse">
                        In this section you will need to add header to your website.
                        <br></br>
                        <br></br>
                        Think what you want to show in your header and how you want to present it.
                        <br></br>
                        <br></br>
                        Create your logo and add it to your header.
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
                                FOOTER
                            </div>
                            <div className="imageContainer">
                                <img src={footer} alt="" className="imageForCourse" />
                            </div>
                        </h1>
                    </div>

                    <div className="descriptionOfCourse">
                        In this section you will need to add footer to your website.
                        <br></br>
                        <br></br>
                        Think what you want to show in your footer and how you want to present it.
                        <br></br>
                        <br></br>
                        Footer generally contains information about the website and its owner. You can add your contact information, social media links, and other relevant details.
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
                        In this lesson you created basic HTML structure for your website. You created header and footer and are now ready to add content to your website. Next lesson will be about adding style and responsiveness to your website.
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
