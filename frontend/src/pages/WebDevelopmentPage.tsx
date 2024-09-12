import React, { useState } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Footer2 } from "./Footer2";
import { useEffect } from "react";
import web1 from '../images/web1.png';
import web2 from '../images/web2.png';
import web3 from '../images/web3.png';
import web4 from '../images/web4.png';
import web5 from '../images/web5.png';
import web6 from '../images/web6.png';

export function WebDevelopmentPage() {
    const [featureDiv2Visible2, setFeatureDiv2Visible2] = useState(false);
    const [offerDiv5Visible, setOfferDiv5Visible] = useState(false);

    useEffect(() => {

        const featureDiv2Options2 = {
            root: null,
            rootMargin: '0px',
            threshold: 0
        };

        const offerDiv5Options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.5
        };


        const featureDiv2Observer2 = new IntersectionObserver(([entry]) => {
            setFeatureDiv2Visible2(entry.isIntersecting);
        }, featureDiv2Options2);

        const offerDiv5Observer = new IntersectionObserver(([entry]) => {
            setOfferDiv5Visible(entry.isIntersecting);
        }, offerDiv5Options);

        const offerDiv5Elements = document.querySelectorAll('.offerDiv5');

        offerDiv5Elements.forEach(el => offerDiv5Observer.observe(el));

        const featureDiv2_2 = document.querySelector('.featureDiv2.feature2');

        if (featureDiv2_2) featureDiv2Observer2.observe(featureDiv2_2);

        return () => {
            if (featureDiv2_2) featureDiv2Observer2.unobserve(featureDiv2_2);
            offerDiv5Elements.forEach(el => offerDiv5Observer.unobserve(el));
        };

    }, []);

    return (
        <div className="mainp-container">
            <Header bgColor="rgb(247, 250, 251)"></Header>
            <div className='feature2' style={{ backgroundColor: 'rgb(247, 250, 251)' }}>
                <header className="featureHeader2">WEB DEVELOPMENT</header>
                <div className="offerDiv2" style={{ paddingTop: '3em' }}>
                    Build modern websites using popular technologies like React, Node.js, and Express to create high-performance, scalable, and user-friendly applications.
                </div>
                <div className="offerDiv2" style={{ paddingTop: '3em' }}>
                    Three-tier tutorials tailored for your skills and needs starting from beginner mode, progressing to intermediate mode and finally mastering advanced mode.
                </div>
                <div className='features3'>
                    <a href="/beginnerWebTutorial" className="reactDiv">
                        <img src={web1} alt="Logo SyntaxBase" className="reactImage" />
                        <div className="webCourses">
                            Beginner Frontend Tutorial<br />Learn Frontend With React, Node.js And Express Development!
                        </div>
                        <div className="arrow-circle"></div>
                    </a>
                </div>
                <div className='features3'>
                    <a href="/intermediateWebTutorial" className="reactDiv">
                        <img src={web2} alt="Logo SyntaxBase" className="reactImage" />
                        <div className="webCourses">
                            Intermediate Frontend Tutorial<br />Learn More Complex Structures using React, Node.js And Express!
                        </div>
                        <div className="arrow-circle"></div>
                    </a>
                </div>
                <div className='features3'>
                    <a href="/advancedWebTutorial" className="reactDiv">
                        <img src={web3} alt="Logo SyntaxBase" className="reactImage" />
                        <div className="webCourses">
                            Advanced Frontend Tutorial<br />Become Master In Frontend Development With Advanced Tutorial!
                        </div>
                        <div className="arrow-circle"></div>
                    </a>
                </div>

                <div className={`offerDiv5 ${offerDiv5Visible ? 'slide-in' : 'slide-out'}`}>
                    <p>EXPLORE OUR COURSES</p>
                </div>
                <div className='features3'>
                    <a href="/beginnerWebCourse" className="reactDiv">
                        <img src={web4} alt="Logo SyntaxBase" className="reactImage" />
                        <div className="webCourses">
                            Beginner Frontend Course<br />Create Simple Frontend Application!
                        </div>
                        <div className="arrow-circle"></div>
                    </a>
                </div>
                <div className="features3">
                    <a href="/intermediateWebCourse" className="reactDiv">
                        <img src={web5} alt="Logo SyntaxBase" className="reactImage" />
                        <div className="webCourses">
                            Intermediate Frontend Course<br />Develop Intermediate Application Following Course Project Structure!
                        </div>
                        <div className="arrow-circle"></div>
                    </a>
                </div>
                <div className="features3">
                    <a href="/advancedWebCourse" className="reactDiv">
                        <img src={web6} alt="Logo SyntaxBase" className="reactImage" />
                        <div className="webCourses">
                            Advanced Frontend Course<br />Master Frontend Development With Ultimate Project!
                        </div>
                        <div className="arrow-circle"></div>
                    </a>
                </div>
            </div>
            <Footer2 bgColor="rgb(247, 250, 251)"></Footer2>
            <Footer bgColor="rgb(247, 250, 251)"></Footer>
        </div>
    );
}