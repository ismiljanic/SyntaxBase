import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Header } from '../../../Header';
import { Footer } from '../../../Footer';
import { Footer2 } from '../../../Footer2';
import '../../../../styles/webCourses/BeginnerWebCourse/Lesson1.css';
import css1 from '../../../../pages/webCourses/BeginnerWebCourse/images/css1.png';
import firstExample from '../../../../pages/webCourses/BeginnerWebCourse/images/firstExample.png';
import borders from '../../../../pages/webCourses/BeginnerWebCourse/images/borders.png';
import margins from '../../../../pages/webCourses/BeginnerWebCourse/images/margins.png';
import secondExample from '../../../../pages/webCourses/BeginnerWebCourse/images/secondExample.png';
import thirdExample from '../../../../pages/webCourses/BeginnerWebCourse/images/thirdExample.png';
import fourthExample from '../../../../pages/webCourses/BeginnerWebCourse/images/fourthExample.png';
import react from '../../../../pages/webCourses/BeginnerWebCourse/images/react.png';
import typescript from '../../../../pages/webCourses/BeginnerWebCourse/images/typescript.png';
import typescript2 from '../../../../pages/webCourses/BeginnerWebCourse/images/typescript2.png';
import react2 from '../../../../pages/webCourses/BeginnerWebCourse/images/react2.png';
import react3 from '../../../../pages/webCourses/BeginnerWebCourse/images/react3.png';
import magic from '../../../../pages/webCourses/BeginnerWebCourse/images/magic.png';
import components from '../../../../pages/webCourses/BeginnerWebCourse/images/components.png';
import types from '../../../../pages/webCourses/BeginnerWebCourse/images/types.png';
import props from '../../../../pages/webCourses/BeginnerWebCourse/images/props.png';
import useStatee from '../../../../pages/webCourses/BeginnerWebCourse/images/useState.png';
import useeffectt from '../../../../pages/webCourses/BeginnerWebCourse/images/useeffectt.png';
import onclickk from '../../../../pages/webCourses/BeginnerWebCourse/images/onclickk.png';
import generics from '../../../../pages/webCourses/BeginnerWebCourse/images/generics.png';
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
                <h1>TypeScript and React</h1>
                <p>Welcome to <b>Lesson 5</b> of the <b>Beginner Web Development course</b>.</p>
            </div>
            <div className='aboutBeginnerWeb'>
                <div className="aboutCourseDiv2" style={{ paddingBottom: '7em' }}>
                    <div className="introductionDiv">REACT</div>

                    <div className="frontImageBeginner">
                        <h1 className="headerDivText" style={{ fontSize: '1.7em' }}>
                            <div className="headerContainer" style={{ width: 'fit-content' }}>
                                What is React?
                            </div>
                            <div className="imageContainer">
                                <img src={react} alt="" className="imageForCourse" onClick={() => window.open('https://react.dev/', '_blank')} style={{ cursor: 'pointer' }} />
                            </div>
                        </h1>
                    </div>

                    <div className="descriptionOfCourse">
                        React is a popular JavaScript library for building user interfaces. It allows developers to create reusable components, manage state efficiently, and handle dynamic user interactions. React focuses on building web applications with high performance and ease of development.
                    </div>
                </div>

                <div className="aboutCourseDiv2" style={{ paddingBottom: '2em' }}>
                    <div className="introductionDiv">TYPESCRIPT</div>
                    <div className="frontImageBeginner">
                        <h1 className="headerDivText" style={{ fontSize: '1.7em' }}>
                            <div className="headerContainer" style={{ width: 'fit-content' }}>
                                What is TypeScript?
                            </div>
                            <div className="imageContainer">
                                <img src={typescript} alt="" className="imageForCourse" onClick={() => window.open('https://www.typescriptlang.org/', '_blank')}
                                    style={{ cursor: 'pointer' }} />
                            </div>
                        </h1>
                    </div>

                    <div className="descriptionOfCourse">
                        TypeScript is a superset of JavaScript that adds static typing to your code.
                        This means that you can declare the types of variables, function parameters, and return values in your code, making it easier to catch errors early and improve code quality.
                    </div>
                </div>

                <div className="aboutCourseDiv2" style={{ marginBottom: '-8em', marginTop: '6em' }}>
                    <div className="introductionDiv" style={{ marginLeft: '0.2em' }}>TYPESCRIPT WITH REACT</div>
                    <div className="frontImageBeginner">
                        <h1 className="headerDivText" style={{ fontSize: '1.7em' }}>
                            <div className="headerContainer" style={{ width: 'fit-content', marginLeft: '0.1em' }}>
                                Why Use TypeScript with React?
                            </div>
                        </h1>
                    </div>
                </div>
                <div className='key-areas2'>
                    <div className="imageContainerWebBeginner">
                        <img src={typescript2} alt="" className="imageForWebBeginner" />
                        <div className="overlay">
                            <div className='keyAreasOfBeginnerWebDev'>
                                <strong>Catch Errors Early</strong>
                                <div className='keyDescription'>
                                    TypeScript's type system helps developers catch potential bugs <b>before running the code</b>.
                                    Unlike plain JavaScript, which is dynamically typed and prone to type-related runtime errors, TypeScript performs <b> compile-time type checking. </b>
                                    This means errors like passing incorrect data types to a function or assigning an unexpected value to a variable are caught as you're writing the code.
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="imageContainerWebBeginner">
                        <img src={react2} alt="" className="imageForWebBeginner" />
                        <div className="overlay">
                            <div className='keyAreasOfBeginnerWebDev2' style={{ marginTop: '3em' }}><strong>Better Code Completion</strong>
                                <div className='keyDescription'>
                                    TypeScript provides <b> enhanced autocompletion</b> in editors like Visual Studio Code, thanks to its type system.
                                    With TypeScript, the editor knows exactly what types your variables, props, and functions are, which leads to more accurate suggestions, reducing the chance of human errors.
                                    <br></br>
                                    <br></br>
                                    <b>Benefits of Better Autocompletion:</b>
                                    <ul>
                                        <li>
                                            Increased Productivity: You can write code faster as your editor will suggest functions, variables, and types based on your existing code, reducing the need to switch contexts or look up documentation.
                                        </li>
                                        <li>
                                            Fewer Typos and Syntax Errors: Autocompletion reduces manual typing and potential mistakes.
                                        </li>
                                        <li>
                                            Improved Code Navigation: TypeScript makes it easier to navigate large codebases since you can easily click through types, props, or functions and understand their definitions.
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="imageContainerWebBeginner">
                        <img src={magic} alt="" className="imageForWebBeginner" />
                        <div className="overlay">
                            <div className='keyAreasOfBeginnerWebDev' style={{ marginTop: '-12em' }}>
                                <strong>Maintainability</strong>
                                <div className='keyDescription'>
                                    As React applications grow, it becomes increasingly important to <b>keep your codebase organized, predictable, and easy to maintain</b>.
                                    TypeScript enforces strong typing, making it easier to understand what your components expect and what they return.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="aboutCourseDiv2" style={{ paddingBottom: '2em' }}>
                    <div className="introductionDiv">REACT</div>
                    <div className="frontImageBeginner">
                        <h1 className="headerDivText" style={{ fontSize: '1.7em' }}>
                            <div className="headerContainer" style={{ width: 'fit-content' }}>
                                1.Getting Started with React
                            </div>
                            <div className="imageContainer">
                                <img src={components} alt="" className="imageForCourse" onClick={() => window.open('/showCase1Lesson5/lesson5', '_blank')}
                                    style={{ cursor: 'pointer' }} />
                            </div>
                        </h1>
                    </div>

                    <div className="descriptionOfCourse">
                        <b>Components</b>:<br></br><br></br> The building blocks of a React app. They are JavaScript functions or classes that return JSX (React’s syntax for writing HTML-like code in JavaScript).
                        <br></br>
                        <br></br>
                        <b>What You'll Learn:</b><br></br>
                        <ul>
                            <li>
                                How to install React using Create React App.
                            </li>
                            <li>
                                Understanding how components work.
                            </li>
                            <li>
                                How to organize and render components.
                            </li>
                        </ul>
                        <b>How React Works:</b><br></br>
                        <ul>
                            <li>
                                <b>JSX:</b> A syntax extension that allows you to write HTML-like code inside JavaScript.
                            </li>
                            <li>
                                <b>Virtual DOM:</b> React creates a lightweight copy of the actual DOM to make rendering fast and efficient.
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="aboutCourseDiv2" style={{ paddingBottom: '2em' }}>
                    <div className="introductionDiv">TYPESCRIPT</div>
                    <div className="frontImageBeginner">
                        <h1 className="headerDivText" style={{ fontSize: '1.7em' }}>
                            <div className="headerContainer" style={{ width: 'fit-content' }}>
                                2. Introduction to TypeScript Basics
                            </div>
                            <div className="imageContainer">
                                <img src={types} alt="" className="imageForCourse" onClick={() => window.open('/showCase2Lesson5/lesson5', '_blank')}
                                    style={{ cursor: 'pointer' }} />
                            </div>
                        </h1>
                    </div>

                    <div className="descriptionOfCourse">
                        <b>Types</b>:<br></br><br></br>
                        In TypeScript, you can specify the type of a variable when you declare it.
                        <br></br>
                        <br></br>
                        <b>What You'll Learn:</b><br></br>
                        <ul>
                            <li>
                                Basic types like <b>number, string, boolean, array, and object</b>.
                            </li>
                            <li>
                                How to define <b>interfaces</b> for structured objects.
                            </li>
                            <li>
                                How to work with <b>functions and enforce type</b> safety in your code.
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="aboutCourseDiv2" style={{ paddingBottom: '2em' }}>
                    <div className="introductionDiv">REACT + TYPESCRIPT</div>
                    <div className="frontImageBeginner">
                        <h1 className="headerDivText" style={{ fontSize: '1.7em' }}>
                            <div className="headerContainer" style={{ width: 'fit-content' }}>
                                3. React + TypeScript: Basic Setup
                            </div>
                            <div className="imageContainer">
                                <img src={props} alt="" className="imageForCourse" onClick={() => window.open('/showCase3Lesson5/lesson5', '_blank')}
                                    style={{ cursor: 'pointer' }} />
                            </div>
                        </h1>
                    </div>

                    <div className="descriptionOfCourse">
                        <b>What You'll Learn:</b><br></br>
                        <ul>
                            <li>
                                How to set up a new React project using TypeScript.
                            </li>
                            <li>
                                How to define <b>props</b> (data passed to components) and state with types.
                            </li>
                        </ul>
                        <b>Key Concepts:</b><br></br>
                        <ul>
                            <li>
                                <b>Props and State in React:</b> Components receive data through props and manage their own state internally.
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="aboutCourseDiv2" style={{ paddingBottom: '2em' }}>
                    <div className="introductionDiv">REACT STATE</div>
                    <div className="frontImageBeginner">
                        <h1 className="headerDivText" style={{ fontSize: '1.7em' }}>
                            <div className="headerContainer" style={{ width: 'fit-content' }}>
                                4. Working with React State (with TypeScript)
                            </div>
                            <div className="imageContainer">
                                <img src={useStatee} alt="" className="imageForCourse" onClick={() => window.open('/showCase4Lesson5/lesson5', '_blank')}
                                    style={{ cursor: 'pointer' }} />
                            </div>
                        </h1>
                    </div>

                    <div className="descriptionOfCourse">
                        <b>What You'll Learn:</b><br></br>
                        <ul>
                            <li>
                                How to declare the type of state variables.
                            </li>
                            <li>
                                How to handle state updates in TypeScript.
                            </li>
                        </ul>
                        <b>Key Concepts:</b><br></br>
                        <ul>
                            <li>
                                <b>useState Hook:</b> This hook allows you to add state to functional components.
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="aboutCourseDiv2" style={{ paddingBottom: '2em' }}>
                    <div className="introductionDiv">REACT EVENTS</div>
                    <div className="frontImageBeginner">
                        <h1 className="headerDivText" style={{ fontSize: '1.7em' }}>
                            <div className="headerContainer" style={{ width: 'fit-content' }}>
                                5. Handling Events in React with TypeScript
                            </div>
                            <div className="imageContainer">
                                <img src={onclickk} alt="" className="imageForCourse" onClick={() => window.open('/showCase5Lesson5/lesson5', '_blank')}
                                    style={{ cursor: 'pointer' }} />
                            </div>
                        </h1>
                    </div>

                    <div className="descriptionOfCourse">
                        <b>What You'll Learn:</b><br></br>
                        <ul>
                            <li>
                                How to type common event handlers like <b>onClick</b>, <b>onChange</b>, and more.
                            </li>
                            <li>
                                How to work with form events.
                            </li>
                        </ul>
                        <b>Key Concepts:</b><br></br>
                        <ul>
                            <li>
                                <b>Event Handlers:</b> In React, events work similarly to native HTML events but are wrapped in React's synthetic event system.
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="aboutCourseDiv2" style={{ paddingBottom: '2em' }}>
                    <div className="introductionDiv">TYPESCRIPT FEATURES</div>
                    <div className="frontImageBeginner">
                        <h1 className="headerDivText" style={{ fontSize: '1.7em' }}>
                            <div className="headerContainer" style={{ width: 'fit-content' }}>
                                6. Advanced TypeScript Features for React
                            </div>
                            <div className="imageContainer">
                                <img src={generics} alt="" className="imageForCourse" onClick={() => window.open('/showCase6Lesson5/lesson5', '_blank')}
                                    style={{ cursor: 'pointer' }} />
                            </div>
                        </h1>
                    </div>

                    <div className="descriptionOfCourse">
                        <b>What You'll Learn:</b><br></br>
                        <ul>
                            <li>
                                Using TypeScript's advanced features to write more flexible and reusable components.
                            </li>
                            <li>

                                Working with <b>optional props</b> and <b>default props</b> in React.
                            </li>
                        </ul>
                        <b>Key Concepts:</b><br></br>
                        <ul>
                            <li>
                                <b>Generics:</b>  Functions or components that work with various data types.
                            </li>
                            <li>
                                <b>Union Types:</b>  Variables that can take multiple types.
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="aboutCourseDiv2" style={{ paddingBottom: '2em' }}>
                    <div className="introductionDiv">API RESPONSES</div>
                    <div className="frontImageBeginner">
                        <h1 className="headerDivText" style={{ fontSize: '1.7em' }}>
                            <div className="headerContainer" style={{ width: 'fit-content' }}>
                                7. Fetching Data and Handling API Responses with TypeScript
                            </div>
                            <div className="imageContainer">
                                <img src={useeffectt} alt="" className="imageForCourse" onClick={() => window.open('/showCase7Lesson5/lesson5', '_blank')}
                                    style={{ cursor: 'pointer' }} />
                            </div>
                        </h1>
                    </div>

                    <div className="descriptionOfCourse">
                        <b>What You'll Learn:</b><br></br>
                        <ul>
                            <li>
                                How to use <b>useEffect</b> to fetch data from an API.
                            </li>
                            <li>
                                How to type API responses and handle errors gracefully.
                            </li>
                        </ul>
                        <b>Key Concepts:</b><br></br>
                        <ul>
                            <li>
                                <b>Asynchronous Data Fetching:</b> Using <b>fetch</b> or <b>axios</b> to fetch data from APIs.
                            </li>
                            <li>
                                <b>Typing API Responses:</b>  Defining interfaces for the data you expect to receive.
                            </li>
                        </ul>
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
                        In this lesson, you learned how to build React applications with TypeScript, manage state, handle user events, fetch data from APIs, and use advanced TypeScript features.
                        You'll be confident in using TypeScript to improve your productivity and maintainability in React projects.
                    </div>

                    <div className='key-areas3' style={{ marginTop: '-10em' }}>
                        <div className="imageContainerWebBeginner2">
                            <img src={react3} alt="" className="imageForWebBeginner2" />
                            <div className="overlay">
                                <div className='keyAreasOfBeginnerWebDev3'>
                                    <strong>REACT</strong>
                                    <div className='keyDescription2'>
                                        React is a popular JavaScript library for building user interfaces. It allows developers to create reusable components, manage state efficiently, and handle dynamic user interactions. React focuses on building web applications with high performance and ease of development.
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="imageContainerWebBeginner2">
                            <img src={typescript} alt="" className="imageForWebBeginner2" />
                            <div className="overlay">
                                <div className='keyAreasOfBeginnerWebDev3'><strong>TYPESCRIPT</strong>
                                    <div className='keyDescription2' style={{ fontSize: '0.9em' }}>
                                        TypeScript is a superset of JavaScript that adds static typing to your code.
                                        This means that you can declare the types of variables, function parameters, and return values in your code, making it easier to catch errors early and improve code quality.
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
