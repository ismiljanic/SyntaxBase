import { Header } from '../../../Header';
import { Footer } from '../../../Footer';
import { Footer2 } from '../../../Footer2';
import '../../../../styles/webCourses/BeginnerWebCourse/Lesson1.css';
import simpleHTML from '../../../../pages/webCourses/BeginnerWebCourse/images/simpleHtml.png';
import htmlStructure from '../../../../pages/webCourses/BeginnerWebCourse/images/htmlStructure.png';
import html1 from '../../../../pages/webCourses/BeginnerWebCourse/images/html1.png';


export function BeginnerWebTutorialLesson2() {
    const handleNextLesson = async () => {
        window.location.href = `/beginnerWebTutorial/lesson/3`;
    };

    const handlePreviousLesson = async () => {
        window.location.href = `/beginnerWebTutorial/lesson/1`;
    };

    return (
        <div className='mainContainer'>
            <Header bgColor="rgb(247, 250, 251)" />
            <div className='lessonIntroduction'>
                <h1>Introduction to HTML</h1>
                <p>Welcome to <b>Lesson 2</b> of the <b>Beginner Web Development tutorial</b>.</p>
            </div>
            <div className='aboutBeginnerWeb'>
                <div className="aboutCourseDiv2" style={{ paddingBottom: '7em' }}>
                    <div className="introductionDiv">Introduction</div>
                    <div className="frontImageBeginner">
                        <h1 className="headerDivText" style={{ fontSize: '1.7em' }}>
                            <div className="headerContainer" style={{ width: 'fit-content' }}>
                                What is HTML?
                            </div>
                            <div className="imageContainer">
                                <img src={simpleHTML} alt="" className="imageForCourse" />
                            </div>
                        </h1>
                    </div>

                    <div className="descriptionOfCourse">
                        HTML is the standard markup language for creating Web pages. It stands for Hyper Text Markup Language and it describes structure of Web Page. HTML consists of series of elements that tell browser how to display the content.
                    </div>
                </div>
                <div className="aboutCourseDiv2" style={{ paddingBottom: '2em' }}>
                    <div className="introductionDiv">HTML ELEMENTS</div>
                    <div className="frontImageBeginner">
                        <h1 className="headerDivText" style={{ fontSize: '1.7em' }}>
                            <div className="headerContainer" style={{ width: 'fit-content' }}>
                                Elements of HTML
                            </div>
                            <div className="imageContainer">
                                <img src={htmlStructure} alt="" className="imageForCourse" />
                            </div>
                        </h1>
                    </div>

                    <div className="descriptionOfCourse">
                        HTML is the standard markup language for creating Web pages. It stands for Hyper Text Markup Language and it describes structure of Web Page. HTML consists of series of elements that tell browser how to display the content.
                    </div>
                    <p className='paragraphP' style={{ paddingTop: '9em' }}>An HTML element is defined by a start tag, some content, and an end tag for example: <br></br> <code>
                        &lt;<span style={{ color: 'rgb(133, 214, 86)' }}>tagname</span>&gt;
                    </code>
                        Then some text here <code>
                            &lt;<span style={{ color: 'rgb(133, 214, 86)' }}>tagname</span>&gt;
                        </code>
                        <br>
                        </br>
                        There are a lot of tagnames in HTML, but in this course we will cover basic ones that are necessary to understand concepts of HTML.
                        <div className='htmlElementsDiv'>
                            <ul>
                                <li>The <code>
                                    &lt;<span style={{ color: 'rgb(133, 214, 86)' }}>!DOCTYPE html</span>&gt;
                                </code> declaration defines that this document is an HTML5 document
                                </li>
                                <li>The <code>
                                    &lt;<span style={{ color: 'rgb(133, 214, 86)' }}>html</span>&gt;
                                </code>  element is the root element of an HTML page
                                </li>
                                <li>The <code>
                                    &lt;<span style={{ color: 'rgb(133, 214, 86)' }}>head</span>&gt;
                                </code> element contains meta information about the HTML page
                                </li>
                                <li>The <code>
                                    &lt;<span style={{ color: 'rgb(133, 214, 86)' }}>title</span>&gt;
                                </code> element specifies a title for the HTML page (which is shown in the browser's title bar or in the page's tab)
                                </li>
                                <li>The <code>
                                    &lt;<span style={{ color: 'rgb(133, 214, 86)' }}>body</span>&gt;
                                </code> element defines the document's body, and is a container for all the visible contents, such as headings, paragraphs, images, hyperlinks, tables, lists, etc.
                                </li>
                                <li>The <code>
                                    &lt;<span style={{ color: 'rgb(133, 214, 86)' }}>h1</span>&gt;
                                </code> element defines a large heading
                                </li>
                                <li>The <code>
                                    &lt;<span style={{ color: 'rgb(133, 214, 86)' }}>p</span>&gt;
                                </code>  element defines a paragraph
                                </li>
                                <li>The <code>
                                    &lt;<span style={{ color: 'rgb(133, 214, 86)' }}>div</span>&gt;
                                </code>  element is by default a block element, meaning that it takes all available width, and comes with line breaks before and after.
                                </li>
                            </ul>
                        </div>
                    </p>
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
                        In this lesson you learned what is HTML and its basics.
                        Also, you got insight in how HTML contents are structured along with short view of basic HTML elements.
                        You were provided with four simple examples showing you how to manipulate with these elements.
                        In the next lesson you will learn how to customize and style your HTML contents with more advanced examples.
                    </div>

                    <div className='key-areas3' style={{ marginTop: '-10em' }}>
                        <div className="imageContainerWebBeginner2">
                            <img src={html1} alt="" className="imageForWebBeginner2" />
                            <div className="overlay">
                                <div className='keyAreasOfBeginnerWebDev3'>
                                    <strong>HTML (HyperText Markup Language):</strong>
                                    <div className='keyDescription2'>
                                        HTML is the standard markup language for creating Web pages. It stands for Hyper Text Markup Language and it describes structure of Web Page. HTML consists of series of elements that tell browser how to display the content.
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="imageContainerWebBeginner2">
                            <img src={html1} alt="" className="imageForWebBeginner2" />
                            <div className="overlay">
                                <div className='keyAreasOfBeginnerWebDev3'><strong>HTML elements</strong>
                                    <div className='keyDescription2' style={{ fontSize: '0.6em' }}>
                                        <ul>
                                            <li>The <code>
                                                &lt;<span style={{ color: 'rgb(133, 214, 86)' }}>!DOCTYPE html</span>&gt;
                                            </code> declaration defines that this document is an HTML5 document
                                            </li>
                                            <li>The <code>
                                                &lt;<span style={{ color: 'rgb(133, 214, 86)' }}>html</span>&gt;
                                            </code>  element is the root element of an HTML page
                                            </li>
                                            <li>The <code>
                                                &lt;<span style={{ color: 'rgb(133, 214, 86)' }}>head</span>&gt;
                                            </code> element contains meta information about the HTML page
                                            </li>
                                            <li>The <code>
                                                &lt;<span style={{ color: 'rgb(133, 214, 86)' }}>title</span>&gt;
                                            </code> element specifies a title for the HTML page (which is shown in the browser's title bar or in the page's tab)
                                            </li>
                                            <li>The <code>
                                                &lt;<span style={{ color: 'rgb(133, 214, 86)' }}>body</span>&gt;
                                            </code> element defines the document's body, and is a container for all the visible contents, such as headings, paragraphs, images, hyperlinks, tables, lists, etc.
                                            </li>
                                            <li>The <code>
                                                &lt;<span style={{ color: 'rgb(133, 214, 86)' }}>h1</span>&gt;
                                            </code> element defines a large heading
                                            </li>
                                            <li>The <code>
                                                &lt;<span style={{ color: 'rgb(133, 214, 86)' }}>p</span>&gt;
                                            </code>  element defines a paragraph
                                            </li>
                                            <li>The <code>
                                                &lt;<span style={{ color: 'rgb(133, 214, 86)' }}>div</span>&gt;
                                            </code>  element is by default a block element, meaning that it takes all available width, and comes with line breaks before and after.
                                            </li>
                                        </ul>
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
                <div className='goToPreviousLessonDiv' onClick={handlePreviousLesson} style={{ marginLeft: '-77.5em' }}>
                    Previous Lesson
                </div>
            </div>
            <Footer2 bgColor="rgb(247, 250, 251)" />
            <Footer bgColor="rgb(247, 250, 251)" />
        </div>
    );
}
