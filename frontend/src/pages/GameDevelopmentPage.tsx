import React, { useState } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Footer2 } from "./Footer2";
import { useEffect } from "react";
import picture2 from '../images/gameDev.png';
import game1 from '../images/game1.png';
import game2 from '../images/game2.png';
import picture3 from '../images/desktop.png';
import picture5 from '../images/gameL.png';

export function GameDevelopmentPage() {
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
            <div className={`featureDiv2 feature2 ${featureDiv2Visible2 ? 'slide-in' : ''}`}>
                <header className="featureHeader2">GAME DEVELOPMENT</header>
                <div className="offerDiv2" style={{ paddingTop: '3em' }}>
                    Dive into our comprehensive courses to learn game development for Desktop, Android, and more. Whether you're crafting engaging 2D adventures or immersive 3D worlds, our tutorials cover everything from game design fundamentals and stunning graphics creation to programming and advanced game mechanics. Explore the possibilities with popular game engines like Unity and Unreal Engine, and bring your gaming vision to life. Start your journey from beginner to pro, and turn your game ideas into reality with our expert guidance.
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

                <div className={`offerDiv5 ${offerDiv5Visible ? 'slide-in' : 'slide-out'}`}>
                    <p>EXPLORE OUR COURSES</p>
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
            </div>
            <Footer2 bgColor="rgb(247, 250, 251)"></Footer2>
            <Footer bgColor="rgb(247, 250, 251)"></Footer>
        </div>
    );
}