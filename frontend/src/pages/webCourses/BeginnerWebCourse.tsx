import React, { useEffect, useState } from "react";
import { Header } from "../Header";
import { Footer } from "../Footer";
import { Footer2 } from "../Footer2";
import web4 from '../../images/web4.png';
import '../../styles/webCourses/BeginnerWebCourse.css';



export function BeginnerWebCourse() {
    const [visibleSections, setVisibleSections] = useState<boolean[]>(Array(5).fill(false));
    const [webCoursesDiv2Visible, setwebCoursesDiv2Visible] = useState(false);

    const handleToggleImages = (index: number) => {
        setVisibleSections(prevState =>
            prevState.map((visible, i) => i === index ? !visible : visible)
        );
    };

    useEffect(() => {

        const webCoursesDiv2Options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.5
        };


        const webCoursesDiv2Observer = new IntersectionObserver(([entry]) => {
            setwebCoursesDiv2Visible(entry.isIntersecting);
        }, webCoursesDiv2Options);

        const webCoursesDiv2Elements = document.querySelectorAll('.webCoursesDiv2');

        webCoursesDiv2Elements.forEach(el => webCoursesDiv2Observer.observe(el));

        return () => {
            webCoursesDiv2Elements.forEach(el => webCoursesDiv2Observer.unobserve(el));
        };

    }, []);

    return (
        <div className="mainp-container" style={{ backgroundColor: '#f5f5f5' }}>
            <Header bgColor="#f5f5f5" />
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
                    <div>Introduction</div>
                    <h1 className="headerDivText" style={{ fontSize: '1.7em' }}>
                        Learn How to Create a Simple Frontend Application
                        <div className="picturesDiv">
                            <div className="descriptionWithImage">
                                <img src={web4} className="imageForCourse" />
                                <div className="descriptionImage">Description for image 1</div>
                            </div>
                        </div>
                    </h1>
                    <div className="descriptionOfCourse">You will learn how to create a simple frontend application from the beginning!
                        Course is designed for those new to programming.
                        You will be introduced to the development environment which you will customize to your needs and preferences.
                        We will start learning the fundamentals of React, TypeScript and CSS, two powerful tools that will help you build dynamic and type-safe user interfaces while maintaining it stylish.
                        By the end of the course, you'll have the skills to create a simple, interactive frontend application from scratch with attractive appeal.
                    </div>
                </div>
                <div className="pictureContainer">
                    <div className="imageWithDescription">
                        <img src={web4} className="courseImage" />
                        <div className="imageDescription">image description</div>
                    </div>
                    <div className="imageWithDescription">
                        <img src={web4} className="courseImage" />
                        <div className="imageDescription">image description</div>
                    </div>
                    <div className="imageWithDescription">
                        <img src={web4} className="courseImage" />
                        <div className="imageDescription">image description</div>
                    </div>
                    <div className="imageWithDescription">
                        <img src={web4} className="courseImage" />
                        <div className="imageDescription">image description</div>
                    </div>
                    <div className="imageWithDescription">
                        <img src={web4} className="courseImage" />
                        <div className="imageDescription">image description</div>
                    </div>
                    <div className="imageWithDescription">
                        <img src={web4} className="courseImage" />
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
                </div>
                <div className="pictureContainer2">
                    <div className="imageWithDescription">
                        <img src={web4} className="courseImage" />
                        <div className="imageDescription">image description</div>
                    </div>
                    <div className="imageWithDescription">
                        <img src={web4} className="courseImage" />
                        <div className="imageDescription">image description</div>
                    </div>
                    <div className="imageWithDescription">
                        <img src={web4} className="courseImage" />
                        <div className="imageDescription">image description</div>
                    </div>
                    <div className="imageWithDescription">
                        <img src={web4} className="courseImage" />
                        <div className="imageDescription">image description</div>
                    </div>
                    <div className="imageWithDescription">
                        <img src={web4} className="courseImage" />
                        <div className="imageDescription">image description</div>
                    </div>
                    <div className="imageWithDescription">
                        <img src={web4} className="courseImage" />
                        <div className="imageDescription">image description</div>
                    </div>
                </div>
            </div>

            <Footer2 bgColor="rgb(227, 238, 246)" />
            <Footer bgColor="rgb(227, 238, 246)" />
        </div >
    );
}
