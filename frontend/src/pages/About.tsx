import React, { useState, useEffect } from 'react';
import '../styles/About.css';
import { Header } from './Header';
import { Footer } from './Footer';
import { Footer2 } from './Footer2';
import aboutImage from '../images/ivanSmiljanic.png';

export function About() {
    const [language, setLanguage] = useState<'en' | 'hr'>('en');
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const [currentTestimonial, setCurrentTestimonial] = useState(0);

    const services = [
        {
            title: {
                en: '1-on-1 Mentoring',
                hr: 'Individualno Mentorstvo',
            },
            text: {
                en: 'Get personalized guidance from experienced developers. Whether you need help with a specific problem or want career advice, our mentors are here to support your growth.',
                hr: 'Dobijte personalizirano vodstvo od iskusnih programera. Bilo da trebate pomoć s određenim problemom ili savjet za karijeru, naši mentori su tu da vas podrže.',
            },
        },
        {
            title: {
                en: 'Code Review',
                hr: 'Pregled Koda',
            },
            text: {
                en: 'Improve your code quality with detailed feedback from senior developers. We help identify bugs, suggest improvements, and ensure your code follows best practices.',
                hr: 'Poboljšajte kvalitetu svog koda uz detaljne povratne informacije od iskusnih developera. Pomažemo u pronalasku grešaka, prijedlozima za poboljšanja i primjeni najboljih praksi.',
            },
        },
        {
            title: {
                en: 'Live Debugging Sessions',
                hr: 'Debugging u Živo',
            },
            text: {
                en: 'Join live sessions where we solve bugs together, explain debugging techniques, and guide you through fixing issues in your code.',
                hr: 'Sudjelujte u sesijama uživo gdje zajedno rješavamo bugove, objašnjavamo tehnike debuggiranja i vodimo vas kroz ispravljanje problema u vašem kodu.',
            },
        },
        {
            title: {
                en: 'Career Guidance',
                hr: 'Savjetovanje za Karijeru',
            },
            text: {
                en: 'Not sure what to focus on? We help you plan your learning path, build your portfolio, and prepare for technical interviews or job applications.',
                hr: 'Niste sigurni na što se fokusirati? Pomažemo vam isplanirati put učenja, izgraditi portfelj i pripremiti se za tehničke intervjue ili prijave za posao.',
            },
        },
        {
            title: {
                en: 'Project Feedback',
                hr: 'Povratna Informacija za Projekte',
            },
            text: {
                en: 'Share your personal or school projects with us and receive constructive feedback to help you improve structure, performance, and usability.',
                hr: 'Podijelite svoje osobne ili školske projekte s nama i primite konstruktivne povratne informacije za poboljšanje strukture, performansi i upotrebljivosti.',
            },
        },
    ];

    const testimonials = [
        {
            text: language === 'en'
                ? "This platform transformed my coding skills. The tutorials are practical and easy to follow!"
                : "This platform transformed my coding skills. The tutorials are practical and easy to follow!",
            client: language === 'en' ? "Luka" : "Luka",
        },
        {
            text: language === 'en'
                ? "The community support here is phenomenal. Whenever I get stuck, help is just a message away."
                : "The community support here is phenomenal. Whenever I get stuck, help is just a message away.",
            client: language === 'en' ? "Marko" : "Marko",
        },
    ];

    const handleToggle = (index: number) => {
        setOpenIndex(prev => (prev === index ? null : index));
    };

    return (
        <div>
            <Header bgColor='#f6f6f6' />
            <main className="about-main">
                <section className="about-intro" data-aos="fade-up">
                    <div className="about-left">
                        <div className="about-text">
                            <h1 data-aos="fade-up">{language === 'en' ? "About Our Platform" : "About Our Platform"}</h1>
                            <p data-aos="fade-up">
                                {language === 'en'
                                    ? "Welcome to SyntaxBase, where developers, learners, and enthusiasts come together to grow their skills and solve real-world challenges. Our mission is to provide accessible and quality learning experiences to help you reach your full potential as a developer. SyntaxBase is student project created by Computer Science student Ivan Smiljanić. He is currently pursuing Software Engineering and Computer Science on FER Zagreb, Croatia. This project is created for better understanding of how web applications work, creating intuitive web application with three layers. Topic of this project is carefully considered in order to incorporate multiple projects within one big project. Hope you enjoy my app!"
                                    : "Welcome to SyntaxBase, where developers, learners, and enthusiasts come together to grow their skills and solve real-world challenges. Our mission is to provide accessible and quality learning experiences to help you reach your full potential as a developer. SyntaxBase is student project created by Computer Science student Ivan Smiljanić. He is currently pursuing Software Engineering and Computer Science on FER Zagreb, Croatia. This project is created for better understanding of how web applications work, creating intuitive web application with three layers. Topic of this project is carefully considered in order to incorporate multiple projects within one big project. Hope you enjoy my app!"
                                }
                            </p>
                        </div>
                    </div>
                    <div className="about-right" data-aos="fade-left">
                        <div className="about-image" data-aos="fade-left">
                            <img src={aboutImage} alt="About us" />
                        </div>
                        <div className="about-services" >
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
                <section id="our-mission" className="section-padding" data-aos="fade-up">
                    <h2 data-aos="fade-up">{language === 'en' ? "Our mission" : "Naša misija"}</h2>
                    <section id="core-values" className="section-padding">
                        <div className="values-container" data-aos="fade-up">
                            <div className="value" data-aos="fade-up">
                                <h3 data-aos="fade-up">{language === 'en' ? "Accessibility" : "Accessibility"}</h3>
                                <p data-aos="fade-up">{language === 'en'
                                    ? "We aim to democratize coding education by offering a platform where anyone can learn, build, and excel, regardless of their experience level. We believe in fostering an inclusive, supportive community where innovation and creativity thrive. Coding should be for everyone, which is why we ensure our content is accessible to all."
                                    : "We aim to democratize coding education by offering a platform where anyone can learn, build, and excel, regardless of their experience level. We believe in fostering an inclusive, supportive community where innovation and creativity thrive. Coding should be for everyone, which is why we ensure our content is accessible to all."
                                }</p>
                            </div>
                            <div className="value" data-aos="fade-up">
                                <h3>{language === 'en' ? "Innovation" : "Innovation"}</h3>
                                <p>{language === 'en'
                                    ? "We push the boundaries of what's possible in online learning. We want to create simple surroundings easy to follow and create."
                                    : "We push the boundaries of what's possible in online learning. We want to create simple surroundings easy to follow and create."
                                }</p>
                            </div>
                            <div className="value" data-aos="fade-up">
                                <h3>{language === 'en' ? "Quality" : "Quality"}</h3>
                                <p>{language === 'en'
                                    ? "We are committed to providing the best resources and experiences for our users. Together, we learn faster and achieve more."
                                    : "We are committed to providing the best resources and experiences for our users. Together, we learn faster and achieve more."
                                }</p>
                            </div>
                        </div>
                    </section>
                </section>
                <section id="our-team" className="section-padding">
                    <h2 data-aos="fade-up">{language === 'en' ? "Meet the Team" : "Meet the Team"}</h2>
                    <div className="team-grid">
                        <div className="team-member" data-aos="fade-up">
                            <img src={aboutImage} alt="Team member 2" />
                            <h3 data-aos="fade-up">Ivan Smiljanić</h3>
                            <p data-aos="fade-up">{language === 'en' ? "Software engineer" : "Software engineer"}</p>
                            <p data-aos="fade-up">{language === 'en'
                                ? "Student pursuing Computer Science on FER, Croatia. Founder of SyntaxBase."
                                : "Student pursuing Computer Science on FER, Croatia. Founder of SyntaxBase."
                            }</p>
                        </div>
                    </div>
                </section>
                <section id="testimonials" className="section-padding">
                    <h2 data-aos="fade-up">
                        {language === 'en' ? "Client Testimonials" : "Client Testimonials"}
                    </h2>

                    <div className="testimonial-carousel">
                        {testimonials.map((testimonial, index) => (
                            <div
                                key={index}
                                className={`testimonial-item ${index === currentTestimonial ? 'active' : ''}`}
                            >
                                <p data-aos="fade-up">{testimonial.text}</p>
                                <p className="client-name" data-aos="fade-up">{testimonial.client}</p>
                            </div>
                        ))}
                    </div>

                    <div className="testimonial-navigation">
                        <button
                            className="arrow-button left"
                            onClick={() => setCurrentTestimonial((currentTestimonial - 1 + testimonials.length) % testimonials.length)}
                        >
                            &lt;
                        </button>

                        <button
                            className="arrow-button right"
                            onClick={() => setCurrentTestimonial((currentTestimonial + 1) % testimonials.length)}
                        >
                            &gt;
                        </button>

                        <div className="dots">
                            {testimonials.map((_, index) => (
                                <span
                                    key={index}
                                    className={`dot ${index === currentTestimonial ? 'active' : ''}`}
                                    onClick={() => setCurrentTestimonial(index)}
                                />
                            ))}
                        </div>
                    </div>
                </section>

            </main>
            <Footer2 bgColor='#f6f6f6' />
            <Footer bgColor='#f6f6f6' />
        </div>
    );
};

export default About;