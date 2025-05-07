import React, { useEffect, useState } from 'react';
import '../styles/Help.css';
import { Header } from './Header';
import { Footer } from './Footer';
import { Footer2 } from './Footer2';
import teamMember from '../images/ivanSmiljanic.png'
import helpMe from '../images/helpMe.png'

export function Help() {
    const [language, setLanguage] = useState<'hr' | 'en'>('hr');
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const handleToggle = (index: number) => {
        setOpenIndex(prev => (prev === index ? null : index));
    };

    const services = [
        {
            title: {
                en: 'What is SyntaxBase?',
                hr: 'What is SyntaxBase?',
            },
            text: {
                en: 'SyntaxBase is a platform that provides tutorials and courses in the field of computer science. Our goal is to help you learn and improve your skills in programming and related areas.',
                hr: 'SyntaxBase is a platform that provides tutorials and courses in the field of computer science. Our goal is to help you learn and improve your skills in programming and related areas.',
            },
        },
        {
            title: {
                en: 'What courses do you provide?',
                hr: 'What courses do you provide?',
            },
            text: {
                en: 'We provide various computer science courses. You can get more information or apply for course by selecting courses option from top menu where you can find out about all of courses we provide.',
                hr: 'We provide various computer science courses. You can get more information or apply for course by selecting courses option from top menu where you can find out about all of courses we provide.',
            },
        },
        {
            title: {
                en: 'Where can I find your tutorials?',
                hr: 'Where can I find your tutorials?',
            },
            text: {
                en: 'All our tutorials are available in the "Tutorials" section of the website, which you can access from the top menu.',
                hr: 'All our tutorials are available in the "Tutorials" section of the website, which you can access from the top menu.',
            },
        },

        {
            title: {
                en: 'Can you apply for more courses at the same time?',
                hr: 'Can you apply for more courses at the same time?',
            },
            text: {
                en: 'Yes! You can apply for more courses at the same time. Choose courses you want to listen and apply for them. They will be available to you as long as you want once you apply for them.',
                hr: 'Yes! You can apply for more courses at the same time. Choose courses you want to listen and apply for them. They will be available to you as long as you want once you apply for them.',
            },
        },
        {
            title: {
                en: 'Do i have to pay for tutorials or courses?',
                hr: 'Do i have to pay for tutorials or courses?',
            },
            text: {
                en: 'You do not have to pay for any tutorials or courses. These tutorials and courses are made for everyone to learn for free without any limitations. If you want to support work of SyntaxBase you can contact us via email.',
                hr: 'You do not have to pay for any tutorials or courses. These tutorials and courses are made for everyone to learn for free without any limitations. If you want to support work of SyntaxBase you can contact us via email.',
            },
        },
    ];
    return (
        <div>
            <Header bgColor='#f6f6f6' />
            <main className="about-main">
                <section className="about-intro" data-aos="fade-up">
                    <div className="about-left">
                        <div className="about-text">
                            <h1 data-aos="fade-up">NEED HELP?</h1>
                            <p>We're Here For You!. Whether you're stuck on a coding challenge or need advice to improve your skills, our experienced developers are ready to assist you. Explore the resources below to find the guidance you need. We have available frequently asked questions, Developer Community, Live Support and more. Feel free to contact us at any time for any questions. We will be more than happy to answer because we are here for you.</p>
                            <p data-aos="fade-up">
                            </p>
                        </div>
                    </div>
                    <div className="about-right">
                        <div className="about-image">
                            <img src={helpMe} alt="About us" />
                        </div>
                        <div className="about-services" data-aos="fade-up">
                            <div className="accordion">
                                {services.map((service, index) => (
                                    <div key={index} className="accordion-item">
                                        <div className="accordion-header" onClick={() => handleToggle(index)}>
                                            <h3>{service.title[language]}</h3>
                                            <span className={`arrow ${openIndex === index ? 'open' : ''}`}>&#9662;</span>
                                        </div>
                                        <div className={`accordion-content ${openIndex === index ? 'open' : ''}`}>
                                            <p>{service.text[language]}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
                <section id="our-mission" className="section-padding">
                    <h2 data-aos="fade-up">Our Goal</h2>
                    <section id="core-values" className="section-padding">
                        <div className="values-container">
                            <div className="value" data-aos="fade-up">
                                <h3>Integrity</h3>
                                <p>
                                    We believe in honesty, transparency, and support. Whether you're facing a tough bug or want to grow your skills, our team is here to guide you. Browse our FAQ, join the Developer Community, or chat with Live Support. We're committed to helping you succeed—reach out any time!
                                </p>
                            </div>
                            <div className="value" data-aos="fade-up">
                                <h3>Reliability</h3>
                                <p>
                                    You can count on us. Our experienced developers are available to assist with your programming questions and challenges. From reliable documentation to real-time support, we’re always here when you need us. Don’t hesitate to contact us—we’ve got your back.
                                </p>
                            </div>
                            <div className="value" data-aos="fade-up">
                                <h3>Consistency</h3>
                                <p>
                                    We're dedicated to sustainable, long-term learning. Our platform is built to grow with you, offering resources that evolve with modern web development. Whether you're a beginner or a seasoned coder, you'll find tools that support ongoing improvement and best practices.
                                </p>
                            </div>

                        </div>
                    </section>
                </section>
                <section id="our-team" className="section-padding">
                    <h2 data-aos="fade-up">Our Team</h2>
                    <div className="team-grid">
                        <div className="team-member" data-aos="fade-up">
                            <img src={teamMember} alt="Team member 2" />
                            <h3 data-aos="fade-up">Ivan Smiljanić</h3>
                            <p data-aos="fade-up">Computer Science Student on FER</p>
                            <p data-aos="fade-up">This app is created and maintained by Computer Science student from Croatia.</p>
                        </div>
                    </div>
                </section>
            </main>
            <Footer2 bgColor='#f6f6f6' />
            <Footer bgColor='#f6f6f6' />
        </div>
    );
}
