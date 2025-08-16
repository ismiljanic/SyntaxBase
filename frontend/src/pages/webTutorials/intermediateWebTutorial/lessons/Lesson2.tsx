import { Header } from '../../../Header';
import { Footer } from '../../../Footer';
import { Footer2 } from '../../../Footer2';
import react from '../../../../pages/webCourses/BeginnerWebCourse/images/react.png';
import details from '../../../../pages/webCourses/BeginnerWebCourse/images/details.png';

export function IntermediateWebTutorialLesson2() {

    const handleNextLesson = async () => {
        window.location.href = `/intermediateWebTutorial/lesson/3`;
    };

    const handlePreviousLesson = async () => {
        window.location.href = `/intermediateWebTutorial/lesson/1`;
    };

    return (
        <div className='mainContainer'>
            <Header bgColor="rgb(247, 250, 251)" />
            <div className='lessonIntroduction'>
                <h1>Introduction to React Basics and Routing</h1>
                <p>Welcome to <b>Lesson 2</b> of the <b>Intermediate Web Development Tutorial</b>.</p>
            </div>
            <div className='aboutBeginnerWeb'>
                <div className="aboutCourseDiv2" style={{ paddingBottom: '7em' }}>
                    <div className="introductionDiv">Introduction</div>
                    <div className="frontImageBeginner">
                        <h1 className="headerDivText" style={{ fontSize: '1.7em' }}>
                            <div className="headerContainer" style={{ width: 'fit-content' }}>
                                Getting Started with React
                            </div>
                            <div className="imageContainer">
                                <img src={react} alt="" className="imageForCourse" />
                            </div>
                        </h1>
                    </div>

                    <div className="descriptionOfCourse">
                        In this lesson, we'll dive into the fundamentals of React.
                        You will learn how to create components, manage JSX syntax, and understand React's component lifecycle.
                        Additionally, we'll cover routing with React Router to enable navigation between pages.
                    </div>
                </div>
                <div className="aboutCourseDiv2" style={{ paddingBottom: '2em' }}>
                    <div className="introductionDiv">Semantic HTML</div>
                    <div className="frontImageBeginner">
                        <h1 className="headerDivText" style={{ fontSize: '1.7em' }}>
                            <div className="headerContainer" style={{ width: 'fit-content' }}>
                                Why Semantics Matter
                            </div>
                            <div className="imageContainer">
                                <img src={details} alt="" className="imageForCourse" />
                            </div>
                        </h1>
                    </div>

                    <div className="descriptionOfCourse">
                        React components allow you to build reusable UI elements.
                        JSX is a syntax extension that looks like HTML but compiles to JavaScript.
                        Understanding how to structure components and pass props is crucial for scalable React applications.
                    </div>
                    <p className='paragraphP' style={{ paddingTop: '9em' }}>
                        For example:
                        <code>
                            &lt;<span style={{ color: 'rgb(97, 218, 251)' }}>MyComponent</span> /&gt;
                        </code>
                        is a React component instance.
                        <br />
                        Components can be functional or class-based.
                        <div className='htmlElementsDiv'>
                            <ul>
                                <li><code>Functional Components</code> - simple, stateless components</li>
                                <li><code>Class Components</code> - components with state and lifecycle methods</li>
                                <li><code>JSX Syntax</code> - JavaScript XML for templating UI</li>
                            </ul>
                        </div>
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
                        This lesson covered the basics of React components, JSX, and routing.
                        You now know how to build reusable UI elements and navigate your application efficiently.
                        In the next lesson, we will explore state management using React hooks.
                    </div>

                    <div className='key-areas3' style={{ marginTop: '-10em' }}>
                        <div className="imageContainerWebBeginner2">
                            <img src={react} alt="React Logo" className="imageForWebBeginner2" />
                            <div className="overlay">
                                <div className='keyAreasOfBeginnerWebDev3'>
                                    <strong>React Components:</strong>
                                    <div className='keyDescription2'>
                                        Reusable building blocks of your UI that encapsulate logic and presentation.
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="imageContainerWebBeginner2">
                            <img src={react} alt="React Logo" className="imageForWebBeginner2" />
                            <div className="overlay">
                                <div className='keyAreasOfBeginnerWebDev3'>
                                    <strong>Routing:</strong>
                                    <div className='keyDescription2'>
                                        <ul>
                                            <li>Configure multiple routes and nested paths</li>
                                            <li>Use <code>&lt;Link&gt;</code> to navigate without reload</li>
                                            <li>Access route parameters for dynamic content</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div style={{ display: 'flex' }}>
                <div className='moreCoursesDiv' onClick={handleNextLesson}>
                    Next Lesson
                </div>
                <div className='goToPreviousLessonDiv' onClick={handlePreviousLesson} style={{ marginLeft: '-77.5em' }}>
                    Previous Lesson
                </div>
            </div>
            <Footer2 bgColor="rgb(247, 250, 251)" />
            <Footer bgColor="rgb(247, 250, 251)" />
        </div>
    );
}