import React, { useState } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Footer2 } from "./Footer2";
import { useEffect } from "react";
import picture3 from '../images/desktop.png';
import picture5 from '../images/gameL.png';
import web4 from '../images/web4.png';
import web5 from '../images/web5.png';
import web6 from '../images/web6.png';
import db2 from '../images/db2.png';
import db4 from '../images/db4.png';
import db5 from '../images/db5.png';
import problem4 from '../images/problem4.png';
import problem5 from '../images/problem5.png';
import problem6 from '../images/problem6.png';

export function Courses() {
    const [featureDiv2Visible2, setFeatureDiv2Visible2] = useState(false);
    const [offerDiv4Visible, setOfferDiv4Visible] = useState(false);
    const [offerDiv5Visible, setOfferDiv5Visible] = useState(false);

    useEffect(() => {

        const featureDiv2Options2 = {
            root: null,
            rootMargin: '0px',
            threshold: 0
        };

        const offerDiv4Options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.5
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

        const offerDiv4Observer = new IntersectionObserver(([entry]) => {
            setOfferDiv4Visible(entry.isIntersecting);
        }, offerDiv5Options);


        const offerDiv4Elements = document.querySelectorAll('.offerDiv4');
        const offerDiv5Elements = document.querySelectorAll('.offerDiv5');

        offerDiv5Elements.forEach(el => offerDiv5Observer.observe(el));
        offerDiv4Elements.forEach(el => offerDiv4Observer.observe(el));

        const featureDiv2_2 = document.querySelector('.featureDiv2.feature2');

        if (featureDiv2_2) featureDiv2Observer2.observe(featureDiv2_2);

        return () => {
            if (featureDiv2_2) featureDiv2Observer2.unobserve(featureDiv2_2);
            offerDiv5Elements.forEach(el => offerDiv5Observer.unobserve(el));
            offerDiv4Elements.forEach(el => offerDiv4Observer.unobserve(el));
        };

    }, []);

    return (
        <div className="mainp-container">
            <Header bgColor="#f5f5f5"></Header>
            <div className={`featureDiv2 feature2 ${featureDiv2Visible2 ? 'slide-in' : ''}`}>
                <header className="featureHeader2">COURSES</header>
                <div className="offerDiv2" style={{ paddingTop: '3em', marginBottom: '-5em' }}>
                    WEB DEVELOPMENT
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
                <div className="offerDiv2" style={{ paddingTop: '3em', marginBottom: '-5em' }}>
                    GAME DEVELOPMENT
                </div>
                <div className='features3'>
                    <a href="/beginnerGameCourse" className="reactDiv">
                        <img src={picture3} alt="Logo SyntaxBase" className="reactImage" />
                        <div className="webCourses">
                            Beginner Game Development Course<br />Create Simple Android And Desktop Games With C++ or C#!
                        </div>
                        <div className="arrow-circle"></div>
                    </a>
                </div>
                <div className="features3">
                    <a href="/intermediateGameCourse" className="reactDiv">
                        <img src={picture5} alt="Logo SyntaxBase" className="reactImage" />
                        <div className="webCourses">
                            Intermediate Game Development Course<br />Advance With Game Development With C++ and C#!
                        </div>
                        <div className="arrow-circle"></div>
                    </a>
                </div>
                <div className="features3">
                    <a href="/advancedGameCourse" className="reactDiv">
                        <img src={picture5} alt="Logo SyntaxBase" className="reactImage" />
                        <div className="webCourses">
                            Advanced Game Development Course<br />Create Complex Android And Desktop Games With C++ or C#!
                        </div>
                        <div className="arrow-circle"></div>
                    </a>
                </div>
                <div className="offerDiv2" style={{ paddingTop: '3em', marginBottom: '-5em' }}>
                    DATABASE MANAGMENT
                </div>
                <div className='features3'>
                    <a href="/beginnerDbCourse" className="reactDiv">
                        <img src={db4} alt="Logo SyntaxBase" className="reactImage" />
                        <div className="webCourses">
                            Beginner Database Managment Course<br />Create Simple Database With Backend Connection!
                        </div>
                        <div className="arrow-circle"></div>
                    </a>
                </div>
                <div className="features3">
                    <a href="/intermediateDbCourse" className="reactDiv">
                        <img src={db2} alt="Logo SyntaxBase" className="reactImage" />
                        <div className="webCourses">
                            Intermediate Database Managment Course<br />Create Complex Structure Of Database!
                        </div>
                        <div className="arrow-circle"></div>
                    </a>
                </div>
                <div className="features3">
                    <a href="/advancedDbCourse" className="reactDiv">
                        <img src={db5} alt="Logo SyntaxBase" className="reactImage" />
                        <div className="webCourses">
                            Advanced Database Managment Course<br />Create Complex Database And Connect It To Full-Stack Application
                        </div>
                        <div className="arrow-circle"></div>
                    </a>
                </div>
                <div className="offerDiv2" style={{ paddingTop: '3em', marginBottom: '-5em' }}>
                    PROBLEM SOLVING
                </div>
                <div className='features3'>
                    <a href="/beginnerPsCourse" className="reactDiv">
                        <img src={problem4} alt="Logo SyntaxBase" className="reactImage" />
                        <div className="webCourses">
                            Beginner Problem Solving Course<br />Explore New Problems And Their Solutions!
                        </div>
                        <div className="arrow-circle"></div>
                    </a>
                </div>
                <div className="features3">
                    <a href="/intermediatePsCourse" className="reactDiv">
                        <img src={problem5} alt="Logo SyntaxBase" className="reactImage" />
                        <div className="webCourses">
                            Intermediate Problem Solving Course<br />Start Journey And Unlock Problem Solver In You!
                        </div>
                        <div className="arrow-circle"></div>
                    </a>
                </div>
                <div className="features3">
                    <a href="/advancedPsCourse" className="reactDiv">
                        <img src={problem6} alt="Logo SyntaxBase" className="reactImage" />
                        <div className="webCourses">
                            Advanced Problem Solving Course<br />Master Problem Solving With Ultimate Problems!
                        </div>
                        <div className="arrow-circle"></div>
                    </a>
                </div>
            </div>
            <Footer2 bgColor="#f5f5f5"></Footer2>
            <Footer bgColor="#f5f5f5"></Footer>
        </div>
    );
}