import React, { useState } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Footer2 } from "./Footer2";
import { useEffect } from "react";
import problem1 from '../images/problem1.png';
import problem2 from '../images/problem2.png';
import problem3 from '../images/problem3.png';
import problem4 from '../images/problem4.png';
import problem5 from '../images/problem5.png';
import problem6 from '../images/problem6.png';

export function ProblemSolvingPage() {
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
                <header className="featureHeader2">PROBLEM SOLVING</header>
                <div className="offerDiv2" style={{ paddingTop: '3em' }}>
                    Unlock the power of problem-solving with our in-depth tutorials designed to sharpen your analytical thinking and approach to complex issues. Our courses cover a wide array of problem-solving techniques and strategies, from fundamental concepts to advanced methodologies.
                </div>
                <div className='features3'>
                    <a href="/beginnerPsTutorial" className="reactDiv">
                        <img src={problem1} alt="Logo SyntaxBase" className="reactImage" />
                        <div className="webCourses">
                            Beginner Problem Solving<br />Solve Easy Problems And Learn Simple Algorithms
                        </div>
                        <div className="arrow-circle"></div>
                    </a>
                </div>
                <div className='features3'>
                    <a href="/intermediatePsTutorial" className="reactDiv">
                        <img src={problem2} alt="Logo SyntaxBase" className="reactImage" />
                        <div className="webCourses">
                            Intermediate Problem Solving<br />Learn Data Structures And More Complex Algorithms!
                        </div>
                        <div className="arrow-circle"></div>
                    </a>
                </div>
                <div className='features3'>
                    <a href="/advancedPsTutorial" className="reactDiv">
                        <img src={problem3} alt="Logo SyntaxBase" className="reactImage" />
                        <div className="webCourses">
                            Advanced Problem Solving<br />Learn Complex Algorithms And Their Application!
                        </div>
                        <div className="arrow-circle"></div>
                    </a>
                </div>

                <div className={`offerDiv5 ${offerDiv5Visible ? 'slide-in' : 'slide-out'}`}>
                    <p>EXPLORE OUR COURSES</p>
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