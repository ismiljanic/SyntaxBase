import { Header } from '../../..//Header';
import { Footer } from '../../../Footer';
import { Footer2 } from '../../../Footer2';
import rvse from '../../../../pages/webCourses/AdvancedWebCourse/images/rvse.png';
import spb from '../../../../pages/webCourses/AdvancedWebCourse/images/spb.png';
import secure from '../../../../pages/webCourses/AdvancedWebCourse/images/secure.png';
import validationError from '../../../../pages/webCourses/AdvancedWebCourse/images/validationError.png';

export function AdvancedWebTutorialLesson4() {

    const handleNextLesson = async () => {
        window.location.href = `/advancedWebTutorial/lesson/5`;
    };

    const handlePreviousLesson = async () => {
        window.location.href = `/advancedWebTutorial/lesson/3`;
    };

    return (
        <div className='mainContainer'>
            <Header bgColor="rgb(247, 250, 251)" />

            <div className='lessonIntroduction'>
                <h1>RESTful API Design with Spring Boot</h1>
                <p>
                    Welcome to <b>Lesson 4</b> of the <b>Advanced Web Development Tutorial</b>.
                    Design and implement robust, scalable APIs for your frontend to consume, including authentication, validation, and error handling.
                </p>
            </div>

            <div className='aboutBeginnerWeb'>
                <div className="aboutCourseDiv2" style={{ paddingBottom: '7em' }}>
                    <div className="introductionDiv">Introduction</div>
                    <div className="frontImageBeginner">
                        <h1 className="headerDivText" style={{ fontSize: '1.7em' }}>
                            <div className="headerContainer" style={{ width: 'fit-content' }}>
                                Why REST with Spring Boot
                            </div>
                            <div className="imageContainer">
                                <img src={spb} alt="Spring Boot" className="imageForCourse" />
                            </div>
                        </h1>
                    </div>

                    <div className="descriptionOfCourse">
                        Spring Boot streamlines building production-ready REST APIs with opinionated defaults, powerful auto-configuration, and an ecosystem that
                        covers security, data access, and documentation. In this lesson, you’ll create clean, versioned endpoints, validate inputs, secure them with JWT,
                        and return consistent error responses your React app can trust.
                    </div>
                </div>

                <div className="aboutCourseDiv2" style={{ paddingBottom: '0em' }}>
                    <div className="introductionDiv">Core API Design Concepts</div>
                    <div className="frontImageBeginner">
                        <h1 className="headerDivText" style={{ fontSize: '1.7em' }}>
                            <div className="headerContainer" style={{ width: 'fit-content' }}>
                                Resources, Validation, Security & Errors
                            </div>
                            <div className="imageContainer">
                                <img src={rvse} alt="REST Concepts" className="imageForCourse" />
                            </div>
                        </h1>
                    </div>

                    <div className="descriptionOfCourse">
                        We’ll focus on pragmatic, production-grade API design:
                        <ul>
                            <li><b>Resource Modeling:</b> map core domains to resource URIs (e.g., <code>/api/v1/donors</code>, <code>/api/v1/appointments</code>).</li>
                            <li><b>HTTP Semantics:</b> use the right verbs (<code>GET</code>, <code>POST</code>, <code>PUT</code>, <code>PATCH</code>, <code>DELETE</code>) and status codes.</li>
                            <li><b>DTOs & Mapping:</b> expose stable DTOs; isolate entities. Add pagination (<code>?page=0&amp;size=20</code>) and filtering (<code>?status=scheduled</code>).</li>
                            <li><b>Validation:</b> Bean Validation with <code>@Valid</code>, <code>@NotNull</code>, <code>@Email</code>; return actionable messages.</li>
                            <li><b>Error Handling:</b> centralized <code>@ControllerAdvice</code>; consistent error shape (timestamp, path, code, message, details).</li>
                            <li><b>Security:</b> Spring Security + JWT (bearer tokens), role-based access (ADMIN, ORG, DONOR), CORS for your React origin.</li>
                            <li><b>Versioning & Docs:</b> URI versioning (<code>/api/v1</code>) and OpenAPI/Swagger UI for discoverability.</li>
                        </ul>
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
                        You now have a blueprint for building clean, secure, and maintainable REST APIs with Spring Boot—covering endpoints, validation,
                        error contracts, and JWT-based security. Next up, we’ll integrate these endpoints in the frontend, wire up data fetching, and
                        align UI state with real backend responses.
                    </div>

                    <div className='key-areas3' style={{ marginTop: '-10em' }}>
                        <div className="imageContainerWebBeginner2">
                            <img src={secure} alt="Security" className="imageForWebBeginner2" />
                            <div className="overlay">
                                <div className='keyAreasOfBeginnerWebDev3'>
                                    <strong>Security & Auth:</strong>
                                    <div className='keyDescription2'>
                                        JWT bearer tokens, role-based access, CORS, and secure defaults via Spring Security.
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="imageContainerWebBeginner2">
                            <img src={validationError} alt="Validation & Errors" className="imageForWebBeginner2" />
                            <div className="overlay">
                                <div className='keyAreasOfBeginnerWebDev3'>
                                    <strong>Validation & Errors:</strong>
                                    <div className='keyDescription2'>
                                        <ul>
                                            <li>Bean Validation with <code>@Valid</code> on inputs</li>
                                            <li>Global error handler for consistent responses</li>
                                            <li>Clear messages for the frontend to consume</li>
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