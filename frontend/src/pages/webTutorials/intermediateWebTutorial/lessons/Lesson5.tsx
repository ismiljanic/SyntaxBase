import { Header } from '../../../Header';
import { Footer } from '../../../Footer';
import { Footer2 } from '../../../Footer2';
import react from '../../../../pages/webCourses/BeginnerWebCourse/images/react2.png';
import api from '../../../../images/ctxapi.png';
import nodejs from '../../../../images/nodejs.png';

export function IntermediateWebTutorialLesson5() {

    const handleNextLesson = async () => {
        window.location.href = `/tutorial/finish`;
    };

    const handlePreviousLesson = async () => {
        window.location.href = `/intermediateWebTutorial/lesson/4`;
    };

    return (
        <div className='mainContainer'>
            <Header bgColor="rgb(247, 250, 251)" />
            <div className='lessonIntroduction'>
                <h1>BACKEND INTRODUCTION</h1>
                <p>Welcome to <b>Lesson 5</b> of the <b>Intermediate Web Development Tutorial</b>.</p>
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
                                <img src={api} alt="Backend" className="imageForCourse" />
                            </div>
                        </h1>
                    </div>
                    <div className="descriptionOfCourse">
                        In this lesson, we will introduce you to the world of backend development. Unlike frontend, which focuses on what users see and interact with, backend development handles the server, database, and application logic behind the scenes.
                        <br /><br />
                        You will learn why backend is critical in full stack applications, including managing data, handling user authentication, and integrating APIs. Understanding backend basics will empower you to build more dynamic, secure, and scalable web applications.
                    </div>
                </div>

                <div className="aboutCourseDiv2" style={{ paddingBottom: '0em' }}>
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
                        <img src={nodejs} alt="" className="imageForWebBeginner" />
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
                        <img src={react} alt="" className="imageForWebBeginner" />
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
                        <img src={react} alt="" className="imageForWebBeginner" />
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

                <div style={{ display: 'flex' }}>
                    <div className='moreCoursesDiv' onClick={handleNextLesson}>
                        Finish Tutorial
                    </div>
                    <div className='goToPreviousLessonDiv' onClick={handlePreviousLesson} style={{ marginLeft: '-78.3em' }}>
                        Previous Lesson
                    </div>
                </div>
                <Footer2 bgColor="rgb(247, 250, 251)" />
                <Footer bgColor="rgb(247, 250, 251)" />
            </div >
        </div>
    );
}