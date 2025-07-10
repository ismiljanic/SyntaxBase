import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Header } from '../../../Header';
import { Footer } from '../../../Footer';
import { Footer2 } from '../../../Footer2';
import '../../../../styles/webCourses/BeginnerWebCourse/Lesson1.css';
import simpleHTML from '../../../../pages/webCourses/BeginnerWebCourse/images/simpleHtml.png';
import htmlStructure from '../../../../pages/webCourses/BeginnerWebCourse/images/htmlStructure.png';
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
    const lessonId = 2;
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
        const lessonId = 2;

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
        navigate(`/course/${courseId}/lesson/3`);
    };

    const handlePreviousLesson = async () => {
        await updateProgress();
        navigate(`/course/${courseId}/lesson/1`);
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className='mainContainer'>
            <Header bgColor="rgb(247, 250, 251)" />
            <div className='lessonIntroduction'>
                <h1>Introduction to HTML</h1>
                <p>Welcome to <b>Lesson 2</b> of the <b>Beginner Web Development course</b>.</p>
            </div>
            <div className='aboutBeginnerWeb'>
                <div className="aboutCourseDiv2" style={{ paddingBottom: '7em' }}>
                    <div className="introductionDiv">Introduction</div>
                    <div className="frontImageBeginner">
                        <h1 className="headerDivText" style={{ fontSize: '1.7em' }}>
                            <div className="headerContainer" style={{ width: 'fit-content' }}>
                                What is HTML?
                            </div>
                            <div className="imageContainer">
                                <img src={simpleHTML} alt="" className="imageForCourse" />
                            </div>
                        </h1>
                    </div>

                    <div className="descriptionOfCourse">
                        HTML is the standard markup language for creating Web pages. It stands for Hyper Text Markup Language and it describes structure of Web Page. HTML consists of series of elements that tell browser how to display the content.
                    </div>
                </div>
                <div className="aboutCourseDiv2" style={{ paddingBottom: '2em' }}>
                    <div className="introductionDiv">HTML ELEMENTS</div>
                    <div className="frontImageBeginner">
                        <h1 className="headerDivText" style={{ fontSize: '1.7em' }}>
                            <div className="headerContainer" style={{ width: 'fit-content' }}>
                                Elements of HTML
                            </div>
                            <div className="imageContainer">
                                <img src={htmlStructure} alt="" className="imageForCourse" />
                            </div>
                        </h1>
                    </div>

                    <div className="descriptionOfCourse">
                        HTML is the standard markup language for creating Web pages. It stands for Hyper Text Markup Language and it describes structure of Web Page. HTML consists of series of elements that tell browser how to display the content.
                    </div>
                    <p className='paragraphP' style={{ paddingTop: '9em' }}>An HTML element is defined by a start tag, some content, and an end tag for example: <br></br> <code>
                        &lt;<span style={{ color: 'rgb(133, 214, 86)' }}>tagname</span>&gt;
                    </code>
                        Then some text here <code>
                            &lt;<span style={{ color: 'rgb(133, 214, 86)' }}>tagname</span>&gt;
                        </code>
                        <br>
                        </br>
                        There are a lot of tagnames in HTML, but in this course we will cover basic ones that are necessary to understand concepts of HTML.
                        <div className='htmlElementsDiv'>
                            <ul>
                                <li>The <code>
                                    &lt;<span style={{ color: 'rgb(133, 214, 86)' }}>!DOCTYPE html</span>&gt;
                                </code> declaration defines that this document is an HTML5 document
                                </li>
                                <li>The <code>
                                    &lt;<span style={{ color: 'rgb(133, 214, 86)' }}>html</span>&gt;
                                </code>  element is the root element of an HTML page
                                </li>
                                <li>The <code>
                                    &lt;<span style={{ color: 'rgb(133, 214, 86)' }}>head</span>&gt;
                                </code> element contains meta information about the HTML page
                                </li>
                                <li>The <code>
                                    &lt;<span style={{ color: 'rgb(133, 214, 86)' }}>title</span>&gt;
                                </code> element specifies a title for the HTML page (which is shown in the browser's title bar or in the page's tab)
                                </li>
                                <li>The <code>
                                    &lt;<span style={{ color: 'rgb(133, 214, 86)' }}>body</span>&gt;
                                </code> element defines the document's body, and is a container for all the visible contents, such as headings, paragraphs, images, hyperlinks, tables, lists, etc.
                                </li>
                                <li>The <code>
                                    &lt;<span style={{ color: 'rgb(133, 214, 86)' }}>h1</span>&gt;
                                </code> element defines a large heading
                                </li>
                                <li>The <code>
                                    &lt;<span style={{ color: 'rgb(133, 214, 86)' }}>p</span>&gt;
                                </code>  element defines a paragraph
                                </li>
                                <li>The <code>
                                    &lt;<span style={{ color: 'rgb(133, 214, 86)' }}>div</span>&gt;
                                </code>  element is by default a block element, meaning that it takes all available width, and comes with line breaks before and after.
                                </li>
                            </ul>
                        </div>
                    </p>
                </div>

                <h3 className='subsection-title'>Easy HTML examples</h3>
                <p className='paragraph'>
                    In this section we are going to showcase four simple examples of area we covered. These examples will show you what you can do by yourself today. We highly recommend exploring futher with our examples.
                </p>
                <div className='beginnerPictureContainer'>
                    <div
                        className="imageWithDescription"
                        onClick={() => window.open('/showCase1/lesson2', '_blank')}
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
                        onClick={() => window.open('/showCase2/lesson2', '_blank')}
                        style={{ cursor: 'pointer' }}
                        aria-label="Open showcase 2 lesson 2 in a new tab"
                    >
                        <img src={secondExample} alt="" className="courseImage" style={{ width: '50em', height: '30em' }} />
                        <div className="imageDescription">Try it yourself</div>
                    </div>

                    <div
                        className="imageWithDescription"
                        onClick={() => window.open('/showCase3/lesson2', '_blank')}
                        style={{ cursor: 'pointer' }}
                        aria-label="Open showcase 3 lesson 2 in a new tab"
                    >
                        <img src={thirdExample} alt="" className="courseImage" style={{ width: '50em', height: '30em' }} />
                        <div className="imageDescription">Try it yourself</div>
                    </div>

                    <div
                        className="imageWithDescription"
                        onClick={() => window.open('/showCase4/lesson2', '_blank')}
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
                        In this lesson you learned what is HTML and its basics.
                        Also, you got insight in how HTML contents are structured along with short view of basic HTML elements.
                        You were provided with four simple examples showing you how to manipulate with these elements.
                        In the next lesson you will learn how to customize and style your HTML contents with more advanced examples.
                    </div>

                    <div className='key-areas3' style={{ marginTop: '-10em' }}>
                        <div className="imageContainerWebBeginner2">
                            <img src={html1} alt="" className="imageForWebBeginner2" />
                            <div className="overlay">
                                <div className='keyAreasOfBeginnerWebDev3'>
                                    <strong>HTML (HyperText Markup Language):</strong>
                                    <div className='keyDescription2'>
                                        HTML is the standard markup language for creating Web pages. It stands for Hyper Text Markup Language and it describes structure of Web Page. HTML consists of series of elements that tell browser how to display the content.
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="imageContainerWebBeginner2">
                            <img src={html1} alt="" className="imageForWebBeginner2" />
                            <div className="overlay">
                                <div className='keyAreasOfBeginnerWebDev3'><strong>HTML elements</strong>
                                    <div className='keyDescription2' style={{ fontSize: '0.6em' }}>
                                        <ul>
                                            <li>The <code>
                                                &lt;<span style={{ color: 'rgb(133, 214, 86)' }}>!DOCTYPE html</span>&gt;
                                            </code> declaration defines that this document is an HTML5 document
                                            </li>
                                            <li>The <code>
                                                &lt;<span style={{ color: 'rgb(133, 214, 86)' }}>html</span>&gt;
                                            </code>  element is the root element of an HTML page
                                            </li>
                                            <li>The <code>
                                                &lt;<span style={{ color: 'rgb(133, 214, 86)' }}>head</span>&gt;
                                            </code> element contains meta information about the HTML page
                                            </li>
                                            <li>The <code>
                                                &lt;<span style={{ color: 'rgb(133, 214, 86)' }}>title</span>&gt;
                                            </code> element specifies a title for the HTML page (which is shown in the browser's title bar or in the page's tab)
                                            </li>
                                            <li>The <code>
                                                &lt;<span style={{ color: 'rgb(133, 214, 86)' }}>body</span>&gt;
                                            </code> element defines the document's body, and is a container for all the visible contents, such as headings, paragraphs, images, hyperlinks, tables, lists, etc.
                                            </li>
                                            <li>The <code>
                                                &lt;<span style={{ color: 'rgb(133, 214, 86)' }}>h1</span>&gt;
                                            </code> element defines a large heading
                                            </li>
                                            <li>The <code>
                                                &lt;<span style={{ color: 'rgb(133, 214, 86)' }}>p</span>&gt;
                                            </code>  element defines a paragraph
                                            </li>
                                            <li>The <code>
                                                &lt;<span style={{ color: 'rgb(133, 214, 86)' }}>div</span>&gt;
                                            </code>  element is by default a block element, meaning that it takes all available width, and comes with line breaks before and after.
                                            </li>
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
