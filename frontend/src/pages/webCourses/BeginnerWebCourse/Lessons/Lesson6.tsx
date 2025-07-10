import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Header } from '../../../Header';
import { Footer } from '../../../Footer';
import { Footer2 } from '../../../Footer2';
import '../../../../styles/webCourses/BeginnerWebCourse/Lesson1.css';
import typescript from '../../../../pages/webCourses/BeginnerWebCourse/images/typescript.png';
import react2 from '../../../../pages/webCourses/BeginnerWebCourse/images/react2.png';
import react3 from '../../../../pages/webCourses/BeginnerWebCourse/images/react3.png';
import components from '../../../../pages/webCourses/BeginnerWebCourse/images/components.png';
import types from '../../../../pages/webCourses/BeginnerWebCourse/images/types.png';
import props from '../../../../pages/webCourses/BeginnerWebCourse/images/props.png';
import useStatee from '../../../../pages/webCourses/BeginnerWebCourse/images/useState.png';
import useeffectt from '../../../../pages/webCourses/BeginnerWebCourse/images/useeffectt.png';
import onclickk from '../../../../pages/webCourses/BeginnerWebCourse/images/onclickk.png';
import generics from '../../../../pages/webCourses/BeginnerWebCourse/images/generics.png';
import workspaceSetup from '../../../../pages/webCourses/BeginnerWebCourse/images/workspaceSetup.png';
import vsc from '../../../../pages/webCourses/BeginnerWebCourse/images/vsc.png';
import projectStructureExample from '../../../../pages/webCourses/BeginnerWebCourse/images/projectStructureExample.png';
import nodeModulesExample from '../../../../pages/webCourses/BeginnerWebCourse/images/node_modules.png';
import { useAuth0 } from '@auth0/auth0-react';

