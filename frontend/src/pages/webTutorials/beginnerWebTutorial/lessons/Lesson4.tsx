import { Header } from '../../../Header';
import { Footer } from '../../../Footer';
import { Footer2 } from '../../../Footer2';
import '../../../../styles/webCourses/BeginnerWebCourse/Lesson1.css';
import css1 from '../../../../pages/webCourses/BeginnerWebCourse/images/css1.png';
import borders from '../../../../pages/webCourses/BeginnerWebCourse/images/borders.png';
import borders2 from '../../../../pages/webCourses/BeginnerWebCourse/images/borders2.png';
import margins from '../../../../pages/webCourses/BeginnerWebCourse/images/margins.png';


export function BeginnerWebTutorialLesson4() {

    const handleNextLesson = async () => {
        window.location.href = `/beginnerWebTutorial/lesson/5`;
    };

    const handlePreviousLesson = async () => {
        window.location.href = `/beginnerWebTutorial/lesson/3`;
    };

    return (
        <div className='mainContainer'>
            <Header bgColor="rgb(247, 250, 251)" />
            <div className='lessonIntroduction'>
                <h1>CSS</h1>
                <p>Welcome to <b>Lesson 4</b> of the <b>Beginner Web Development tutorial</b>.</p>
            </div>
            <div className='aboutBeginnerWeb'>
                <div className="aboutCourseDiv2" style={{ paddingBottom: '7em' }}>
                    <div className="introductionDiv">BORDERS</div>

                    <div className="frontImageBeginner">
                        <h1 className="headerDivText" style={{ fontSize: '1.7em' }}>
                            <div className="headerContainer" style={{ width: 'fit-content' }}>
                                CSS Borders
                            </div>
                            <div className="imageContainer">
                                <img src={borders} alt="" className="imageForCourse" />
                            </div>
                        </h1>
                    </div>

                    <div className="descriptionOfCourse">
                        CSS is Cascading Style Sheets. It describes how HTML elements are displayed on the screen and it can also control the layout of multiple web pages at once.
                    </div>

                    <div className="borderExplanation" style={{ marginTop: '2em' }}>
                        <h2>Understanding Border Styles</h2>
                        <p style={{ fontSize: '0.9em' }}>The <code className='borders'>border-style</code> property specifies what kind of border to display. The following values are allowed:</p>
                        <ul style={{ fontSize: '0.9em' }}>
                            <li><code className='borders'>dotted</code> - Defines a dotted border</li>
                            <li><code className='borders'>dashed</code> - Defines a dashed border</li>
                            <li><code className='borders'>solid</code> - Defines a solid border</li>
                            <li><code className='borders'>double</code> - Defines a double border</li>
                            <li><code className='borders'>groove</code> - Defines a 3D grooved border. The effect depends on the <code className='borders'>border-color</code> value</li>
                            <li><code className='borders'>ridge</code> - Defines a 3D ridged border. The effect depends on the <code className='borders'>border-color</code> value</li>
                            <li><code className='borders'>inset</code> - Defines a 3D inset border. The effect depends on the <code className='borders'>border-color</code> value</li>
                            <li><code className='borders'>outset</code> - Defines a 3D outset border. The effect depends on the <code className='borders'>border-color</code> value</li>
                            <li><code className='borders'>none</code> - Defines no border</li>
                            <li><code className='borders'>hidden</code> - Defines a hidden border</li>
                        </ul>

                        <p style={{ fontSize: '0.9em' }}>The <code className='borders'>border-style</code> property can accept one to four values, where you can specify different border styles for the top, right, bottom, and left sides of an element:</p>
                        <ul style={{ fontSize: '0.9em' }}>
                            <li>If one value is specified, it applies to all four sides.</li>
                            <li>If two values are specified, the first applies to the top and bottom, the second applies to the left and right.</li>
                            <li>If three values are specified, the first applies to the top, the second to the left and right, and the third to the bottom.</li>
                            <li>If four values are specified, they apply to the top, right, bottom, and left respectively.</li>
                        </ul>
                    </div>

                    <div className="introductionDiv" style={{ paddingTop: '7em' }}>EXAMPLE</div>
                    <div className="frontImageBeginner">
                        <h1 className="headerDivText" style={{ fontSize: '1.7em' }}>
                            <div className="headerContainer" style={{ width: 'fit-content' }}>
                                Demonstration of Example
                            </div>
                            <div className="imageContainer">
                                <img src={borders2} alt="" className="imageForCourse" />
                            </div>
                        </h1>

                        <div className="descriptionOfCourse" style={{ marginBottom: '-3em', fontSize: '0.8em', marginTop: '-28em' }}>
                            <p>
                                <code>
                                    <span style={{ color: '#ff5678' }}>p.dotted</span> {' '}
                                    <span style={{ color: '#f8f8f2' }}>{'{'}</span> {' '}
                                    <span style={{ color: '#007bff' }}>border-style</span>: {' '}
                                    <span style={{ color: 'green' }}>dotted</span>; {' '}
                                    <span style={{ color: '#f8f8f2' }}>{'}'}</span>
                                </code>
                            </p>
                            <p>
                                <code>
                                    <span style={{ color: '#ff5678' }}>p.dashed</span> {' '}
                                    <span style={{ color: '#f8f8f2' }}>{'{'}</span> {' '}
                                    <span style={{ color: '#007bff' }}>border-style</span>: {' '}
                                    <span style={{ color: 'green' }}>dashed</span>; {' '}
                                    <span style={{ color: '#f8f8f2' }}>{'}'}</span>
                                </code>
                            </p>
                            <p>
                                <code>
                                    <span style={{ color: '#ff5678' }}>p.solid</span> {' '}
                                    <span style={{ color: '#f8f8f2' }}>{'{'}</span> {' '}
                                    <span style={{ color: '#007bff' }}>border-style</span>: {' '}
                                    <span style={{ color: 'green' }}>solid</span>; {' '}
                                    <span style={{ color: '#f8f8f2' }}>{'}'}</span>
                                </code>
                            </p>
                            <p>
                                <code>
                                    <span style={{ color: '#ff5678' }}>p.double</span> {' '}
                                    <span style={{ color: '#f8f8f2' }}>{'{'}</span> {' '}
                                    <span style={{ color: '#007bff' }}>border-style</span>: {' '}
                                    <span style={{ color: 'green' }}>double</span>; {' '}
                                    <span style={{ color: '#f8f8f2' }}>{'}'}</span>
                                </code>
                            </p>
                            <p>
                                <code>
                                    <span style={{ color: '#ff5678' }}>p.groove</span> {' '}
                                    <span style={{ color: '#f8f8f2' }}>{'{'}</span> {' '}
                                    <span style={{ color: '#007bff' }}>border-style</span>: {' '}
                                    <span style={{ color: 'green' }}>groove</span>; {' '}
                                    <span style={{ color: '#f8f8f2' }}>{'}'}</span>
                                </code>
                            </p>
                            <p>
                                <code>
                                    <span style={{ color: '#ff5678' }}>p.ridge</span> {' '}
                                    <span style={{ color: '#f8f8f2' }}>{'{'}</span> {' '}
                                    <span style={{ color: '#007bff' }}>border-style</span>: {' '}
                                    <span style={{ color: 'green' }}>ridge</span>; {' '}
                                    <span style={{ color: '#f8f8f2' }}>{'}'}</span>
                                </code>
                            </p>
                            <p>
                                <code>
                                    <span style={{ color: '#ff5678' }}>p.inset</span> {' '}
                                    <span style={{ color: '#f8f8f2' }}>{'{'}</span> {' '}
                                    <span style={{ color: '#007bff' }}>border-style</span>: {' '}
                                    <span style={{ color: 'green' }}>inset</span>; {' '}
                                    <span style={{ color: '#f8f8f2' }}>{'}'}</span>
                                </code>
                            </p>
                            <p>
                                <code>
                                    <span style={{ color: '#ff5678' }}>p.outset</span> {' '}
                                    <span style={{ color: '#f8f8f2' }}>{'{'}</span> {' '}
                                    <span style={{ color: '#007bff' }}>border-style</span>: {' '}
                                    <span style={{ color: 'green' }}>outset</span>; {' '}
                                    <span style={{ color: '#f8f8f2' }}>{'}'}</span>
                                </code>
                            </p>
                            <p>
                                <code>
                                    <span style={{ color: '#ff5678' }}>p.none</span> {' '}
                                    <span style={{ color: '#f8f8f2' }}>{'{'}</span> {' '}
                                    <span style={{ color: '#007bff' }}>border-style</span>: {' '}
                                    <span style={{ color: 'green' }}>none</span>; {' '}
                                    <span style={{ color: '#f8f8f2' }}>{'}'}</span>
                                </code>
                            </p>
                            <p>
                                <code>
                                    <span style={{ color: '#ff5678' }}>p.hidden</span> {' '}
                                    <span style={{ color: '#f8f8f2' }}>{'{'}</span> {' '}
                                    <span style={{ color: '#007bff' }}>border-style</span>: {' '}
                                    <span style={{ color: 'green' }}>hidden</span>; {' '}
                                    <span style={{ color: '#f8f8f2' }}>{'}'}</span>
                                </code>
                            </p>
                            <p>
                                <code>
                                    <span style={{ color: '#ff5678' }}>p.mix</span> {' '}
                                    <span style={{ color: '#f8f8f2' }}>{'{'}</span> {' '}
                                    <span style={{ color: '#007bff' }}>border-style</span>: {' '}
                                    <span style={{ color: 'green' }}>dotted dashed solid double</span>; {' '}
                                    <span style={{ color: '#f8f8f2' }}>{'}'}</span>
                                </code>
                            </p>
                        </div>

                    </div>
                </div>

                <div className="aboutCourseDiv2" style={{ paddingBottom: '2em' }}>
                    <div className="introductionDiv">MARGINS</div>
                    <div className="frontImageBeginner">
                        <h1 className="headerDivText" style={{ fontSize: '1.7em' }}>
                            <div className="headerContainer" style={{ width: 'fit-content' }}>
                                CSS Margins
                            </div>
                            <div className="imageContainer">
                                <img src={margins} alt="" className="imageForCourse"/>
                            </div>
                        </h1>
                    </div>

                    <div className="descriptionOfCourse">
                        The CSS margin properties are used to create space around elements, outside of any defined borders.<br></br>
                        With CSS, you have full control over the margins. There are properties for setting the margin for each side of an element (top, right, bottom, and left).<br></br>
                        CSS has properties for specifying the margin for each side of an element:
                        <code style={{ color: '#007bff' }}> margin-top </code>
                        <code style={{ color: '#007bff' }}> margin-right </code>
                        <code style={{ color: '#007bff' }}> margin-bottom </code>
                        <code style={{ color: '#007bff' }}> margin-left </code>
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
                        In this lesson, you learned about CSS borders, margins, and padding, which are essential for controlling the spacing and layout of elements on a webpage.
                    </div>

                    <div className='key-areas3' style={{ marginTop: '-10em' }}>
                        <div className="imageContainerWebBeginner2">
                            <img src={css1} alt="" className="imageForWebBeginner2" />
                            <div className="overlay">
                                <div className='keyAreasOfBeginnerWebDev3'>
                                    <strong>CSS borders</strong>
                                    <div className='keyDescription2'>
                                        Borders have purpose of adding visual boundaries to elements to enhance visual appeal while maintaining proper structure of elements.
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="imageContainerWebBeginner2">
                            <img src={css1} alt="" className="imageForWebBeginner2" />
                            <div className="overlay">
                                <div className='keyAreasOfBeginnerWebDev3'><strong>CSS margins</strong>
                                    <div className='keyDescription2' style={{ fontSize: '0.9em' }}>
                                        Margins create space outside elements helping to separate them from others improving aesthetics of layouts.
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="imageContainerWebBeginner2">
                            <img src={css1} alt="" className="imageForWebBeginner2" />
                            <div className="overlay">
                                <div className='keyAreasOfBeginnerWebDev3'>
                                    <strong>CSS padding</strong>
                                    <div className='keyDescription2'>
                                        Padding, on the other hand, provides space inside an element, creating breathing room around its content. Combining padding and margins you are able to manipulate with elements and structures to create visual beauty.
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="imageContainerWebBeginner2">
                            <img src={css1} alt="" className="imageForWebBeginner2" />
                            <div className="overlay">
                                <div className='keyAreasOfBeginnerWebDev3'>
                                    <strong>Examples</strong>
                                    <div className='keyDescription2'>
                                        Through practical examples, you practiced applying these properties to enhance the structure and aesthetics of your layouts. Each example gradually increased in complexity, reinforcing your understanding of how to effectively use these spacing techniques.
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
