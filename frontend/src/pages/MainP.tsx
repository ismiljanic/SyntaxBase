import React, { useEffect, useState } from 'react';
import '../styles/MainP.css'; // Import CSS file
import { Header } from './Header';
import { Footer } from './Footer';
import { Footer2 } from './Footer2';
import picture from '../images/reactWeb.png';
import picture2 from '../images/gameDev.png';
import picture3 from '../images/desktop.png';
import picture4 from '../images/database.png';
import picture5 from '../images/gameL.png';
import picture6 from '../images/probSolv.png';
import instr from '../images/instr.png';
import { useLocation } from 'react-router-dom';

export function MainP() {
    const [headerVisible, setHeaderVisible] = useState(false);
    const [featuresVisible, setFeaturesVisible] = useState(false);
    const [div1Visible, setDiv1Visible] = useState(false);
    const [div2Visible, setDiv2Visible] = useState(false);
    const [featureDiv2Visible1, setFeatureDiv2Visible1] = useState(false);
    const [featureDiv2Visible2, setFeatureDiv2Visible2] = useState(false);
    const [featureDiv2Visible3, setFeatureDiv2Visible3] = useState(false);
    const [featureDiv2Visible4, setFeatureDiv2Visible4] = useState(false);
    const [featureDiv2Visible5, setFeatureDiv2Visible5] = useState(false);
    const [offerDiv4Visible, setOfferDiv4Visible] = useState(false);
    const [offerDiv5Visible, setOfferDiv5Visible] = useState(false);
    const [offerDiv6Visible, setOfferDiv6Visible] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const headerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const featuresOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const div1Options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const div2Options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const featureDiv2Options1 = {
            root: null,
            rootMargin: '0px',
            threshold: 0
        };

        const featureDiv2Options2 = {
            root: null,
            rootMargin: '0px',
            threshold: 0
        };
        const featureDiv2Options3 = {
            root: null,
            rootMargin: '0px',
            threshold: 0
        };
        const featureDiv2Options4 = {
            root: null,
            rootMargin: '0px',
            threshold: 0
        };

        const featureDiv2Options5 = {
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

        const offerDiv6Options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.5
        };

        const headerObserver = new IntersectionObserver(([entry]) => {
            setHeaderVisible(entry.isIntersecting);
        }, headerOptions);

        const featuresObserver = new IntersectionObserver(([entry]) => {
            setFeaturesVisible(entry.isIntersecting);
        }, featuresOptions);

        const div1Observer = new IntersectionObserver(([entry]) => {
            setDiv1Visible(entry.isIntersecting);
        }, div1Options);

        const div2Observer = new IntersectionObserver(([entry]) => {
            setDiv2Visible(entry.isIntersecting);
        }, div2Options);

        const featureDiv2Observer1 = new IntersectionObserver(([entry]) => {
            setFeatureDiv2Visible1(entry.isIntersecting);
        }, featureDiv2Options1);

        const featureDiv2Observer2 = new IntersectionObserver(([entry]) => {
            setFeatureDiv2Visible2(entry.isIntersecting);
        }, featureDiv2Options2);

        const featureDiv2Observer3 = new IntersectionObserver(([entry]) => {
            setFeatureDiv2Visible3(entry.isIntersecting);
        }, featureDiv2Options3);

        const featureDiv2Observer4 = new IntersectionObserver(([entry]) => {
            setFeatureDiv2Visible4(entry.isIntersecting);
        }, featureDiv2Options4);

        const featureDiv2Observer5 = new IntersectionObserver(([entry]) => {
            setFeatureDiv2Visible5(entry.isIntersecting);
        }, featureDiv2Options5);

        const featureDiv2_1 = document.querySelector('.featureDiv2.feature1');
        const featureDiv2_2 = document.querySelector('.featureDiv2.feature2');
        const featureDiv2_3 = document.querySelector('.featureDiv2.feature3');
        const featureDiv2_4 = document.querySelector('.featureDiv2.feature4');
        const featureDiv2_5 = document.querySelector('.featureDiv2.feature5');
        const header = document.querySelector('.mainp-header');
        const features = document.querySelector('.features');
        const mainPageDiv1 = document.querySelector('.mainPageDiv1');
        const mainPageDiv2 = document.querySelector('.mainPageDiv2');

        if (header) headerObserver.observe(header);
        if (features) featuresObserver.observe(features);
        if (mainPageDiv1) div1Observer.observe(mainPageDiv1);
        if (mainPageDiv2) div2Observer.observe(mainPageDiv2);
        if (featureDiv2_1) featureDiv2Observer1.observe(featureDiv2_1);
        if (featureDiv2_2) featureDiv2Observer2.observe(featureDiv2_2);
        if (featureDiv2_3) featureDiv2Observer3.observe(featureDiv2_3);
        if (featureDiv2_4) featureDiv2Observer4.observe(featureDiv2_4);
        if (featureDiv2_5) featureDiv2Observer5.observe(featureDiv2_5);


        const offerDiv5Observer = new IntersectionObserver(([entry]) => {
            setOfferDiv5Visible(entry.isIntersecting);
        }, offerDiv5Options);

        const offerDiv4Observer = new IntersectionObserver(([entry]) => {
            setOfferDiv4Visible(entry.isIntersecting);
        }, offerDiv5Options);

        const offerDiv6Observer = new IntersectionObserver(([entry]) => {
            setOfferDiv6Visible(entry.isIntersecting);
        }, offerDiv6Options);

        const features3Elements = document.querySelectorAll('.features3');
        const offerDiv4Elements = document.querySelectorAll('.offerDiv4');
        const offerDiv5Elements = document.querySelectorAll('.offerDiv5');
        const offerDiv6Elements = document.querySelectorAll('.offerDiv6');

        offerDiv5Elements.forEach(el => offerDiv5Observer.observe(el));
        offerDiv4Elements.forEach(el => offerDiv4Observer.observe(el));
        offerDiv6Elements.forEach(el => offerDiv6Observer.observe(el));

        const params = new URLSearchParams(location.search);
        const scrollTo = params.get('scrollTo');

        if (scrollTo) {
            const targetSection = document.getElementById(scrollTo);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
        return () => {
            if (header) headerObserver.unobserve(header);
            if (features) featuresObserver.unobserve(features);
            if (mainPageDiv1) div1Observer.unobserve(mainPageDiv1);
            if (mainPageDiv2) div2Observer.unobserve(mainPageDiv2);
            if (featureDiv2_1) featureDiv2Observer1.unobserve(featureDiv2_1);
            if (featureDiv2_2) featureDiv2Observer2.unobserve(featureDiv2_2);
            if (featureDiv2_3) featureDiv2Observer3.unobserve(featureDiv2_3);
            if (featureDiv2_4) featureDiv2Observer4.unobserve(featureDiv2_4);
            if (featureDiv2_5) featureDiv2Observer5.unobserve(featureDiv2_5);
            offerDiv5Elements.forEach(el => offerDiv5Observer.unobserve(el));
            offerDiv4Elements.forEach(el => offerDiv4Observer.unobserve(el));
            offerDiv6Elements.forEach(el => offerDiv6Observer.unobserve(el));
        };

    }, [location]);

    return (
        <div className="mainp-container">
            <Header bgColor='rgb(227, 238, 246)'></Header>
            <header className="mainp-header">
                <h1 className={`${headerVisible ? 'slide-in' : 'hidden'}`}>SyntaxBase</h1>
                <p className={`${headerVisible ? 'slide-in' : 'hidden'}`}>Your go-to place for programming tutorials and more.</p>
            </header>
            <div className={`mainPageDiv1 ${div1Visible ? 'slide-in' : 'hidden'}`}>
                <div className='storyDiv'>
                    Unlock the world of coding with us. From foundational concepts to advanced techniques, we transform your curiosity into coding mastery and career success.
                </div>
                <div className='coursesDiv'>COURSES AVAILABLE
                    <div className='coursesNumber'> 20+</div>
                </div>
                <div className='projectsDiv'>PROJECTS COMPLETED
                    <div className='projectsNumber'> 100+</div>
                </div>
            </div>
            <div className={`mainPageDiv2 ${div2Visible ? 'slide-in' : 'hidden'}`}>
                <div className='storyDiv2'>
                    AREA WE COVER
                    <div className='storyDiv3'>
                        Improve your current knowledge in web development, game development or problem solving or learn from beginning.
                    </div>
                </div>
                <div className='areasToCoverDiv'>
                    <a href='/webDevelopment' className='areaDiv'>Web Development</a>
                    <a href='/gameDevelopment' className='areaDiv'>Game Development</a>
                    <a href='/databaseManipulation' className='areaDiv'>Database Manipulation</a>
                    <a href='/problemSolving' className='areaDiv'>Problem Solving</a>
                    <a href='/instructions' className='areaDiv'>Instructions</a>
                </div>
            </div>
            <div className='featureDiv' id='getting-started'>
                <header className={`featureHeader ${featuresVisible ? 'slide-in' : ''}`}>GETTING STARTED</header>
                <div className={`offerDiv ${featuresVisible ? 'slide-in' : ''}`} >Explore new trends and solve exciting problems.</div>
                <div className={`features ${featuresVisible ? 'slide-in' : ''}`}>
                    <a href="/tutorials" style={{ textDecoration: 'none' }} className="feature">
                        <div className="feature-content">
                            <p>INTERACTIVE TUTORIALS</p>
                            <h3 className='feature-head'>Programming exercises and tutorials to build your skills.</h3>
                            <p className='feature-description'></p>
                            <p className="feature-description">Dive into hands-on coding exercises and learn at your own pace with interactive tutorials tailored to your skill level.</p>
                            <a href="/tutorials" className="feature-button">Explore Tutorials</a>
                        </div>
                    </a>
                    <a href="/courses" style={{ textDecoration: 'none' }} className="feature">
                        <div className="feature-content">
                            <p>IMMERSIVE COURSES</p>
                            <h3 className='feature-head'>Our courses are structured to keep you engaged and motivated throughout your learning path.</h3>
                            <p className="feature-description">Explore comprehensive learning journey with our three-tier courses designed to elevate your skills.</p>
                            <a className="feature-button">Explore courses</a>
                        </div>
                    </a>
                    <a href="/guidance&help" style={{ textDecoration: 'none' }} className="feature">
                        <div className="feature-content">
                            <p>GUIDANCE & HELP</p>
                            <h3 className='feature-head'>Get insights and help from experienced developers.</h3>
                            <p className="feature-description">Receive personalized guidance and expert advice to overcome coding challenges and advance your learning journey.</p>
                            <a href="/help" className="feature-button">Get Help</a>
                        </div>
                    </a>
                    <a href="/support" style={{ textDecoration: 'none' }} className="feature">
                        <div className="feature-content">
                            <p>COMMUNITY SUPPORT</p>
                            <h3 className='feature-head'>Join a vibrant community of learners and professionals.</h3>
                            <p className="feature-description">Engage with fellow learners and professionals, participate in discussions, and collaborate on projects to enhance your skills.</p>
                            <a href="/community" className="feature-button">Join Community</a>
                        </div>
                    </a>
                </div>
            </div>


            <div className={`featureDiv2 feature1 ${featureDiv2Visible1 ? 'slide-in' : 'slide-out'}`} id='courses'>
                <header className="featureHeader2">WEB DEVELOPMENT</header>
                <div className="offerDiv2">
                    Build modern websites using popular technologies like React, Node.js, and Express to create high-performance, scalable, and user-friendly applications.
                </div>
                <div className="features2">
                    <a href="/webDevelopment" className="reactDiv">
                        <img src={picture} alt="Logo SyntaxBase" className="reactImage" />
                        <div className="webCourses">
                            Master Web Development<br />Build full-stack applications with frontend and backend courses!
                        </div>
                        <div className="arrow-circle"></div>
                    </a>
                </div>
            </div>



            <div className={`featureDiv2 feature2 ${featureDiv2Visible2 ? 'slide-in' : 'slide-out'}`}>
                <header className="featureHeader2">GAME DEVELOPMENT</header>
                <div className="offerDiv3">
                    <p>Dive into our comprehensive courses to learn game development for Desktop, Android, and more. Whether you're crafting engaging 2D adventures or immersive 3D worlds, our tutorials cover everything from game design fundamentals and stunning graphics creation to programming and advanced game mechanics. Explore the possibilities with popular game engines like Unity and Unreal Engine, and bring your gaming vision to life. Start your journey from beginner to pro, and turn your game ideas into reality with our expert guidance.</p>
                </div>

                <div className='features3'>
                    <a href="/gameDevelopment" className="reactDiv">
                        <img src={picture2} alt="Logo SyntaxBase" className="reactImage" />
                        <div className="webCourses">
                            Master Game Engines<br />Unlock Your Creativity And Build Games With Modern Game Engines!
                        </div>
                        <div className="arrow-circle"></div>
                    </a>
                </div>

                <div className={`offerDiv5 ${offerDiv5Visible ? 'slide-in' : 'slide-out'}`}>
                    <p>EXPLORE YOUR POTENITALS</p>
                </div>
                <div className='features3'>
                    <a href="/gameDevelopment" className="reactDiv">
                        <img src={picture3} alt="Logo SyntaxBase" className="reactImage" />
                        <div className="webCourses">
                            <br />Design Your Dream Games for Desktop or Android - Start Learning Today!
                        </div>
                        <div className="arrow-circle"></div>
                    </a>
                </div>
                <div className={`offerDiv4 ${offerDiv4Visible ? 'slide-in' : 'slide-out'}`}>
                    <p>ELEVATE YOUR SKILLS</p>
                </div>
                <div className="features3">
                    <a href="/gameDevelopment" className="reactDiv">
                        <img src={picture5} alt="Logo SyntaxBase" className="reactImage" />
                        <div className="webCourses">
                            <br />Level Up Your Game Development Skills: Master C# and C++ for Game Creation!
                        </div>
                        <div className="arrow-circle"></div>
                    </a>
                </div>
            </div>



            <div className={`featureDiv2 feature3 ${featureDiv2Visible3 ? 'slide-in' : 'slide-out'}`}>
                <header className="featureHeader2">DATABASE MANIPULATION</header>
                <div className="offerDiv2">
                    Explore comprehensive database tutorials and courses to master the art of managing and manipulating data. Whether you're new to databases or looking to refine your skills, our curriculum covers everything from the basics of SQL to advanced data modeling and optimization techniques. Learn how to design and implement efficient database architectures, ensure data integrity, and scale your applications with ease.
                </div>

                <div className="features3">
                    <a href="/databaseManagment" className="reactDiv">
                        <img src={picture4} alt="Logo SyntaxBase" className="reactImage" />
                        <div className="webCourses">
                            Master SQL Database<br />Transform Your Data Management Skills and Build Great Applications!
                        </div>
                        <div className="arrow-circle"></div>
                    </a>
                </div>
            </div>
            <div className={`featureDiv2 feature4 ${featureDiv2Visible4 ? 'slide-in' : 'slide-out'}`}>
                <header className="featureHeader2">PROBLEM SOLVING</header>
                <div className="offerDiv2">
                    Unlock the power of problem-solving with our in-depth tutorials designed to sharpen your analytical thinking and approach to complex issues. Our courses cover a wide array of problem-solving techniques and strategies, from fundamental concepts to advanced methodologies.
                </div>

                <div className="features3">
                    <a href="/problemSolving" className="reactDiv">
                        <img src={picture6} alt="Logo SyntaxBase" className="reactImage" />
                        <div className="webCourses">
                            Problem Solver<br />Enhance Your Analytical Skills and Tackle Challenges with Confidence!
                        </div>
                        <div className="arrow-circle"></div>
                    </a>
                </div>
            </div>
            <div className={`featureDiv2 feature5 ${featureDiv2Visible5 ? 'slide-in' : 'slide-out'}`}>
                <header className="featureHeader2">INSTRUCTIONS</header>
                <div className="offerDiv2">
                    Whether you're starting from scratch or looking to enhance your expertise, our courses offer clear, easy-to-follow instructions that guide you through every aspect of your learning journey. From foundational principles to advanced techniques, we provide hands-on exercises, real-world examples, and expert insights to help you build confidence and competence. Explore a wide range of topics, practice problem-solving, and gain the practical experience you need to excel. Start learning today and turn your goals into achievements with our comprehensive instructional resources.
                </div>

                <div className="features3">
                    <a href="/instructions" className="reactDiv">
                        <img src={instr} alt="Logo SyntaxBase" className="reactImage" />
                        <div className="webCourses">
                            <br />Master Essential Skills with Our Step-by-Step Tutorials!
                        </div>
                        <div className="arrow-circle"></div>
                    </a>
                </div>
            </div>

            <div className='featureDiv2'>
                <div className="features3">
                    <div className={`offerDiv6 ${offerDiv6Visible ? 'slide-in' : 'slide-out'}`}>
                        <p className='whatDiv'>SO, WHAT DO YOU SAY?</p>
                    </div>
                </div>
            </div>
            <Footer2 bgColor='#f5f5f5' />
            <Footer bgColor="#f5f5f5" />
        </div>
    );
}