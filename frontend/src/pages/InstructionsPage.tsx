import React, { useState } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Footer2 } from "./Footer2";
import { useEffect } from "react";
import calculus1 from '../images/calculus1.png';
import instr2 from '../images/instr2.png';
import instr3 from '../images/instr3.png';
import instr4 from '../images/instr4.png';
import instr5 from '../images/instr5.png';

export function InstructionsPage() {
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
                <header className="featureHeader2">INSTRUCTIONS</header>
                <div className="offerDiv2" style={{ paddingTop: '3em' }}>
                    Whether you're starting from scratch or looking to enhance your expertise, our courses offer clear, easy-to-follow instructions that guide you through every aspect of your learning journey. From foundational principles to advanced techniques, we provide hands-on exercises, real-world examples, and expert insights to help you build confidence and competence. Explore a wide range of topics, practice problem-solving, and gain the practical experience you need to excel. Start learning today and turn your goals into achievements with our comprehensive instructional resources.
                </div>
                <div className='features3'>
                    <a href="/calculusTutorial" className="reactDiv">
                        <img src={calculus1} alt="Logo SyntaxBase" className="reactImage" />
                        <div className="webCourses">
                           Calculus Tutorial<br />Learn Calculus With Examples And Tutorials!
                        </div>
                        <div className="arrow-circle"></div>
                    </a>
                </div>
                <div className='features3'>
                    <a href="/programmingTutorial" className="reactDiv">
                        <img src={instr2} alt="Logo SyntaxBase" className="reactImage" />
                        <div className="webCourses">
                            Programming Tutorial<br />Learn Basics Of Programming - Ideal For Beginners!
                        </div>
                        <div className="arrow-circle"></div>
                    </a>
                </div>
                <div className='features3'>
                    <a href="/linearAlgebraTutorial" className="reactDiv">
                        <img src={instr3} alt="Logo SyntaxBase" className="reactImage" />
                        <div className="webCourses">
                            Linear Alegbra Tutorial<br />Explore New Concepts With Linear Algebra Tutorial!
                        </div>
                        <div className="arrow-circle"></div>
                    </a>
                </div>
                <div className='features3'>
                    <a href="/oopTutorial" className="reactDiv">
                        <img src={instr4} alt="Logo SyntaxBase" className="reactImage" />
                        <div className="webCourses">
                            Object Oriented Tutorial<br />Advance Forward With Object Oriented Programming!
                        </div>
                        <div className="arrow-circle"></div>
                    </a>
                </div>
                <div className='features3'>
                    <a href="/algorithmAndDSTutorial" className="reactDiv">
                        <img src={instr5} alt="Logo SyntaxBase" className="reactImage" />
                        <div className="webCourses">
                            Algorithm And Data Structures Tutorial<br />Expand Your Knowledge Of Algorithms And Data Structures!
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