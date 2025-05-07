import { Header } from '../../../Header';
import { Footer } from '../../../Footer';
import { Footer2 } from '../../../Footer2';
import '../../../../styles/webCourses/BeginnerWebCourse/Lesson1.css';
import frontendBeginnerWeb from '../../../../pages/webCourses/BeginnerWebCourse/images/frontendBeginnerWeb.png';
import backendBeginnerWeb from '../../../../pages/webCourses/BeginnerWebCourse/images/backendBeginnerWeb.png';
import fsBeginnerWeb from '../../../../pages/webCourses/BeginnerWebCourse/images/fsBeginnerWeb.png';
import beginnerWebDevImage from '../../../../pages/webCourses/BeginnerWebCourse/images/beginnerWebDevImage.png';
import project1 from '../../../../pages/webCourses/BeginnerWebCourse/images/project1.png';
import firstApp from '../../../../pages/webCourses/BeginnerWebCourse/images/firstApp.png';
import contL from '../../../../pages/webCourses/BeginnerWebCourse/images/contL.png';
import web6 from '../../../../images/web6.png';

export function BeginnerWebTutorialLesson1() {

    const handleNextLesson = async () => {
        window.location.href = `/beginnerWebTutorial/lesson/2`;
    };

    return (
        <div className='mainContainer'>
            <Header bgColor="rgb(247, 250, 251)" />
            <div className='lessonIntroduction'>
                <h1>Introduction to Web Development</h1>
                <p>Welcome to <b>Lesson 1</b> of the <b>Beginner Web Development tutorial</b>.</p>
            </div>
            <div className='aboutBeginnerWeb'>
                <div className="aboutCourseDiv2" style={{ paddingBottom: '7em' }}>
                    <div className="introductionDiv">Introduction</div>
                    <div className="frontImageBeginner">
                        <h1 className="headerDivText" style={{ fontSize: '1.7em' }}>
                            <div className="headerContainer" style={{ width: 'fit-content' }}>
                                What is Web Development?
                            </div>
                            <div className="imageContainer">
                                <img src={beginnerWebDevImage} alt="" className="imageForCourse" />
                            </div>
                        </h1>
                    </div>

                    <div className="descriptionOfCourse">
                        At its core, web development refers to the creation of websites and web applications that are accessible through the internet.
                        Every website you visit, from small personal blogs to massive e-commerce platforms like Amazon, has been carefully designed and built by web developers.
                    </div>
                </div>
                <div className="aboutCourseDiv2" style={{ marginBottom: '-8em' }}>
                    <div className="introductionDiv" style={{ marginLeft: '0.2em' }}>KEY AREAS</div>
                    <div className="frontImageBeginner">
                        <h1 className="headerDivText" style={{ fontSize: '1.7em' }}>
                            <div className="headerContainer" style={{ width: 'fit-content', marginLeft: '0.1em' }}>
                                Areas of Web Development
                            </div>
                        </h1>
                    </div>
                </div>
                <div className='key-areas2'>
                    <div className="imageContainerWebBeginner">
                        <img src={frontendBeginnerWeb} alt="" className="imageForWebBeginner" />
                        <div className="overlay">
                            <div className='keyAreasOfBeginnerWebDev'>
                                <strong>Frontend Development (Client-Side):</strong>
                                <div className='keyDescription'>
                                    This is what users see and interact with on a website. It involves working with languages like <b>HTML, CSS, and JavaScript</b> to build the layout, design, and functionality of a website.
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="imageContainerWebBeginner">
                        <img src={backendBeginnerWeb} alt="" className="imageForWebBeginner" />
                        <div className="overlay">
                            <div className='keyAreasOfBeginnerWebDev2'><strong>Backend Development (Server-Side):</strong>
                                <div className='keyDescription'> The backend is what happens behind the scenes. It's responsible for managing the data, servers, and databases that make a website function properly. Backend development often involves languages like <b>Python, PHP, Ruby, Node.js or Spring Boot</b>.
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="imageContainerWebBeginner">
                        <img src={fsBeginnerWeb} alt="" className="imageForWebBeginner" />
                        <div className="overlay">
                            <div className='keyAreasOfBeginnerWebDev' style={{ marginTop: '-12em' }}>
                                <strong>Full Stack Development</strong>
                                <div className='keyDescription'>
                                    A full-stack developer works on both the frontend and backend of a website, handling everything from the design to the server management.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <h3 className='subsection-title'>Why Learn Web Development?</h3>
                <p className='paragraph'>The internet is the backbone of modern society. Businesses, educational institutions, and entertainment industries all rely on websites and web applications to connect with users and provide services. Learning web development empowers you to create engaging and interactive digital experiences, no matter your goals.</p>
                <div className='beginnerPictureContainer'>
                    <div className="imageWithDescription">
                        <img src={project1} alt="" className="courseImage" style={{ width: '50em', height: '30em' }} />
                        <div className="imageDescription">Creativity Meets Technology</div>
                    </div>
                    <div className="imageWithDescription">
                        <img src={web6} alt="" className="courseImage" style={{ width: '50em', height: '30em' }} />
                        <div className="imageDescription">In-Demand Skills</div>
                    </div>
                    <div className="imageWithDescription">
                        <img src={firstApp} alt="" className="courseImage" style={{ width: '50em', height: '30em' }} />
                        <div className="imageDescription">Build Your Own Projects</div>
                    </div>
                    <div className="imageWithDescription">
                        <img src={contL} alt="" className="courseImage" style={{ width: '50em', height: '30em' }} />
                        <div className="imageDescription">Continuous Learning</div>
                    </div>
                </div>
                <div style={{ display: 'flex' }}>
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
