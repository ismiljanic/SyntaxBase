import React, { useState } from "react";
import { Header } from '../pages/Header'
import { Footer } from '../pages/Footer';
import { Footer2 } from '../pages/Footer2';
import '../styles/EditableLesson.css';
import frontendBeginnerWeb from '../pages/webCourses/BeginnerWebCourse/images/frontendBeginnerWeb.png';
import backendBeginnerWeb from '../pages/webCourses/BeginnerWebCourse/images/backendBeginnerWeb.png';
import fsBeginnerWeb from '../pages/webCourses/BeginnerWebCourse/images/fsBeginnerWeb.png';
import beginnerWebDevImage from '../pages/webCourses/BeginnerWebCourse/images/beginnerWebDevImage.png';
import project1 from '../pages/webCourses/BeginnerWebCourse/images/project1.png';
import firstApp from '../pages/webCourses/BeginnerWebCourse/images/firstApp.png';
import contL from '../pages/webCourses/BeginnerWebCourse/images/contL.png';
import web6 from '../images/web6.png';


interface LessonContent {
    title: string;
    objectives: string[];
    sections: {
        subtitle?: string;
        paragraphs: string[];
        images?: {
            src: string;
            alt?: string;
            caption?: string;
        }[];
    }[];
}

interface EditableLessonProps {
    initialLesson: LessonContent;
    onNext: () => void;
    onPrevious: () => void;
}

