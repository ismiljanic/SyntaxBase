import { Header } from '../../../Header';
import { Footer } from '../../../Footer';
import { Footer2 } from '../../../Footer2';
import react from '../../../../pages/webCourses/BeginnerWebCourse/images/react.png';
import typescript from '../../../../images/typescript1.png';
import api from '../../../../images/ctxapi.png';
import state from '../../../../images/state.png';
import axioss from '../../../../images/axios.png';

export function IntermediateWebTutorialLesson4() {

    const handleNextLesson = async () => {
        window.location.href = `/intermediateWebTutorial/lesson/5`;
    };

    const handlePreviousLesson = async () => {
        window.location.href = `/intermediateWebTutorial/lesson/3`;
    };

    return (
        <div className='mainContainer'>
            <Header bgColor="rgb(247, 250, 251)" />
            <div className='lessonIntroduction'>
                <h1>Introduction to Advanced State Management and Data Fetching</h1>
                <p>Welcome to <b>Lesson 4</b> of the <b>Intermediate Web Development Tutorial</b>.</p>
            </div>
            <div className='aboutBeginnerWeb'>
                <div className="aboutCourseDiv2" style={{ paddingBottom: '7em' }}>
                    <div className="introductionDiv">INTRODUCTION</div>

                    <div className="frontImageBeginner">
                        <h1 className="headerDivText" style={{ fontSize: '1.7em' }}>
                            <div className="headerContainer" style={{ width: 'fit-content' }}>
                                Managing State Like a Pro
                            </div>
                            <div className="imageContainer">
                                <img src={react} alt="" className="imageForCourse" onClick={() => window.open('https://react.dev/', '_blank')} style={{ cursor: 'pointer' }} />
                            </div>
                        </h1>
                    </div>

                    <div className="descriptionOfCourse">
                        In this lesson, you’ll learn how to handle state beyond useState basics.
                        We’ll explore techniques for managing complex and shared state, introduce the Context API, and use useReducer for more predictable state transitions.
                        You’ll see how these tools can help keep your application scalable and maintainable.
                    </div>
                </div>

                <div className="aboutCourseDiv2" style={{ paddingBottom: '2em' }}>
                    <div className="introductionDiv">SECOND SECTION</div>
                    <div className="frontImageBeginner">
                        <h1 className="headerDivText" style={{ fontSize: '1.7em' }}>
                            <div className="headerContainer" style={{ width: 'fit-content' }}>
                                Data Fetching and Synchronization
                            </div>
                            <div className="imageContainer">
                                <img src={typescript} alt="" className="imageForCourse" onClick={() => window.open('https://www.typescriptlang.org/', '_blank')}
                                    style={{ cursor: 'pointer' }} />
                            </div>
                        </h1>
                    </div>

                    <div className="descriptionOfCourse">
                        We’ll dive into retrieving data from APIs, handling loading and error states, and updating the UI when backend data changes.
                        You’ll also learn how to optimize state updates to reduce unnecessary re-renders, making your apps faster and more responsive.
                    </div>
                </div>

                <div className="aboutCourseDiv2" style={{ marginBottom: '-8em', marginTop: '6em' }}>
                    <div className="introductionDiv" style={{ marginLeft: '0.2em' }}>Why Would You Use This?</div>
                    <div className="frontImageBeginner">
                        <h1 className="headerDivText" style={{ fontSize: '1.7em' }}>
                            <div className="headerContainer" style={{ width: 'fit-content', marginLeft: '0.1em' }}>
                                Example highlights
                            </div>
                        </h1>
                    </div>
                </div>
                <div className='key-areas2'>
                    <div className="imageContainerWebBeginner">
                        <img src={api} alt="" className="imageForWebBeginner" />
                        <div className="overlay">
                            <div className='keyAreasOfBeginnerWebDev'>
                                <strong>Context API</strong>
                                <div className='keyDescription'>
                                    Share state across deeply nested components without prop drilling
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="imageContainerWebBeginner">
                        <img src={state} alt="" className="imageForWebBeginner" />
                        <div className="overlay">
                            <div className='keyAreasOfBeginnerWebDev2'><strong>useReducer</strong>
                                <div className='keyDescription'>
                                    Manage complex state updates with a predictable pattern
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="imageContainerWebBeginner">
                        <img src={axioss} alt="" className="imageForWebBeginner" />
                        <div className="overlay">
                            <div className='keyAreasOfBeginnerWebDev'>
                                <strong>Data fetching and Performance</strong>
                                <div className='keyDescription'>
                                    Using fetch or axios effectively. Memoizing expensive calculations and components
                                </div>
                            </div>
                        </div>
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
                        This lesson covered advanced state management techniques and real-world data fetching patterns. You can now synchronize your UI with backend data efficiently while keeping your components lean.
                        In the next lesson, we’ll focus on component composition and code organization for long-term scalability.
                    </div>

                    <div className='key-areas3' style={{ marginTop: '-10em' }}>
                        <div className="imageContainerWebBeginner2">
                            <img src={react} alt="" className="imageForWebBeginner2" />
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
            <div style={{ display: 'flex' }}>
                <div className='moreCoursesDiv' onClick={handleNextLesson}>
                    Next Lesson
                </div>
                <div className='goToPreviousLessonDiv' onClick={handlePreviousLesson} style={{ marginLeft: '-78.3em' }}>
                    Previous Lesson
                </div>
            </div>
            <Footer2 bgColor="rgb(247, 250, 251)" />
            <Footer bgColor="rgb(247, 250, 251)" />
        </div >
    );
}