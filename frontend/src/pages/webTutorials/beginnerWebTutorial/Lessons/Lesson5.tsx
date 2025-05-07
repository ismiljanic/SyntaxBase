import { Header } from '../../../Header';
import { Footer } from '../../../Footer';
import { Footer2 } from '../../../Footer2';
import '../../../../styles/webCourses/BeginnerWebCourse/Lesson1.css';
import react from '../../../../pages/webCourses/BeginnerWebCourse/images/react.png';
import typescript from '../../../../pages/webCourses/BeginnerWebCourse/images/typescript.png';
import typescript2 from '../../../../pages/webCourses/BeginnerWebCourse/images/typescript2.png';
import react2 from '../../../../pages/webCourses/BeginnerWebCourse/images/react2.png';
import react3 from '../../../../pages/webCourses/BeginnerWebCourse/images/react3.png';
import magic from '../../../../pages/webCourses/BeginnerWebCourse/images/magic.png';

export function BeginnerWebTutorialLesson5() {

    const handleNextLesson = async () => {
        window.location.href = `/beginnerWebTutorial/finish`;
    };

    const handlePreviousLesson = async () => {
        window.location.href = `/beginnerWebTutorial/lesson/4`;
    };


    return (
        <div className='mainContainer'>
            <Header bgColor="rgb(247, 250, 251)" />
            <div className='lessonIntroduction'>
                <h1>TypeScript and React</h1>
                <p>Welcome to <b>Lesson 5</b> of the <b>Beginner Web Development tutorial</b>.</p>
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
