import React, { useState } from "react";
import { Header } from "../../Header";
import { Footer } from "../../Footer";
import { Footer2 } from "../../Footer2";
import pic1 from '../AdvancedWebCourse/images/pic1.png'
import pic2 from '../AdvancedWebCourse/images/pic2.png'
import '../../../styles/webCourses/BeginnerWebCourse.css';
import '../../../styles/webCourses/BeginnerWebCourse.css';
import beginnerWebCourse from '../../../images/intermediateWebCourse.png';
import desktop2 from '../../../images/desktop2.png';
import gameL2 from '../../../images/gameL2.png';
import database2 from '../../../images/database2.png';
import project1 from '../AdvancedWebCourse/images/LoginPicture.png';
import project2 from '../AdvancedWebCourse/images/pocStranica.png';
import project3 from '../AdvancedWebCourse/images/pocStranica2.png';
import project4 from '../AdvancedWebCourse/images/povijestDarivanja.png';
import project5 from '../AdvancedWebCourse/images/removeDonation.png';
import project6 from '../AdvancedWebCourse/images/zalihek.png';
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Popup from "reactjs-popup";

export function AdvancedWebCourse() {
    const { user, isAuthenticated, getAccessTokenSilently, isLoading } = useAuth0();
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState("");
    const navigate = useNavigate();


    const handleButtonClick = async () => {
        if (!isAuthenticated || !user?.sub) {
            navigate('/login', { state: { from: '/advancedWebCourse' } });
            return;
        }
        try {
            const token = await getAccessTokenSilently();

            await axios.post(
                'http://localhost:8080/api/user-courses/startCourse',
                {
                    auth0UserId: user.sub,
                    courseId: 3,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true,
                }
            );

            const response = await axios.get(
                'http://localhost:8080/api/progress/lessons/first',
                {
                    params: { courseId: 3 },
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true,
                }
            );

            const lesson = response.data;
            const lessonNumber = lesson?.lessonNumber;
            console.log("lesson: " + JSON.stringify(lesson));
            if (!lessonNumber) {
                setPopupMessage("First lesson not found.");
                setShowPopup(true);
                return;
            }

            navigate(`/course/2/lesson/${lessonNumber}`);

        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 409) {
                    setPopupMessage(error.response.data || "You are already enrolled in this course.");
                    setShowPopup(true);
                } else if (error.response) {
                    setPopupMessage(`Error: ${error.response.data || error.message}`);
                    setShowPopup(true);
                } else {
                    setPopupMessage("Network error. Please try again.");
                    setShowPopup(true);
                }
            } else {
                setPopupMessage("Unexpected error occurred.");
                setShowPopup(true);
            }
        }
    }

    return (
        <div className="mainp-container" style={{ backgroundColor: 'rgb(247, 250, 251)' }}>
            <Header bgColor='rgb(247, 250, 251)' />
            <div>
                <div className="container" style={{ backgroundColor: 'rgb(247, 250, 251)' }}>
                    <div className="webCourseDiv">
                        Advanced Web Course
                    </div>
                </div>
                <div className="webCoursesDiv2" style={{ fontSize: '2.5em', paddingBottom: '2em', fontWeight: 'bold', marginLeft: '3em' }}>
                    Create Complex Full-Stack Applications
                </div>
                <div className="aboutCourseDiv2">
                    <div className="introductionDiv">Introduction</div>
                    <div className="frontImage">
                        <h1 className="headerDivText" style={{ fontSize: '1.7em' }}>
                            <div className="headerContainer">
                                Learn How to Create a Complex Full-Stack Application
                            </div>
                            <div className="imageContainer">
                                <img src={pic1} alt="" className="imageForCourse" />
                            </div>
                        </h1>
                    </div>
                    <div className="descriptionOfCourse">
                        In this course you will learn how to create a complex full-stack application using React, TypeScript and Java Spring Boot.
                        The course is designed to take you through the process of building a full-stack application from scratch, covering both frontend and backend development.
                        You will learn how to create a RESTful API using Spring Boot, how to connect your React frontend to the backend, and how to manage state in your application.
                        By the end of the course, you will have a solid understanding of how to build complex web applications and be able to apply these skills in real-world projects.
                        At the end of the course you will have a complex full-stack application that you can use as a portfolio piece or as a starting point for your own projects.
                    </div>
                </div>
                <div className="pictureContainer">
                    <div className="imageWithDescription">
                        <img src={project1} alt="" className="courseImage" />
                        <div className="imageDescription">Secure login</div>
                    </div>
                    <div className="imageWithDescription">
                        <img src={project2} alt="" className="courseImage" />
                        <div className="imageDescription">Create homepage</div>
                    </div>
                    <div className="imageWithDescription">
                        <img src={project3} alt="" className="courseImage" />
                        <div className="imageDescription">Describe your application</div>
                    </div>
                    <div className="imageWithDescription">
                        <img src={project4} alt="" className="courseImage" />
                        <div className="imageDescription">Present your application</div>
                    </div>
                    <div className="imageWithDescription">
                        <img src={project5} alt="" className="courseImage" />
                        <div className="imageDescription">Show features</div>
                    </div>
                    <div className="imageWithDescription">
                        <img src={project6} alt="" className="courseImage" />
                        <div className="imageDescription">Make it useful</div>
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
                    <a href="/beginnerWebCourse" className="imageWithDescription2">
                        <img src={beginnerWebCourse} alt="" className="courseImage2" />
                        <div className="imageDescription2">
                            Beginner Frontend Course<br />
                            Develop Beginner Application Following Course Project Structure!
                        </div>
                    </a>
                    <a href="/intermediateWebCourse" className="imageWithDescription2">
                        <img src={pic2} alt="" className="courseImage2" />
                        <div className="imageDescription2">
                            Intermediate Frontend Course<br />
                            Develop Intermediate Application Following Course Project Structure!
                        </div>
                    </a>
                    <a href="/beginnerGameCourse" className="imageWithDescription2">
                        <img src={desktop2} alt="" className="courseImage2" />
                        <div className="imageDescription2">
                            Beginner Game Development Course<br />
                            Create Simple Android And Desktop Games With C++ or C#!
                        </div>
                    </a>
                    <a href="/intermediateGameCourse" className="imageWithDescription2">
                        <img src={gameL2} alt="" className="courseImage2" />
                        <div className="imageDescription2">
                            Intermediate Game Development Course<br />
                            Advance With Game Development With C++ and C#!
                        </div>
                    </a>
                    <a href="/advancedGameCourse" className="imageWithDescription2">
                        <img src={gameL2} alt="" className="courseImage2" />
                        <div className="imageDescription2">
                            Advanced Game Development Course<br />
                            Create Complex Android And Desktop Games With C++ or C#!
                        </div>
                    </a>
                    <a href="/intermediateDbCourse" className="imageWithDescription2">
                        <img src={database2} alt="" className="courseImage2" />
                        <div className="imageDescription2">
                            Intermediate Database Managment Course<br />
                            Create Complex Structure Of Database!
                        </div>
                    </a>
                </div>
            </div>
            <Footer2 bgColor="rgb(247, 250, 251)" />
            <Footer bgColor="rgb(247, 250, 251)" />
        </div >
    );
}
