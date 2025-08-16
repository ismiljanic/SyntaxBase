import { Header } from '../../..//Header';
import { Footer } from '../../../Footer';
import { Footer2 } from '../../../Footer2';
import react from '../../../../pages/webCourses/BeginnerWebCourse/images/react.png';
import useEff from '../../../webCourses/AdvancedWebCourse/images/useEffect.png';

export function AdvancedWebTutorialLesson2() {

    const handleNextLesson = async () => {
        window.location.href = `/advancedWebTutorial/lesson/3`;
    };

    const handlePreviousLesson = async () => {
        window.location.href = `/advancedWebTutorial/lesson/1`;
    };

    return (
        <div className='mainContainer'>
            <Header bgColor="rgb(247, 250, 251)" />
            <div className='lessonIntroduction'>
                <h1>Advanced React Patterns</h1>
                <p>Welcome to <b>Lesson 2</b> of the <b>Intermediate Web Development Tutorial</b>.</p>
            </div>
            <div className='aboutBeginnerWeb'>
                <div className="aboutCourseDiv2" style={{ paddingBottom: '7em' }}>
                    <div className="introductionDiv">Introduction</div>
                    <div className="frontImageBeginner">
                        <h1 className="headerDivText" style={{ fontSize: '1.7em' }}>
                            <div className="headerContainer" style={{ width: 'fit-content' }}>
                                Elevating React Skills
                            </div>
                            <div className="imageContainer">
                                <img src={react} alt="React Logo" className="imageForCourse" />
                            </div>
                        </h1>
                    </div>

                    <div className="descriptionOfCourse">
                        In this lesson, we'll explore advanced React patterns that help you manage state, lifecycle, and component composition in large-scale applications.
                        You'll learn how to leverage React Hooks, Context API, and custom patterns for more maintainable and scalable code.
                    </div>
                </div>

                <div className="aboutCourseDiv2" style={{ paddingBottom: '7em' }}>
                    <div className="introductionDiv">Hooks in Depth</div>
                    <div className="frontImageBeginner">
                        <h1 className="headerDivText" style={{ fontSize: '1.7em' }}>
                            <div className="headerContainer" style={{ width: 'fit-content' }}>
                                Managing State and Effects
                            </div>
                            <div className="imageContainer">
                                <img src={useEff} alt="Hooks Illustration" className="imageForCourse" />
                            </div>
                        </h1>
                    </div>

                    <div className="descriptionOfCourse">
                        React Hooks let you use state and lifecycle features in functional components.
                        Learn the most common hooks:
                        <ul>
                            <li><code>useState</code> - local state management</li>
                            <li><code>useEffect</code> - handle side effects like data fetching</li>
                            <li><code>useReducer</code> - complex state logic</li>
                            <li><code>useCallback</code> / <code>useMemo</code> - performance optimization</li>
                        </ul>
                    </div>
                </div>

                <div className="aboutCourseDiv2" style={{ paddingBottom: '7em' }}>
                    <div className="introductionDiv">Context API</div>
                    <div className="frontImageBeginner">
                        <h1 className="headerDivText" style={{ fontSize: '1.7em' }}>
                            <div className="headerContainer" style={{ width: 'fit-content' }}>
                                Sharing State Across Components
                            </div>
                            <div className="imageContainer">
                                <img src={react} alt="Context API" className="imageForCourse" />
                            </div>
                        </h1>
                    </div>

                    <div className="descriptionOfCourse">
                        Context API allows you to share global data across components without prop drilling.
                        Example use cases:
                        <ul>
                            <li>Theme settings</li>
                            <li>Authenticated user data</li>
                            <li>Global configuration or feature flags</li>
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
                        <div className='moreCoursesDiv' onClick={handleNextLesson}>Next Lesson</div>
                        <div className='goToPreviousLessonDiv' onClick={handlePreviousLesson} style={{ marginLeft: '-77.5em' }}>Previous Lesson</div>
                    </div>
            <Footer2 bgColor="rgb(247, 250, 251)" />
            <Footer bgColor="rgb(247, 250, 251)" />
        </div >
    );
}