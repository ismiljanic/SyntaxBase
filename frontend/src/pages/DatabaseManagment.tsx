import React, { useState } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Footer2 } from "./Footer2";
import { useEffect } from "react";
import db1 from '../images/db1.png';
import db2 from '../images/db2.png';
import db3 from '../images/db3.png';
import db4 from '../images/db4.png';
import db5 from '../images/db5.png';
import database from '../images/database.png';

export function DatabaseManagment() {
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
                <header className="featureHeader2">DATABASE MANAGMENT</header>
                <div className="offerDiv2" style={{ paddingTop: '3em' }}>
                    Explore comprehensive database tutorials and courses to master the art of managing and manipulating data. Whether you're new to databases or looking to refine your skills, our curriculum covers everything from the basics of SQL to advanced data modeling and optimization techniques. Learn how to design and implement efficient database architectures, ensure data integrity, and scale your applications with ease.
                </div>
                <div className='features3'>
                    <a href="/beginnerDatabaseTutorial" className="reactDiv">
                        <img src={db1} alt="Logo SyntaxBase" className="reactImage" />
                        <div className="webCourses">
                            Introduction To Databases<br />Learn Basics Of MySQL, PostgreSQL And MongoDB!
                        </div>
                        <div className="arrow-circle"></div>
                    </a>
                </div>
                <div className='features3'>
                    <a href="/intermediateDatabaseTutorial" className="reactDiv">
                        <img src={db3} alt="Logo SyntaxBase" className="reactImage" />
                        <div className="webCourses">
                            Intermediate Database Tutorial<br />Learn How To Manipulate With Databases With pgAdmin4!
                        </div>
                        <div className="arrow-circle"></div>
                    </a>
                </div>
                <div className='features3'>
                    <a href="/advancedDatabaseTutorial" className="reactDiv">
                        <img src={database} alt="Logo SyntaxBase" className="reactImage" />
                        <div className="webCourses">
                            Advanced Database Tutorial<br />Learn How To Manipulate With Databases With More Complex Instances!
                        </div>
                        <div className="arrow-circle"></div>
                    </a>
                </div>

                <div className={`offerDiv5 ${offerDiv5Visible ? 'slide-in' : 'slide-out'}`}>
                    <p>EXPLORE OUR COURSES</p>
                </div>
                <div className='features3'>
                    <a href="/beginnerDatabaseCourse" className="reactDiv">
                        <img src={db4} alt="Logo SyntaxBase" className="reactImage" />
                        <div className="webCourses">
                            Beginner Database Managment Course<br />Create Simple Database With Backend Connection!
                        </div>
                        <div className="arrow-circle"></div>
                    </a>
                </div>
                <div className="features3">
                    <a href="/intermediateDatabaseCourse" className="reactDiv">
                        <img src={db2} alt="Logo SyntaxBase" className="reactImage" />
                        <div className="webCourses">
                            Intermediate Database Managment Course<br />Create Complex Structure Of Database!
                        </div>
                        <div className="arrow-circle"></div>
                    </a>
                </div>
                <div className="features3">
                    <a href="/advancedDatabaseCourse" className="reactDiv">
                        <img src={db5} alt="Logo SyntaxBase" className="reactImage" />
                        <div className="webCourses">
                            Advanced Database Managment Course<br />Create Complex Database And Connect It To Full-Stack Application
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