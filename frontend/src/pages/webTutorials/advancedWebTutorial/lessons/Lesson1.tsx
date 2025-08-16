import { Header } from '../../..//Header';
import { Footer } from '../../../Footer';
import { Footer2 } from '../../../Footer2';
import lesson11 from '../../../webCourses/AdvancedWebCourse/images/lesson11.png'
import lesson12 from '../../../webCourses/AdvancedWebCourse/images/lesson12.png';
import spb from '../../../webCourses/AdvancedWebCourse/images/spb.png';
import lesson14 from '../../../webCourses/AdvancedWebCourse/images/lesson14.png';
import lesson15 from '../../../webCourses/AdvancedWebCourse/images/lesson15.png';
import wf from '../../../webCourses/AdvancedWebCourse/images/wf.png';
import wf2 from '../../../webCourses/AdvancedWebCourse/images/wf2.png';
import pic1 from '../../../webCourses/AdvancedWebCourse/images/pic1.png';
import commandLine from '../../../webCourses/AdvancedWebCourse/images/commandLine.png';

export function AdvancedWebTutorialLesson1() {

    const handleNextLesson = async () => {
        window.location.href = `/advancedWebTutorial/lesson/2`;
    };

    return (
        <div className='mainContainer'>
            <Header bgColor="rgb(247, 250, 251)" />
            <div className='lessonIntroduction'>
                <h1>Lesson 1: Advanced Development Environment & Tooling</h1>
                <p>Welcome to the <b>Advanced Web Development Tutorial</b>. In this lesson, we’ll configure a professional development environment optimized for building full-stack applications with <b>React, TypeScript, Spring Boot, and PostgreSQL</b>.</p>
            </div>
            <div className='aboutBeginnerWeb'>
                <div className="aboutCourseDiv2" style={{ paddingBottom: '7em' }}>
                    <div className="introductionDiv">Your Developer Toolkit</div>
                    <div className="frontImageBeginner">
                        <h1 className="headerDivText" style={{ fontSize: '1.7em' }}>
                            <div className="headerContainer" style={{ width: 'fit-content' }}>
                                Setting Up for Advanced Development
                            </div>
                            <div className="imageContainer">
                                <img src={lesson11} alt="" className="imageForCourse" />
                            </div>
                        </h1>
                    </div>
                    <div className="descriptionOfCourse">
                        A robust toolset is critical for building scalable, production-ready applications. In this lesson, we’ll set up:
                        <b> VSCode</b> with professional extensions, <b>Java & Spring Boot</b>, <b>Git & GitHub workflows</b>, and a <b>TypeScript + React project template</b>.
                    </div>
                </div>
                <div className="aboutCourseDiv2" style={{ marginBottom: '-8em' }}>
                    <div className="introductionDiv" style={{ marginLeft: '0.2em' }}>KEY AREAS</div>
                    <div className="frontImageBeginner">
                        <h1 className="headerDivText" style={{ fontSize: '1.7em' }}>
                            <div className="headerContainer" style={{ width: 'fit-content', marginLeft: '0.1em' }}>
                                Essential Tools & Setup
                            </div>
                        </h1>
                    </div>
                </div>
                <div className='key-areas2'>
                    <div className="imageContainerWebBeginner">
                        <img src={lesson14} alt="" className="imageForWebBeginner" />
                        <div className="overlay">
                            <div className='keyAreasOfBeginnerWebDev'>
                                <strong>VSCode + Extensions</strong>
                                <div className='keyDescription'>
                                    Configure advanced extensions for React, TypeScript, Prettier, ESLint, and Git integration to streamline coding and maintain consistency.
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="imageContainerWebBeginner">
                        <img src={spb} alt="" className="imageForWebBeginner" />
                        <div className="overlay">
                            <div className='keyAreasOfBeginnerWebDev2'>
                                <strong>Spring Boot & Java</strong>
                                <div className='keyDescript ion'>
                                    Install and configure Spring Boot with Java, setting up a powerful backend framework for building RESTful APIs and microservices.
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="imageContainerWebBeginner">
                        <img src={lesson12} alt="" className="imageForWebBeginner" />
                        <div className="overlay">
                            <div className='keyAreasOfBeginnerWebDev'>
                                <strong>Git & GitHub Advanced Workflows</strong>
                                <div className='keyDescription'>
                                    Master branching, rebasing, pull requests, and merge strategies to collaborate on larger projects and maintain a clean commit history.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <h3 className='subsection-title'>Modern Project Structure</h3>
                <p className='paragraph'>
                    We’ll use a professional <b>React + TypeScript + Spring Boot</b> template with a clear folder structure, preparing you to implement a production-style full-stack application with proper separation of concerns.
                </p>

                <div className='beginnerPictureContainer' style={{ marginBottom: '7em' }}>
                    <div className="imageWithDescription">
                        <img src={lesson15} alt="" className="courseImage" style={{ width: '50em', height: '30em' }} />
                        <div className="imageDescription">Clean Modular Architecture</div>
                    </div>
                    <div className="imageWithDescription">
                        <img src={commandLine} alt="" className="courseImage" style={{ width: '50em', height: '30em' }} />
                        <div className="imageDescription">Advanced Command-Line Workflows</div>
                    </div>
                    <div className="imageWithDescription">
                        <img src={wf} alt="" className="courseImage" style={{ width: '50em', height: '30em' }} />
                        <div className="imageDescription">Professional Workflows</div>
                    </div>
                    <div className="imageWithDescription">
                        <img src={pic1} alt="" className="courseImage" style={{ width: '50em', height: '30em' }} />
                        <div className="imageDescription">Continuous Learning & Debugging</div>
                    </div>
                </div>

                <div className="aboutCourseDiv2" style={{ paddingBottom: '7em' }}>
                    <div className="introductionDiv">Developer Workflows</div>
                    <div className="frontImageBeginner">
                        <h1 className="headerDivText" style={{ fontSize: '1.7em' }}>
                            <div className="headerContainer" style={{ width: 'fit-content' }}>
                                Efficient Full-Stack Workflows
                            </div>
                            <div className="imageContainer">
                                <img src={wf2} alt="" className="imageForCourse" />
                            </div>
                        </h1>
                    </div>
                    <div className="descriptionOfCourse">
                        Learn the foundations of professional workflows that will carry you through the final project:
                        <ul>
                            <li>Managing multiple environments with npm scripts</li>
                            <li>TypeScript compilation and linting automation</li>
                            <li>Running backend Spring Boot servers and connecting to PostgreSQL</li>
                            <li>Testing and debugging full-stack applications</li>
                        </ul>
                        By mastering these practices, you’ll move smoothly into building the final Full-Stack Blood Donation Management App.
                    </div>
                </div>

                <div style={{ display: 'flex' }}>
                    <div className='moreCoursesDiv' onClick={handleNextLesson}>
                        Next Lesson
                    </div>
                </div>
                <Footer2 bgColor="rgb(247, 250, 251)" />
                <Footer bgColor="rgb(247, 250, 251)" />
            </div>
        </div>
    );
}