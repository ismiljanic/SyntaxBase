import React, { useState } from "react";
import { Header } from "../Header";
import { Footer } from "../Footer";
import { Footer2 } from "../Footer2";
import '../../styles/webCourses/BeginnerWebCourse.css';
import simple1 from '../../pages/webCourses/BeginnerWebCourse/images/simple1.png';
import simple2 from '../../pages/webCourses/BeginnerWebCourse/images/simple2.png';
import simple3 from '../../pages/webCourses/BeginnerWebCourse/images/simple3.png';
import simple4 from '../../pages/webCourses/BeginnerWebCourse/images/simple4.png';
import simple5 from '../../pages/webCourses/BeginnerWebCourse/images/simple5.png';
import simple6 from '../../pages/webCourses/BeginnerWebCourse/images/simple6.png';
import simple7 from '../../pages/webCourses/BeginnerWebCourse/images/simple7.png';
import intermediateWebCourse from '../../images/intermediateWebCourse.png';
import adv from '../../images/adv.png';
import desktop2 from '../../images/desktop2.png';
import gameL2 from '../../images/gameL2.png';
import database2 from '../../images/database2.png';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

export function BeginnerWebCourse() {

    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState("");
    const navigate = useNavigate();
    const userToken = sessionStorage.getItem('userToken');

    const handleButtonClick = async () => {
        const userId = sessionStorage.getItem('userId');
        console.log(userId);
        if (userId) {
            try {
                await axios.post("http://localhost:8080/api/user-courses/startCourse", {
                    userId: parseInt(userId, 10),
                    courseId: 1
                }, {
                    headers: { 'Authorization': `Bearer ${userToken}` }
                });
                navigate(`/beginnerWebCourse/${userId}`);
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    if (error.response && error.response.status === 409) {
                        const errorMessage = error.response.data;
                        setPopupMessage(errorMessage || "You have already started this course.");
                        setShowPopup(true);
                    } else {
                        console.error("Unexpected error:", error);
                    }
                } else {
                    console.error("Non-Axios error:", error);
                }
            }
        } else {
            navigate('/login', { state: { from: `/beginnerWebCourse/${userId}` } });
        }
    };


    return (
        <div className="mainp-container" style={{ backgroundColor: 'rgb(247, 250, 251)' }}>
            <Header bgColor='rgb(247, 250, 251)' />
            <div>
                <div className="container">
                    <div className="webCourseDiv">
                        Beginner Frontend Course
                    </div>
                    <div className="webCoursesDiv2" style={{ fontSize: '2.5em', paddingBottom: '2em', fontWeight: 'bold', marginLeft: '3em' }}>
                        Create Simple Frontend Application!
                    </div>
                </div>
                <div className="aboutCourseDiv2">
                    <div className="introductionDiv">Introduction</div>
                    <div className="frontImage">
                        <h1 className="headerDivText" style={{ fontSize: '1.7em' }}>
                            <div className="headerContainer">
                                Learn How to Create a Simple Frontend Application
                            </div>
                            <div className="imageContainer">
                                <img src={simple2} alt="" className="imageForCourse" />
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
                </div>
            </div>
            <div className="buttonContainer">
                <button className="courseButton" onClick={handleButtonClick}>START COURSE</button>
            </div>
            <Popup
                open={showPopup}
                onClose={() => setShowPopup(false)}
                modal
                className="custom-popup"
            >
                <div className="custom-popup-content">
                    <div className="custom-popup-header">Course Error</div>
                    <p>{popupMessage}</p>
                    <button className="custom-popup-button" onClick={() => setShowPopup(false)}>Close</button>
                </div>
            </Popup>
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
                        <img src={intermediateWebCourse} alt="" className="courseImage2" />
                        <div className="imageDescription2">Intermediate Frontend Course<br></br> Develop Intermediate Application Following Course Project Structure!</div>
                    </a>
                    <a href="/advancedWebCourse" className="imageWithDescription2">
                        <img src={adv} alt="" className="courseImage2" />
                        <div className="imageDescription2">
                            Advanced Frontend Course<br />Master Frontend Development With Ultimate Project!
                        </div>
                    </a>
                    <a href="/beginnerGameCourse" className="imageWithDescription2">
                        <img src={desktop2} alt="" className="courseImage2" />
                        <div className="imageDescription2">
                            Beginner Game Development Course<br />Create Simple Android And Desktop Games With C++ or C#!
                        </div>
                    </a>
                    <a href="/intermediateGameCourse" className="imageWithDescription2">
                        <img src={gameL2} alt="" className="courseImage2" />
                        <div className="imageDescription2">
                            Intermediate Game Development Course<br />Advance With Game Development With C++ and C#!
                        </div>
                    </a>
                    <a href="/advancedGameCourse" className="imageWithDescription2">
                        <img src={gameL2} alt="" className="courseImage2" />
                        <div className="imageDescription2">
                            Advanced Game Development Course<br />Create Complex Android And Desktop Games With C++ or C#!
                        </div>
                    </a>
                    <a href="/intermediateDbCourse" className="imageWithDescription2">
                        <img src={database2} alt="" className="courseImage2" />
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
