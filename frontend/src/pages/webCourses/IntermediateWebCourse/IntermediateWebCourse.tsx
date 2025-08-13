import React, { useState } from "react";
import { Header } from "../../Header";
import { Footer } from "../../Footer";
import { Footer2 } from "../../Footer2";
import intermediate1 from '../IntermediateWebCourse/images/intermediate1.png'
import intermediate2 from '../IntermediateWebCourse/images/intermediate2.png';
import intermediate3 from '../IntermediateWebCourse/images/intermediate3.png';
import intermediate4 from '../IntermediateWebCourse/images/intermediate4.png';
import intermediate5 from '../IntermediateWebCourse/images/intermediate5.png';
import intermediate6 from '../IntermediateWebCourse/images/intermediate6.png';
import contL from '../IntermediateWebCourse/images/contL.png';
import '../../../styles/webCourses/BeginnerWebCourse.css';
import beginnerWebCourse from '../../../images/intermediateWebCourse.png';
import adv from '../../../images/adv.png';
import desktop2 from '../../../images/desktop2.png';
import gameL2 from '../../../images/gameL2.png';
import database2 from '../../../images/database2.png';
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";

export function IntermediateWebCourse() {
    const { user, isAuthenticated, getAccessTokenSilently, isLoading } = useAuth0();
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState("");
    const navigate = useNavigate();


    const handleButtonClick = async () => {
        if (!isAuthenticated || !user?.sub) {
            navigate('/login', { state: { from: '/intermediateWebCourse' } });
            return;
        }
        try {
            const token = await getAccessTokenSilently();

            await axios.post(
                'http://localhost:8080/api/user-courses/startCourse',
                {
                    auth0UserId: user.sub,
                    courseId: 2,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true,
                }
            );

            const response = await axios.get(
                'http://localhost:8080/api/progress/lessons/first',
                {
                    params: { courseId: 2 },
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
                        Intermediate Frontend Course
                    </div>
                </div>
                <div className="webCoursesDiv2" style={{ fontSize: '2.5em', paddingBottom: '2em', fontWeight: 'bold', marginLeft: '3em' }}>
                    Create Impressive Applications!
                </div>
                <div className="aboutCourseDiv2">
                    <div className="introductionDiv">Introduction</div>
                    <div className="frontImage">
                        <h1 className="headerDivText" style={{ fontSize: '1.7em' }}>
                            <div className="headerContainer">
                                Build a Real Frontend Application with React and TypeScript
                            </div>
                            <div className="imageContainer">
                                <img src={contL} alt="Frontend Course" className="imageForCourse" />
                            </div>
                        </h1>
                    </div>

                    <div className="descriptionOfCourse">
                        This intermediate course is designed for those who have grasped the basics and are ready to build a real-world frontend application from the ground up.
                        <br /><br />
                        Through hands-on development, you'll set up your own development environment, learn essential tooling, and use React, TypeScript, and CSS to create responsive, dynamic interfaces with professional polish.
                        <br /><br />
                        As part of the course, you'll implement a complete authentication and ticket-generation system backed by a PostgreSQL database. This includes secure QR code generation, user authorization with OAuth2, and integration of OpenID Connect for identity management.
                        <br /><br />
                        By the end, you'll have a fully functional frontend app connected to backend services, ready to deploy to the cloud.
                    </div>
                </div>
                <div className="pictureContainer">
                    <div className="imageWithDescription">
                        <img src={intermediate1} alt="img16" className="courseImage" />
                        <div className="imageDescription">Integrate secure authentication</div>
                    </div>
                    <div className="imageWithDescription">
                        <img src={intermediate2} alt="img15" className="courseImage" />
                        <div className="imageDescription">Create tickets</div>
                    </div>
                    <div className="imageWithDescription">
                        <img src={intermediate3} alt="img14" className="courseImage" />
                        <div className="imageDescription">Generate QR code</div>
                    </div>
                    <div className="imageWithDescription">
                        <img src={intermediate4} alt="img13" className="courseImage" />
                        <div className="imageDescription">Preview ticket information</div>
                    </div>
                    <div className="imageWithDescription">
                        <img src={intermediate5} alt="img12" className="courseImage" />
                        <div className="imageDescription">Check available tickets</div>
                    </div>
                    <div className="imageWithDescription">
                        <img src={intermediate6} alt="img11" className="courseImage" />
                        <div className="imageDescription">Integrate OAuth2 authorization</div>
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
                    <a href="/advancedWebCourse" className="imageWithDescription2">
                        <img src={adv} alt="" className="courseImage2" />
                        <div className="imageDescription2">
                            Advanced Frontend Course<br />
                            Master Frontend Development With Ultimate Project!
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