export function Lesson6() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(true);
    const [feedbackSubmitted, setFeedbackSubmitted] = useState<boolean>(false);
    const location = useLocation();

    const lessonId = 6;
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
        const lessonId = 6;

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
        navigate(`/course/${courseId}/lesson/7`);
    };

    const handlePreviousLesson = async () => {
        await updateProgress();
        navigate(`/course/${courseId}/lesson/5`);
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className='mainContainer'>
            <Header bgColor="rgb(247, 250, 251)" />
            <div className='lessonIntroduction'>
                <h1>FINAL PROJECT</h1>
                <p>Welcome to <b>Lesson 6</b> of the <b>Beginner Web Development course</b>.</p>
            </div>
            <div className='aboutBeginnerWeb'>
                <div className="aboutCourseDiv2" style={{ paddingBottom: '7em' }}>
                    <div className="introductionDiv">WORKSPACE SETUP</div>

                    <div className="frontImageBeginner">
                        <h1 className="headerDivText" style={{ fontSize: '1.7em' }}>
                            <div className="headerContainer" style={{ width: 'fit-content' }}>
                                INTRODUCTION
                            </div>
                            <div className="imageContainer">
                                <img src={workspaceSetup} alt="" className="imageForCourse" />
                            </div>
                        </h1>
                    </div>

                    <div className="descriptionOfCourse">
                        In this lesson you will learn how to set up your workspace for the final project. We will be using <b>React</b> and <b>TypeScript</b> to build a simple web application. Tools like <b>Visual Studio Code</b> and <b>Node.js</b> will be used to create a development environment. This lesson will cover setting up the project, installing dependencies, and understanding the folder structure.
                    </div>
                </div>

                <div className="aboutCourseDiv2" style={{ paddingBottom: '2em' }}>
                    <div className="introductionDiv">VISUAL STUDIO CODE</div>
                    <div className="frontImageBeginner">
                        <h1 className="headerDivText" style={{ fontSize: '1.7em' }}>
                            <div className="headerContainer" style={{ width: 'fit-content' }}>
                                SET UP YOUR WORKSPACE
                            </div>
                            <div className="imageContainer">
                                <img src={vsc} alt="" className="imageForCourse" onClick={() => window.open('https://code.visualstudio.com/', '_blank')} style={{ cursor: 'pointer' }} />
                            </div>
                        </h1>
                    </div>

                    <div className="descriptionOfCourse">
                        Go to official website of <b>Visual Studio Code</b> and download the latest version. After downloading, install it on your computer. Once installed, open Visual Studio Code and create a new folder for your project. This will be your workspace where you will write your code.
                    </div>
                </div>

                <div className="aboutCourseDiv2" style={{ marginBottom: '-8em', marginTop: '6em' }}>
                    <div className="introductionDiv" style={{ marginLeft: '0.2em' }}>CREATING INTIAL REACT APP</div>
                    <div className="frontImageBeginner">
                        <h1 className="headerDivText" style={{ fontSize: '1.7em' }}>
                            <div className="headerContainer" style={{ width: 'fit-content', marginLeft: '0.1em' }}>
                                INSTALLING DEPENDENCIES
                            </div>
                        </h1>
                    </div>
                </div>
                <div className='key-areas2'>
                    <div className="imageContainerWebBeginner">
                        <img src={react2} alt="" className="imageForWebBeginner" />
                        <div className="overlay">
                            <div className='keyAreasOfBeginnerWebDev2' style={{ marginTop: '3em' }}><strong>Creating React project</strong>
                                <div className='keyDescription'>
                                    To create a new React project, open the terminal in Visual Studio Code in your folder and run the following command:
                                    <br></br>
                                    <br></br>
                                    <b>npx create-react-app my-app-name</b>
                                    <ul>
                                        <li>
                                            Replace my-app-name with your desired project name. This command will create a new folder with the specified name and set up a basic React application structure.
                                        </li>
                                        <li>
                                            You will see a lot of files and folders created. The most important ones are src folder, which contains your source code, and package.json, which lists your project dependencies.
                                        </li>
                                        <li>
                                            After the installation is complete, navigate to your project folder using the command:
                                            <br></br>
                                            <b>cd my-app-name</b>
                                        </li>
                                    </ul>
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
                    <div className="introductionDiv">FOLDER STRUCTURE</div>
                    <div className="frontImageBeginner">
                        <h1 className="headerDivText" style={{ fontSize: '1.7em' }}>
                            <div className="headerContainer" style={{ width: 'fit-content' }}>
                                Understanding the Folder Structure
                            </div>
                            <div className="imageContainer">
                                <img src={components} alt="" className="imageForCourse" onClick={() => window.open('/showCase1Lesson5/lesson5', '_blank')}
                                    style={{ cursor: 'pointer' }} />
                            </div>
                        </h1>
                    </div>

                    <div className="descriptionOfCourse" style={{ marginBottom: '3em' }}>
                        This section will help you understand the folder structure of a React project. The most important folders are:
                        <br></br>
                        <br></br>
                        <b>Components</b><br></br>
                        <ul>
                            <li>
                                This folder contains all your React components. Each component should have its own folder with a separate file for the component code and styles.
                            </li>
                            <li>
                                Components are reusable pieces of code that can be used throughout your application.
                            </li>
                            <li>
                                Examples of components are Header, Footer, SideBar and many more.
                            </li>
                        </ul>
                        <b>Images:</b><br></br>
                        <ul>
                            <li>
                                This folder contains all your images and assets used in your application. You can create subfolders to organize your images.
                            </li>
                        </ul>
                        <b>Pages:</b><br></br>
                        <ul>
                            <li>
                                This folder contains all your pages used in your application. Each page should have its own folder with a separate file for the page code and styles.
                            </li>
                            <li>
                                Pages are the main components of your application that are displayed to the user. This is where you will create your main components like Home, About, Contact and many more.
                            </li>
                        </ul>
                        <b>Styles:</b><br></br>
                        <ul>
                            <li>
                                This folder contains all your styles used in your application. You can create subfolders to organize your styles.
                            </li>
                            <li>
                                Styles folder contains all your CSS files used in your application.
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
                        In this lesson you learned how to set up your workspace for the final project. You learned how to install Visual Studio Code and create a new folder for your project. You also learned how to create a new React project using the command <b>npx create-react-app my-app-name</b>. You learned how to install additional dependencies like <b>React Router</b> and <b>Axios</b>. Finally, you learned about the folder structure of a React project and how to organize your components, styles, and assets.
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
