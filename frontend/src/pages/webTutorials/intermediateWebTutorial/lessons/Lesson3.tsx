import { Header } from '../../../Header';
import { Footer } from '../../../Footer';
import { Footer2 } from '../../../Footer2';
import react from '../../../../pages/webCourses/BeginnerWebCourse/images/react.png';
import details from '../../../../images/image2.png';

export function IntermediateWebTutorialLesson3() {

    const handleNextLesson = async () => {
        window.location.href = `/intermediateWebTutorial/lesson/4`;
    };

    const handlePreviousLesson = async () => {
        window.location.href = `/intermediateWebTutorial/lesson/2`;
    };

    return (
        <div className='mainContainer'>
            <Header bgColor="rgb(247, 250, 251)" />
            <div className='lessonIntroduction'>
                <h1>Introduction to State Management in React</h1>
                <p>Welcome to <b>Lesson 3</b> of the <b>Intermediate Web Development Tutorial</b>.</p>
            </div>
            <div className='aboutBeginnerWeb'>
                <div className="aboutCourseDiv2" style={{ paddingBottom: '7em' }}>
                    <div className="introductionDiv">Introduction</div>
                    <div className="frontImageBeginner">
                        <h1 className="headerDivText" style={{ fontSize: '1.7em' }}>
                            <div className="headerContainer" style={{ width: 'fit-content' }}>
                                Managing State in React
                            </div>
                            <div className="imageContainer">
                                <img src={react} alt="" className="imageForCourse" />
                            </div>
                        </h1>
                    </div>

                    <div className="descriptionOfCourse">
                        In this lesson, we’ll explore how React handles data that changes over time.
                        You’ll learn about the <code>useState</code> and <code>useReducer</code> hooks,
                        how to lift state up to share it between components, and how to avoid common pitfalls like unnecessary re-renders.
                    </div>
                </div>
                <div className="aboutCourseDiv2" style={{ paddingBottom: '2em' }}>
                    <div className="introductionDiv">Core State Management Concepts</div>
                    <div className="frontImageBeginner">
                        <h1 className="headerDivText" style={{ fontSize: '1.7em' }}>
                            <div className="headerContainer" style={{ width: 'fit-content' }}>
                                From Counters to Complex Forms
                            </div>
                            <div className="imageContainer">
                                <img src={details} alt="" className="imageForCourse" />
                            </div>
                        </h1>
                    </div>

                    <div className="descriptionOfCourse">
                        State lets components remember information between renders.
                        Understanding how to update state correctly is essential for building interactive apps.
                        We’ll also cover derived state, controlled inputs, and strategies for managing global state without overcomplicating your code.
                    </div>
                    <p className='paragraphP' style={{ paddingTop: '9em' }}>
                        Examples include:
                        <div className='htmlElementsDiv'>
                            <ul>
                                <li><code>useState</code> - local state for simple components</li>
                                <li><code>useReducer</code> - managing more complex state logic</li>
                                <li><b>Lifting State Up</b> - sharing state between components</li>
                                <li><b>Prop Drilling</b> - passing state through many layers (and why to avoid it)</li>
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
                        This lesson introduced the core concepts of React state management.
                        You now understand how to store, update, and share state effectively.
                        In the next lesson, we will focus on connecting our frontend state with backend data sources.
                    </div>

                    <div className='key-areas3' style={{ marginTop: '-10em' }}>
                        <div className="imageContainerWebBeginner2">
                            <img src={react} alt="React Logo" className="imageForWebBeginner2" />
                            <div className="overlay">
                                <div className='keyAreasOfBeginnerWebDev3'>
                                    <strong>State Hooks:</strong>
                                    <div className='keyDescription2'>
                                        <ul>
                                            <li>Store dynamic values across renders</li>
                                            <li>Trigger UI updates on state change</li>
                                            <li>Manage both local and global state</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="imageContainerWebBeginner2">
                            <img src={react} alt="React Logo" className="imageForWebBeginner2" />
                            <div className="overlay">
                                <div className='keyAreasOfBeginnerWebDev3'>
                                    <strong>Best Practices:</strong>
                                    <div className='keyDescription2'>
                                        <ul>
                                            <li>Avoid deeply nested state structures</li>
                                            <li>Use controlled components for forms</li>
                                            <li>Keep state as close as possible to where it’s needed</li>
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