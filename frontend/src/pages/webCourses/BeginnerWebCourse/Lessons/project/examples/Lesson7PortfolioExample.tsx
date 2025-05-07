import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Header } from '../../../../../Header';
import { Footer } from '../../../../../Footer';
import { Footer2 } from '../../../../../Footer2';
import '../../../../../../styles/webCourses/BeginnerWebCourse/Lesson1.css';
import structure from '../../../../../../pages/webCourses/BeginnerWebCourse/images/structure.png';
import projectStructure from '../../../../../../pages/webCourses/BeginnerWebCourse/images/portfolioExample.png';
import portfolioExample2 from '../../../../../../pages/webCourses/BeginnerWebCourse/images/portfolioExample2.png';
import portfolioExamplecss from '../../../../../../pages/webCourses/BeginnerWebCourse/images/portfolioExamplecss.png';
import portfolioExampleDetails from '../../../../../../pages/webCourses/BeginnerWebCourse/images/portfolioExampleDetails.png';
import portfolioExampleContact from '../../../../../../pages/webCourses/BeginnerWebCourse/images/portfolioExampleContact.png';
import contL from '../../../../../../pages/webCourses/BeginnerWebCourse/images/contL.png';
import '../examples/Lesson7PortfolioExample.css';

export function Lesson7PortfolioExample() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(true);
    const location = useLocation();

    const userId = sessionStorage.getItem('userId');

    const services = [
        {
            title: { en: "Portfolio structure"},
            text: "First create folder for your portfolio. Inside that folder you will create your React app. You can name it whatever you want. In this example we will name it 'myportfolio'. Inside src folder you will folders to maintain your project. You can name them whatever you want. For example you can name them assets, components, pages, styles, etc. Inside assets folder you will put your images and .css files. Inside components folder you will put your components like headers and footers. Inside pages folder you will put your pages which will represent your portfolio.",
            image: projectStructure,
        },
        {
            title: { en: "Header and Footer" },
            text : "You can create your header and footer in components folder. You can name them Header.tsx and Footer.tsx. You can use the same code as in previous examples. Keep it simple and clean. In header you can put your logo and navigation. In footer you can put your contact information and social media links.",
            image: structure,
        },
        {
            title: { en: "Home Page" },
            text: "You can create your home page in pages folder. You can name it Home.tsx. In this page you can put your introduction and your portfolio. You can use the same code as in previous examples. Keep it simple and clean.",
            image: portfolioExample2,
        },
        {
            title: { en: "Styling and css" },
            text: "You can create your css file in styles folder. You can name it Home.css. In this file you can put your css code. Use modern css techniques like flexbox and grid. Try to maintain your code for responsiveness. You can use media queries to make your portfolio responsive. You can use the same code as in previous examples. Keep it simple and clean.",
            image: portfolioExamplecss,
        },
        {
            title: { en: "Add more details" },
            text: "You can add more details to your portfolio. You can add your projects, your skills, your education, your experience, etc.",
            image: portfolioExampleDetails,
        },
        {
            title: { en: "Add contact form" },
            text: "You can add contact form to your portfolio or any social media links so that your potential clients can contact you.",
            image: portfolioExampleContact,
        },
        {
            title: { en: "Finishing touches"},
            text: "You can add finishing touches to your portfolio. You can add your logo, your color scheme, your fonts, etc. Be creative and make the most out of it.",
            image: contL,
        },
    ];

    useEffect(() => {
        const checkFeedbackStatus = async () => {
            if (!userId) {
                console.error('User ID is not found in session storage');
                setLoading(false);
                return;
            }
        };

        checkFeedbackStatus();
    }, [userId]);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const scrollTo = params.get('scrollTo');
        if (scrollTo) {
            const targetSection = document.getElementById(scrollTo);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, [location.search]);

    if (loading) return <p>Loading...</p>;


    return (
        <div>
            <Header bgColor="rgb(247, 250, 251)" />
            <div>
                <h1 className='serviceh1'>PORTFOLIO EXAMPLE</h1>
                {services.map((service, index) => (
                    <div className={`service-item ${index % 2 !== 0 ? 'reverse' : ''}`} key={index}>
                        <div className="service-content">
                            <div className="service-text">
                                <h1 className='serviceh1-2nd'>{service.title.en}</h1>
                                <p>{service.text}</p>
                            </div>
                            <div className="service-image">
                                <img src={service.image}/>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <Footer2 bgColor="rgb(247, 250, 251)" />
            <Footer bgColor="rgb(247, 250, 251)" />
        </div>
    );
}
