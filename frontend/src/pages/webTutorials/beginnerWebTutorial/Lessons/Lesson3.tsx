import { Header } from '../../../Header';
import { Footer } from '../../../Footer';
import { Footer2 } from '../../../Footer2';
import '../../../../styles/webCourses/BeginnerWebCourse/Lesson1.css';
import cssProps from '../../../../pages/webCourses/BeginnerWebCourse/images/cssProps.png';
import css1 from '../../../../pages/webCourses/BeginnerWebCourse/images/css1.png';

export function BeginnerWebTutorialLesson3() {

    const handleNextLesson = async () => {
        window.location.href = `/BeginnerWebTutorial/lesson/4`;
    };

    const handlePreviousLesson = async () => {
        window.location.href = `/BeginnerWebTutorial/lesson/2`;
    };

    return (
        <div className='mainContainer'>
            <Header bgColor="rgb(247, 250, 251)" />
            <div className='lessonIntroduction'>
                <h1>Introduction to CSS</h1>
                <p>Welcome to <b>Lesson 3</b> of the <b>Beginner Web Development tutorial</b>.</p>
            </div>
            <div className='aboutBeginnerWeb'>
                <div className="aboutCourseDiv2" style={{ paddingBottom: '7em' }}>
                    <div className="introductionDiv">Introduction</div>
                    <div className="frontImageBeginner">
                        <h1 className="headerDivText" style={{ fontSize: '1.7em' }}>
                            <div className="headerContainer" style={{ width: 'fit-content' }}>
                                What is CSS?
                            </div>
                            <div className="imageContainer">
                                <img src={css1} alt="" className="imageForCourse" />
                            </div>
                        </h1>
                    </div>

                    <div className="descriptionOfCourse">
                        CSS is Cascading Style Sheets. It describes how HTML elements are displayed on the screen and it can also control the layout of multiple web pages at once.
                    </div>
                </div>
                <div className="aboutCourseDiv2" style={{ paddingBottom: '2em' }}>
                    <div className="introductionDiv">Syntax</div>
                    <div className="frontImageBeginner">
                        <h1 className="headerDivText" style={{ fontSize: '1.7em' }}>
                            <div className="headerContainer" style={{ width: 'fit-content' }}>
                                CSS Syntax
                            </div>
                            <div className="imageContainer">
                                <img src={cssProps} alt="" className="imageForCourse" />
                            </div>
                        </h1>
                    </div>

                    <div className="descriptionOfCourse">
                        A CSS rule consists of a selector and a declaration block.<br></br>
                        The selector points to the HTML element you want to style.<br></br>
                        The declaration block contains one or more declarations separated by semicolons.<br></br>
                        Each declaration includes a CSS property name and a value, separated by a colon.<br></br>
                        Multiple CSS declarations are separated with semicolons, and declaration blocks are surrounded by curly braces.
                    </div>
                </div>

                <div className="aboutCourseDiv2" style={{ paddingBottom: '7em' }}>
                    <div className="introductionDiv">Summary</div>
                    <div className="frontImageBeginner">
                        <h1 className="headerDivText" style={{ fontSize: '1.7em' }}>
                            <div className="headerContainer" style={{ width: 'fit-content' }}>
                                Lesson Summary
                            </div>
                            <div className="imageContainer" style={{ marginTop: '15em' }}>
                            </div>
                        </h1>
                    </div>

                    <div className="descriptionOfCourse">
                        In this lesson, you learned about the CSS Flexbox layout model and its importance in creating responsive designs.
                        You gained insight into how Flexbox simplifies the alignment and distribution of elements within a container.
                        Four practical examples guided you through setting up a basic layout, creating flexible boxes, and applying styles for enhanced visual appeal.
                        In the next lesson, you will explore more advanced CSS techniques to further customize and optimize your web layouts.
                    </div>

                    <div className='key-areas3' style={{ marginTop: '-10em' }}>
                        <div className="imageContainerWebBeginner2">
                            <img src={css1} alt="" className="imageForWebBeginner2" />
                            <div className="overlay">
                                <div className='keyAreasOfBeginnerWebDev3'>
                                    <strong>CSS</strong>
                                    <div className='keyDescription2'>
                                        CSS is Cascading Style Sheets. It describes how HTML elements are displayed on the screen and it can also control the layout of multiple web pages at once.
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="imageContainerWebBeginner2">
                            <img src={css1} alt="" className="imageForWebBeginner2" />
                            <div className="overlay">
                                <div className='keyAreasOfBeginnerWebDev3'><strong>CSS elements</strong>
                                    <div className='keyDescription2' style={{ fontSize: '0.9em' }}>
                                        A CSS rule consists of a selector and a declaration block.<br></br>
                                        The selector points to the HTML element you want to style.<br></br>
                                        The declaration block contains one or more declarations separated by semicolons.<br></br>
                                        Each declaration includes a CSS property name and a value, separated by a colon.<br></br>
                                        Multiple CSS declarations are separated with semicolons, and declaration blocks are surrounded by curly braces.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div style={{ display: 'flex' }}>
                <div className='moreCoursesDiv' onClick={handleNextLesson}>
                    Next Lesson
                </div>
                <div className='goToPreviousLessonDiv' onClick={handlePreviousLesson} style={{ marginLeft: '-78.3em' }}>
                    Previous Lesson
                </div>
            </div>
            <Footer2 bgColor="rgb(247, 250, 251)" />
            <Footer bgColor="rgb(247, 250, 251)" />
        </div>
    );
}
