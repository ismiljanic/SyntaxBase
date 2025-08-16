import { Header } from '../../../Header';
import { Footer } from '../../../Footer';
import { Footer2 } from '../../../Footer2';
import vsc from '../../../../images/vsc2.png'
import nodejs from '../../../../images/nodejs.png'
import git from '../../../../images/gith.png'
import rt from '../../../../images/rt.png'
import image1 from '../../../../images/helpMe.png'
import image2 from '../../../../images/image1.png'
import image3 from '../../../../images/image2.png'
import image4 from '../../../../images/image3.png'

export function IntermediateWebTutorialLesson1() {

    const handleNextLesson = async () => {
        window.location.href = `/intermediateWebTutorial/lesson/2`;
    };

    return (
        <div className='mainContainer'>
            <Header bgColor="rgb(247, 250, 251)" />
            <div className='lessonIntroduction'>
                <h1>Introduction to Web Development</h1>
                <p>Welcome to <b>Lesson 1</b> of the <b>Intermediate Web Development Tutorial</b>.</p>
            </div>
            <div className='aboutBeginnerWeb'>
                <div className="aboutCourseDiv2" style={{ paddingBottom: '7em' }}>
                    <div className="introductionDiv">Core Tools & Installation</div>
                    <div className="frontImageBeginner">
                        <h1 className="headerDivText" style={{ fontSize: '1.7em' }}>
                            <div className="headerContainer" style={{ width: 'fit-content' }}>
                                Visual Studio Code (VSCode)
                            </div>
                            <div className="imageContainer">
                                <img src={vsc} alt="" className="imageForCourse" />
                            </div>
                        </h1>
                    </div>

                    <div className="descriptionOfCourse">
                        A lightweight yet powerful code editor. Install extensions like React/TS plugin to start with your workflow.
                    </div>
                </div>
                <div className="aboutCourseDiv2" style={{ marginBottom: '-8em' }}>
                    <div className="introductionDiv" style={{ marginLeft: '0.2em' }}>Node.js & npm</div>
                    <div className="frontImageBeginner">
                        <h1 className="headerDivText" style={{ fontSize: '1.7em' }}>
                            <div className="headerContainer" style={{ width: 'fit-content', marginLeft: '0.1em' }}>
                                Node.js & npm
                            </div>
                        </h1>
                    </div>
                </div>
                <div className='key-areas2'>
                    <div className="imageContainerWebBeginner">
                        <img src={git} alt="" className="imageForWebBeginner" />
                        <div className="overlay">
                            <div className='keyAreasOfBeginnerWebDev'>
                                <strong>Git & GitHub</strong>
                                <div className='keyDescription'>
                                    Learn to clone, commit, push, and branch effectively. Use GitHub for remote repo hosting and collaboration—even if it’s just you for now.
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="imageContainerWebBeginner">
                        <img src={nodejs} alt="" className="imageForWebBeginner" />
                        <div className="overlay">
                            <div className='keyAreasOfBeginnerWebDev2'><strong>Modern Project Structure</strong>
                                <div className='keyDescription'>
                                    We’ll use a modern <b>React + TypeScript</b> template with a structured folder layout. This mirrors what you’d see in professional codebases and prepares you for scalable application development.
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="imageContainerWebBeginner">
                        <img src={rt} alt="" className="imageForWebBeginner" />
                        <div className="overlay">
                            <div className='keyAreasOfBeginnerWebDev' style={{ marginTop: '-12em' }}>
                                <strong>Beyond the Basics</strong>
                                <div className='keyDescription'>
                                    Learn the foundations of efficient, real-world workflows:
                                    <ul>
                                        <li>Terminal commands & shortcuts</li>
                                        <li>Running local development servers</li>
                                        <li>Running TypeScript compilers and tests</li>
                                    </ul>
                                    These habits and tools will follow you throughout the course and into professional settings.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <h3 className='subsection-title'>Command-Line Tools & Scripts</h3>
                <p className='paragraph'>The internet is the backbone of modern society. Businesses, educational institutions, and entertainment industries all rely on websites and web applications to connect with users and provide services. Learning web development empowers you to create engaging and interactive digital experiences, no matter your goals.</p>
                <div className='beginnerPictureContainer'>
                    <div className="imageWithDescription">
                        <img src={image1} alt="" className="courseImage" style={{ width: '50em', height: '30em' }} />
                        <div className="imageDescription">Developer Workflows</div>
                    </div>
                    <div className="imageWithDescription">
                        <img src={image2} alt="" className="courseImage" style={{ width: '50em', height: '30em' }} />
                        <div className="imageDescription">Continuous Learning</div>
                    </div>
                    <div className="imageWithDescription">
                        <img src={image3} alt="" className="courseImage" style={{ width: '50em', height: '30em' }} />
                        <div className="imageDescription">Build Your Own Projects</div>
                    </div>
                    <div className="imageWithDescription">
                        <img src={image4} alt="" className="courseImage" style={{ width: '50em', height: '30em' }} />
                        <div className="imageDescription">Beyond the Basics</div>
                    </div>
                </div>
                <div style={{ display: 'flex', marginTop: '5em' }}>
                    <div className='moreCoursesDiv' onClick={handleNextLesson}>
                        Next Lesson
                    </div>
                </div>
            </div>
            <Footer2 bgColor="rgb(247, 250, 251)" />
            <Footer bgColor="rgb(247, 250, 251)" />
        </div>
    );
}