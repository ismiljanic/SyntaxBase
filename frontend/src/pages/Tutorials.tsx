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

    useEffect(() => {

        const featureDiv2Options2 = {
            root: null,
            rootMargin: '0px',
            threshold: 0
        };


        const featureDiv2Observer2 = new IntersectionObserver(([entry]) => {
            setFeatureDiv2Visible2(entry.isIntersecting);
        }, featureDiv2Options2);

        const featureDiv2_2 = document.querySelector('.featureDiv2.feature2');

        if (featureDiv2_2) featureDiv2Observer2.observe(featureDiv2_2);

        return () => {
            if (featureDiv2_2) featureDiv2Observer2.unobserve(featureDiv2_2);
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
                    <a href="/beginnerWebTutorial/lesson/1" className="reactDiv">
                        <img src={web1} alt="Logo SyntaxBase" className="reactImage" />
                        <div className="webCourses">
                            Beginner Frontend Tutorial<br />Learn Frontend With React, Node.js And Express Development!
                        </div>
                        <div className="arrow-circle"></div>
                    </a>
                </div>
                <div className='features3'>
                    <a href="/intermediateWebTutorial/lesson/1" className="reactDiv">
                        <img src={web2} alt="Logo SyntaxBase" className="reactImage" />
                        <div className="webCourses">
                            Intermediate Frontend Tutorial<br />Learn More Complex Structures using React, Node.js And Express!
                        </div>
                        <div className="arrow-circle"></div>
                    </a>
                </div>
                <div className='features3'>
                    <a href="/advancedWebTutorial/lesson/1" className="reactDiv">
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
                    <a href="/gameEnginesTutorial/lesson/1" className="reactDiv">
                        <img src={picture2} alt="Logo SyntaxBase" className="reactImage" />
                        <div className="webCourses">
                            Game Engines Tutorial<br />Learn Basics Of Game Engines!
                        </div>
                        <div className="arrow-circle"></div>
                    </a>
                </div>
                <div className='features3'>
                    <a href="/beginnerGameTutorial/lesson/1" className="reactDiv">
                        <img src={game1} alt="Logo SyntaxBase" className="reactImage" />
                        <div className="webCourses">
                            Beginner Game Development Tutorial<br />Learn Basics Of Game Development With C++!
                        </div>
                        <div className="arrow-circle"></div>
                    </a>
                </div>
                <div className='features3'>
                    <a href="/intermediateGameTutorial/lesson/1" className="reactDiv">
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
                    <a href="/beginnerDbTutorial/lesson/1" className="reactDiv">
                        <img src={db1} alt="Logo SyntaxBase" className="reactImage" />
                        <div className="webCourses">
                            Introduction To Databases<br />Learn Basics Of MySQL, PostgreSQL And MongoDB!
                        </div>
                        <div className="arrow-circle"></div>
                    </a>
                </div>
                <div className='features3'>
                    <a href="/intermediateDbTutorial/lesson/1" className="reactDiv">
                        <img src={db3} alt="Logo SyntaxBase" className="reactImage" />
                        <div className="webCourses">
                            Intermediate Database Tutorial<br />Learn How To Manipulate With Databases With pgAdmin4!
                        </div>
                        <div className="arrow-circle"></div>
                    </a>
                </div>
                <div className='features3'>
                    <a href="/advancedDbTutorial/lesson/1" className="reactDiv">
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
                    <a href="/beginnerPsTutorial/lesson/1" className="reactDiv">
                        <img src={problem1} alt="Logo SyntaxBase" className="reactImage" />
                        <div className="webCourses">
                            Beginner Problem Solving<br />Solve Easy Problems And Learn Simple Algorithms
                        </div>
                        <div className="arrow-circle"></div>
                    </a>
                </div>
                <div className='features3'>
                    <a href="/intermediatePsTutorial/lesson/1" className="reactDiv">
                        <img src={problem2} alt="Logo SyntaxBase" className="reactImage" />
                        <div className="webCourses">
                            Intermediate Problem Solving<br />Learn Data Structures And More Complex Algorithms!
                        </div>
                        <div className="arrow-circle"></div>
                    </a>
                </div>
                <div className='features3'>
                    <a href="/advancedPsTutorial/lesson/1" className="reactDiv">
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
                    <a href="/calculusTutorial/lesson/1" className="reactDiv">
                        <img src={calculus1} alt="Logo SyntaxBase" className="reactImage" />
                        <div className="webCourses">
                            Calculus Tutorial<br />Learn Calculus With Examples And Tutorials!
                        </div>
                        <div className="arrow-circle"></div>
                    </a>
                </div>
                <div className='features3'>
                    <a href="/programmingTutoria/lesson/1" className="reactDiv">
                        <img src={instr2} alt="Logo SyntaxBase" className="reactImage" />
                        <div className="webCourses">
                            Programming Tutorial<br />Learn Basics Of Programming - Ideal For Beginners!
                        </div>
                        <div className="arrow-circle"></div>
                    </a>
                </div>
                <div className='features3'>
                    <a href="/linearAlgebraTutorial/lesson/1" className="reactDiv">
                        <img src={instr3} alt="Logo SyntaxBase" className="reactImage" />
                        <div className="webCourses">
                            Linear Alegbra Tutorial<br />Explore New Concepts With Linear Algebra Tutorial!
                        </div>
                        <div className="arrow-circle"></div>
                    </a>
                </div>
                <div className='features3'>
                    <a href="/oopTutorial/lesson/1" className="reactDiv">
                        <img src={instr4} alt="Logo SyntaxBase" className="reactImage" />
                        <div className="webCourses">
                            Object Oriented Tutorial<br />Advance Forward With Object Oriented Programming!
                        </div>
                        <div className="arrow-circle"></div>
                    </a>
                </div>
                <div className='features3'>
                    <a href="/algorithmAndDSTutorial/lesson/1" className="reactDiv">
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
