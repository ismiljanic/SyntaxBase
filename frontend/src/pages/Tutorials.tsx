import React, { useState } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Footer2 } from "./Footer2";
import { useEffect } from "react";
import picture2 from '../images/gameDev.png';
import game1 from '../images/game1.png';
import game2 from '../images/game2.png';
import web1 from '../images/web1.png';
import web2 from '../images/web2.png';
import web3 from '../images/web3.png';
import calculus1 from '../images/calculus1.png';
import instr2 from '../images/instr2.png';
import instr3 from '../images/instr3.png';
import instr4 from '../images/instr4.png';
import instr5 from '../images/instr5.png';
import db1 from '../images/db1.png';
import db3 from '../images/db3.png';
import database from '../images/database.png';
import problem1 from '../images/problem1.png';
import problem2 from '../images/problem2.png';
import problem3 from '../images/problem3.png';

export function Tutorials() {
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
                <header className="featureHeader2">TUTORIALS</header>
                <div className="offerDiv2" style={{ paddingTop: '3em', marginBottom: '-5em' }}>
                    WEB DEVELOPMENT
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
                <div className="offerDiv2" style={{ paddingTop: '3em', marginBottom: '-5em' }}>
                    GAME DEVELOPMENT
                </div>
                <div className='features3'>
                    <a href="/gameEnginesTutorial" className="reactDiv">
                        <img src={picture2} alt="Logo SyntaxBase" className="reactImage" />
                        <div className="webCourses">
                            Game Engines Tutorial<br />Learn Basics Of Game Engines!
                        </div>
                        <div className="arrow-circle"></div>
                    </a>
                </div>
                <div className='features3'>
                    <a href="/beginnerGameTutorial" className="reactDiv">
                        <img src={game1} alt="Logo SyntaxBase" className="reactImage" />
                        <div className="webCourses">
                            Beginner Game Development Tutorial<br />Learn Basics Of Game Development With C++!
                        </div>
                        <div className="arrow-circle"></div>
                    </a>
                </div>
                <div className='features3'>
                    <a href="/intermediateGameTutorial" className="reactDiv">
                        <img src={game2} alt="Logo SyntaxBase" className="reactImage" />
                        <div className="webCourses">
                            Intermediate Game Development Tutorial<br />Explore More Complex Instances Of Game Development!
                        </div>
                        <div className="arrow-circle"></div>
                    </a>
                </div>
                <div className="offerDiv2" style={{ paddingTop: '3em', marginBottom: '-5em' }}>
                    DATABASE MANAGMENT
                </div>
                <div className='features3'>
                    <a href="/beginnerDbTutorial" className="reactDiv">
                        <img src={db1} alt="Logo SyntaxBase" className="reactImage" />
                        <div className="webCourses">
                            Introduction To Databases<br />Learn Basics Of MySQL, PostgreSQL And MongoDB!
                        </div>
                        <div className="arrow-circle"></div>
                    </a>
                </div>
                <div className='features3'>
                    <a href="/intermediateDbTutorial" className="reactDiv">
                        <img src={db3} alt="Logo SyntaxBase" className="reactImage" />
                        <div className="webCourses">
                            Intermediate Database Tutorial<br />Learn How To Manipulate With Databases With pgAdmin4!
                        </div>
                        <div className="arrow-circle"></div>
                    </a>
                </div>
                <div className='features3'>
                    <a href="/advancedDbTutorial" className="reactDiv">
                        <img src={database} alt="Logo SyntaxBase" className="reactImage" />
                        <div className="webCourses">
                            Advanced Database Tutorial<br />Learn How To Manipulate With Databases With More Complex Instances!
                        </div>
                        <div className="arrow-circle"></div>
                    </a>
                </div>
                <div className="offerDiv2" style={{ paddingTop: '3em', marginBottom: '-5em' }}>
                    PROBLEM SOLVING
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
                <div className="offerDiv2" style={{ paddingTop: '3em', marginBottom: '-5em' }}>
                    INSTRUCTIONS
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
