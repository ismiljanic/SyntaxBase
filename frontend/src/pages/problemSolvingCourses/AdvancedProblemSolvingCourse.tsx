import React from "react";
import { Header } from "../Header";
import { Footer } from "../Footer";
import { Footer2 } from "../Footer2";
import web4 from '../../images/web4.png';
import '../../styles/webCourses/BeginnerWebCourse.css';



export function AdvancedProblemSolvingCourse() {
    return (
        <div className="mainp-container" style={{ backgroundColor: 'rgb(247, 250, 251)' }}>
            <Header bgColor='rgb(247, 250, 251)' />
            <div>
                <div className="container" style={{ backgroundColor: 'rgb(247, 250, 251)' }}>
                    <div className="webCourseDiv">
                        Advanced Problem Solving Course
                    </div>
                </div>
                <div className="webCoursesDiv2" style={{ fontSize: '2.5em', paddingBottom: '2em', fontWeight: 'bold', marginLeft: '3em' }}>
                    Create Simple Frontend Application!
                </div>
                <div className="aboutCourseDiv2">
                    <div className="introductionDiv">Introduction</div>
                    <div className="frontImage">
                        <h1 className="headerDivText" style={{ fontSize: '1.7em' }}>
                            <div className="headerContainer">
                                Learn How to Create a Simple Frontend Application
                            </div>
                            <div className="imageContainer">
                                <img src={web4} alt="" className="imageForCourse" />
                            </div>
                        </h1>
                    </div>
                    <div className="descriptionOfCourse">
                        You will learn how to create a simple frontend application from the beginning!
                        Course is designed for those new to programming.
                        You will be introduced to the development environment which you will customize to your needs and preferences.
                        We will start learning the fundamentals of React, TypeScript and CSS, two powerful tools that will help you build dynamic and type-safe user interfaces while maintaining it stylish.
                        By the end of the course, you'll have the skills to create a simple, interactive frontend application from scratch with attractive appeal.
                    </div>
                </div>
                <div className="pictureContainer">
                    <div className="imageWithDescription">
                        <img src={web4} alt="" className="courseImage" />
                        <div className="imageDescription">image description</div>
                    </div>
                    <div className="imageWithDescription">
                        <img src={web4} alt="" className="courseImage" />
                        <div className="imageDescription">image description</div>
                    </div>
                    <div className="imageWithDescription">
                        <img src={web4} alt="" className="courseImage" />
                        <div className="imageDescription">image description</div>
                    </div>
                    <div className="imageWithDescription">
                        <img src={web4} alt="" className="courseImage" />
                        <div className="imageDescription">image description</div>
                    </div>
                    <div className="imageWithDescription">
                        <img src={web4} alt="" className="courseImage" />
                        <div className="imageDescription">image description</div>
                    </div>
                    <div className="imageWithDescription">
                        <img src={web4} alt="" className="courseImage" />
                        <div className="imageDescription">image description</div>
                    </div>
                </div>
            </div>
            <div className="buttonContainer">
                <button className="courseButton">START COURSE</button>
            </div>


            <div className="bigDaddyContainer">
                <div className="container2">
                    <div className="webCourseDiv3">
                        Check our other courses
                    </div>
                    <a href="/courses" className="moreCoursesDiv">
                        More courses
                    </a>
                    <div className="lineDiv"></div>
                </div>
                <div className="pictureContainer2">
                    <a href="/intermediateWebCourse" className="imageWithDescription2">
                        <img src={web4} alt="" className="courseImage2" />
                        <div className="imageDescription2">Intermediate Frontend Course<br></br> Develop Intermediate Application Following Course Project Structure!</div>
                    </a>
                    <a href="/advancedWebCourse" className="imageWithDescription2">
                        <img src={web4} alt="" className="courseImage2" />
                        <div className="imageDescription2">
                            Advanced Frontend Course<br />Master Frontend Development With Ultimate Project!
                        </div>
                    </a>
                    <a href="/beginnerGameCourse" className="imageWithDescription2">
                        <img src={web4} alt="" className="courseImage2" />
                        <div className="imageDescription2">
                            Beginner Game Development Course<br />Create Simple Android And Desktop Games With C++ or C#!
                        </div>
                    </a>
                    <a href="/intermediateGameCourse" className="imageWithDescription2">
                        <img src={web4} alt="" className="courseImage2" />
                        <div className="imageDescription2">
                            Intermediate Game Development Course<br />Advance With Game Development With C++ and C#!
                        </div>
                    </a>
                    <a href="/advancedGameCourse" className="imageWithDescription2">
                        <img src={web4} alt="" className="courseImage2" />
                        <div className="imageDescription2">
                            Advanced Game Development Course<br />Create Complex Android And Desktop Games With C++ or C#!
                        </div>
                    </a>
                    <a href="/intermediateDbCourse" className="imageWithDescription2">
                        <img src={web4} alt="" className="courseImage2" />
                        <div className="imageDescription2">
                            Intermediate Database Managment Course<br />Create Complex Structure Of Database!
                        </div>
                    </a>
                </div>
            </div>
            <Footer2 bgColor="rgb(247, 250, 251)" />
            <Footer bgColor="rgb(247, 250, 251)" />
        </div >
    );
}
