import React from "react";
import { useNavigate } from 'react-router-dom';
import { Header } from "../../../Header";
import { Footer } from "../../../Footer";
import { Footer2 } from "../../../Footer2";
import { Button } from "@mui/material";
import "reactjs-popup/dist/index.css";
import '../../../../styles/webCourses/MainPageBeginnerWebCourse/MainPageBeginnerWebCourse.css';

export function MainPageBeginnerWebCourse() {
    const navigate = useNavigate();
    const courseId = 1;

    const courseOutline = [
        { title: "Introduction to Web Development", description: "Learn the basics of the web and how websites work." },
        { title: "HTML & CSS Basics", description: "Understand how to structure your website with HTML and style it with CSS." },
        { title: "JavaScript Essentials", description: "Discover how to make your website interactive using JavaScript." },
        { title: "Final Project", description: "Build and deploy your own simple website." },
    ];

    return (
        <div className="bigContainer">
            <Header bgColor="rgb(247, 250, 251)" />

            <div className="main-container">
                <div className="intro-section">
                    <h1>Welcome to the Beginner Web Development Course</h1>
                    <p>This course will take you through the essential steps to build your first website from scratch.</p>
                    <div className="button-container">
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => navigate(`/course/${courseId}/lesson/1`)}
                            className="divni1"
                        >
                            Get Started
                        </Button>
                    </div>
                </div>

                <div className="course-outline">
                    <h2>Course Progress</h2>
                    <div className="outline-grid">
                        {courseOutline.map((module, index) => (
                            <div key={index} className="module-card">
                                <div className="module-card-content">
                                    <h3>{module.title}</h3>
                                    <p>{module.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="progress-section">
                    <h2>Your Progress</h2>
                    <div className="progress-bar">
                        <div className="progress-bar-inner"></div>
                    </div>
                    <p>You have completed 25% of the course</p>
                </div>

                <div className="motivation-section">
                    <h2>Keep Going! You're doing great.</h2>
                    <p>By the end of the course you will have knowledge to build simple frontend application.</p>
                </div>
            </div>

            <Footer2 bgColor="rgb(247, 250, 251)" />
            <Footer bgColor="rgb(247, 250, 251)" />
        </div>
    );
}