export function LessonTemplate({ initialLesson, onNext, onPrevious }: EditableLessonProps) {
    const [lesson, setLesson] = useState<LessonContent>(initialLesson);

    const updateTitle = (val: string) => setLesson(prev => ({ ...prev, title: val }));

    const updateObjective = (idx: number, val: string) => {
        const newObjectives = [...lesson.objectives];
        newObjectives[idx] = val;
        setLesson(prev => ({ ...prev, objectives: newObjectives }));
    };

    const updateSectionSubtitle = (idx: number, val: string) => {
        const newSections = [...lesson.sections];
        newSections[idx].subtitle = val;
        setLesson(prev => ({ ...prev, sections: newSections }));
    };

    const updateSectionParagraph = (sectionIdx: number, paraIdx: number, val: string) => {
        const newSections = [...lesson.sections];
        const newParagraphs = [...newSections[sectionIdx].paragraphs];
        newParagraphs[paraIdx] = val;
        newSections[sectionIdx].paragraphs = newParagraphs;
        setLesson(prev => ({ ...prev, sections: newSections }));
    };

    const updateSectionImage = (sectionIdx: number, imgIdx: number, field: 'src' | 'caption' | 'alt', val: string) => {
        const newSections = [...lesson.sections];
        if (!newSections[sectionIdx].images) return;
        const newImages = [...newSections[sectionIdx].images!];
        newImages[imgIdx] = { ...newImages[imgIdx], [field]: val };
        newSections[sectionIdx].images = newImages;
        setLesson(prev => ({ ...prev, sections: newSections }));
    };

    const [title, setTitle] = useState("Introduction to Web Development");
    const [introText, setIntroText] = useState("Welcome to Lesson 1 of the Beginner Web Development tutorial.");
    const [sectionTitle, setSectionTitle] = useState("What is Web Development?");
    const [description, setDescription] = useState(
        "At its core, web development refers to the creation of websites and web applications that are accessible through the internet. Every website you visit, from small personal blogs to massive e-commerce platforms like Amazon, has been carefully designed and built by web developers."
    );
    const [areaTitle, setAreaTitle] = useState("Areas of Web Development");

    const [frontendDesc, setFrontendDesc] = useState(
        "This is what users see and interact with on a website. It involves working with languages like HTML, CSS, and JavaScript to build the layout, design, and functionality of a website."
    );
    const [backendDesc, setBackendDesc] = useState(
        "The backend is what happens behind the scenes. It's responsible for managing the data, servers, and databases that make a website function properly. Backend development often involves languages like Python, PHP, Ruby, Node.js or Spring Boot."
    );
    const [fullstackDesc, setFullstackDesc] = useState(
        "A full-stack developer works on both the frontend and backend of a website, handling everything from the design to the server management."
    );

    const [whyTitle, setWhyTitle] = useState("Why Learn Web Development?");
    const [whyDesc, setWhyDesc] = useState(
        "The internet is the backbone of modern society. Businesses, educational institutions, and entertainment industries all rely on websites and web applications to connect with users and provide services. Learning web development empowers you to create engaging and interactive digital experiences, no matter your goals."
    );

    const [images, setImages] = useState([
        { src: "", caption: "Creativity Meets Technology" },
        { src: "", caption: "In-Demand Skills" },
        { src: "", caption: "Build Your Own Projects" },
        { src: "", caption: "Continuous Learning" },
    ]);

    const updateImage = (index: number, field: 'src' | 'caption', value: string) => {
        const updated = [...images];
        updated[index][field] = value;
        setImages(updated);
    };

    return (
        <div className='mainContainer'>
            <Header bgColor="rgb(247, 250, 251)" />
            <div className='lessonIntroduction'>
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="lessonIntroduction__title"
                    style={{ fontSize: "2rem", fontWeight: "bold", width: "100%", marginBottom: "0.5rem" }}
                />
                <textarea
                    value={introText}
                    onChange={(e) => setIntroText(e.target.value)}
                    style={{ width: "100%", marginBottom: "1rem" }}
                />
            </div>

            <div className='aboutBeginnerWeb'>
                <div className="aboutCourseDiv2" style={{ paddingBottom: '7em' }}>
                    <div className="introductionDiv">Introduction</div>
                    <div className="frontImageBeginner">
                        <h1 className="headerDivText" style={{ fontSize: '1.7em' }}>
                            <input
                                value={sectionTitle}
                                onChange={(e) => setSectionTitle(e.target.value)}
                                style={{ fontSize: "1.2rem", width: "100%", marginBottom: "0.5rem", border: "none" }}
                            />
                            <div className="imageContainer">
                                <input
                                    placeholder="Image URL"
                                    value={contL}
                                />
                                <img src={contL} alt="" className="imageForCourse" />
                            </div>
                        </h1>
                    </div>

                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        style={{ width: "100%", minHeight: "6em", fontSize: "1rem" }}
                    />
                </div>

                <div className="aboutCourseDiv2" style={{ marginBottom: '-8em' }}>
                    <div className="introductionDiv" style={{ marginLeft: '0.2em' }}>KEY AREAS</div>
                    <div className="frontImageBeginner">
                        <h1 className="headerDivText" style={{ fontSize: '1.7em' }}>
                            <input
                                value={areaTitle}
                                onChange={(e) => setAreaTitle(e.target.value)}
                                style={{ fontSize: "1.2rem", width: "100%", border: "none" }}
                            />
                        </h1>
                    </div>
                </div>

                <div className='key-areas2'>
                    <div className="imageContainerWebBeginner">
                        <img src={backendBeginnerWeb} alt="" className="imageForWebBeginner" />
                        <div className="overlay">
                            <div className='keyAreasOfBeginnerWebDev'>
                                <strong>Frontend Development (Client-Side):</strong>
                                <textarea
                                    value={frontendDesc}
                                    onChange={(e) => setFrontendDesc(e.target.value)}
                                    className='keyDescription'
                                    style={{ width: "100%" }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="imageContainerWebBeginner">
                        <img src={fsBeginnerWeb} alt="" className="imageForWebBeginner" />
                        <div className="overlay">
                            <div className='keyAreasOfBeginnerWebDev2'>
                                <strong>Backend Development (Server-Side):</strong>
                                <textarea
                                    value={backendDesc}
                                    onChange={(e) => setBackendDesc(e.target.value)}
                                    className='keyDescription'
                                    style={{ width: "100%" }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="imageContainerWebBeginner">
                        <img src={beginnerWebDevImage} alt="" className="imageForWebBeginner" />
                        <div className="overlay">
                            <div className='keyAreasOfBeginnerWebDev' style={{ marginTop: '-12em' }}>
                                <strong>Full Stack Development</strong>
                                <textarea
                                    value={fullstackDesc}
                                    onChange={(e) => setFullstackDesc(e.target.value)}
                                    className='keyDescription'
                                    style={{ width: "100%" }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex' }}>
                    <div className='moreCoursesDiv' onClick={onNext} style={{ cursor: "pointer" }}>
                        Next Lesson
                    </div>
                    <div className='goToPreviousLessonDiv' onClick={onPrevious} style={{ marginLeft: '-77.5em' }}>
                        Previous Lesson
                    </div>
                </div>
            </div>

            <Footer2 bgColor="rgb(247, 250, 251)" />
            <Footer bgColor="rgb(247, 250, 251)" />
        </div>
    );
}