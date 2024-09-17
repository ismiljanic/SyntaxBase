import React from 'react';
import { useParams } from 'react-router-dom';
import { Header } from '../../../Header';
import { Footer } from '../../../Footer';
import { Footer2 } from '../../../Footer2';
import '../../../../styles/webCourses/BeginnerWebCourse/Lesson1.css';
import frontendBeginnerWeb from '../../../../pages/webCourses/BeginnerWebCourse/images/frontendBeginnerWeb.png';
import backendBeginnerWeb from '../../../../pages/webCourses/BeginnerWebCourse/images/backendBeginnerWeb.png';
import fsBeginnerWeb from '../../../../pages/webCourses/BeginnerWebCourse/images/fsBeginnerWeb.png';
import beginnerWebDevImage from '../../../../pages/webCourses/BeginnerWebCourse/images/beginnerWebDevImage.png';
import placeholder from '../../../../pages/webCourses/BeginnerWebCourse/images/placeholder.png';
import simple3 from '../../../../pages/webCourses/BeginnerWebCourse/images/simple3.png';
import simple4 from '../../../../pages/webCourses/BeginnerWebCourse/images/simple4.png';
import simple5 from '../../../../pages/webCourses/BeginnerWebCourse/images/simple5.png';
import simple6 from '../../../../pages/webCourses/BeginnerWebCourse/images/simple6.png';
import simple7 from '../../../../pages/webCourses/BeginnerWebCourse/images/simple7.png';

export function Lesson1() {
    return (
        <div className='mainContainer'>
            <Header bgColor="rgb(247, 250, 251)" />
            <div className='lessonIntroduction'>
                <h1>Introduction to Web Development</h1>
                <p>Welcome to <b>Lesson 1</b> of the <b>Beginner Web Development course</b>.</p>
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
                {/* <div className='beginnerPictureContainer'>
                    <div className="imageWithDescription">
                        <img src={simple1} alt="" className="courseImage" />
                        <div className="imageDescription">Learn HTML structure</div>
                    </div>
                    <div className="imageWithDescription">
                        <img src={simple3} alt="" className="courseImage" />
                        <div className="imageDescription">Gain knowledge of TypeScript</div>
                    </div>
                    <div className="imageWithDescription">
                        <img src={simple4} alt="" className="courseImage" />
                        <div className="imageDescription">Create attractive structures with CSS</div>
                    </div>
                    <div className="imageWithDescription">
                        <img src={simple5} alt="" className="courseImage" />
                        <div className="imageDescription">Start with development</div>
                    </div>
                    <div className="imageWithDescription">
                        <img src={simple6} alt="" className="courseImage" />
                        <div className="imageDescription">Find out why node modules are heavy</div>
                    </div>
                    <div className="imageWithDescription">
                        <img src={simple7} alt="" className="courseImage" />
                        <div className="imageDescription">Finish all steps of course and get feedback</div>
                    </div>
                </div> */}
                <div className="aboutCourseDiv2">
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
                            <div className='keyAreasOfBeginnerWebDev' style={{marginTop: '-12em'}}>
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

                <ul className='benefits'>
                    <li><strong>Creativity Meets Technology:</strong> Web development allows you to express your creativity while solving real-world problems with technology.</li>
                    <li><strong>In-Demand Skills:</strong> Web developers are in high demand across various industries, and learning this skill can lead to exciting job opportunities.</li>
                    <li><strong>Build Your Own Projects:</strong> Whether it's a personal blog, an online store, or a portfolio, web development gives you the tools to bring your ideas to life.</li>
                    <li><strong>Continuous Learning:</strong> The web is always evolving. As a developer, you'll be constantly learning new tools and technologies, making this an exciting and dynamic field.</li>
                </ul>

                <h3 className='subsection-title'>Course Overview</h3>
                <p className='paragraph'>In this course, you’ll learn the following key areas of web development:</p>
                <ul className='course-content'>
                    <li><strong>HTML (HyperText Markup Language):</strong> The building block of any website. You'll learn how to structure content and create the elements that make up a webpage.</li>
                    <li><strong>CSS (Cascading Style Sheets):</strong> Once you’ve structured your content, you’ll learn how to style it, making your site visually appealing and responsive across different devices.</li>
                    <li><strong>JavaScript:</strong> After mastering HTML and CSS, you’ll dive into JavaScript, which brings interactivity to your website. You'll learn how to make your site dynamic and responsive to user actions.</li>
                    <li><strong>Final Project:</strong> At the end of this course, you’ll apply everything you've learned to build a fully functional website of your own. This will be an excellent opportunity to showcase your new skills!</li>
                </ul>

                <p className='closing-text'>By the end of this course, you’ll not only have the knowledge to create your own website, but you'll also understand the core principles of web development, positioning you for further learning or starting your journey as a developer.</p>
                <p className='closing-text'>Let’s get started on this exciting journey into web development!</p>
            </div>

            <Footer2 bgColor="rgb(247, 250, 251)" />
            <Footer bgColor="rgb(247, 250, 251)" />
        </div >
    );
}
