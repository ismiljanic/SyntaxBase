import { Header } from '../../..//Header';
import { Footer } from '../../../Footer';
import { Footer2 } from '../../../Footer2';
import postgresql from '../../../../pages/webCourses/AdvancedWebCourse/images/postgresql.png';
import logDB from '../../../../pages/webCourses/AdvancedWebCourse/images/logickiModelDB.png';
import db3 from '../../../../pages/webCourses/AdvancedWebCourse/images/db3.png';

export function AdvancedWebTutorialLesson5() {

    const handleNextLesson = async () => {
        window.location.href = `/tutorial/finish`;
    };

    const handlePreviousLesson = async () => {
        window.location.href = `/advancedWebTutorial/lesson/4`;
    };

    return (
        <div className='mainContainer'>
            <Header bgColor="rgb(247, 250, 251)" />

            <div className='lessonIntroduction'>
                <h1>PostgreSQL & Database Modeling</h1>
                <p>
                    Welcome to <b>Lesson 5</b> of the <b>Advanced Web Development tutorial</b>.
                    Learn how to model relational databases, write optimized queries, and integrate your backend with PostgreSQL for full-stack persistence.
                </p>
            </div>

            <div className='aboutBeginnerWeb'>
                <div className="aboutCourseDiv2" style={{ paddingBottom: '7em' }}>
                    <div className="introductionDiv">Introduction</div>
                    <div className="frontImageBeginner">
                        <h1 className="headerDivText" style={{ fontSize: '1.7em' }}>
                            <div className="headerContainer" style={{ width: 'fit-content' }}>
                                Why PostgreSQL?
                            </div>
                            <div className="imageContainer">
                                <img src={postgresql} alt="PostgreSQL" className="imageForCourse" />
                            </div>
                        </h1>
                    </div>

                    <div className="descriptionOfCourse">
                        PostgreSQL is a powerful, open-source relational database with advanced features like ACID compliance, indexing, JSON support, and extensibility.
                        In this lesson, you’ll learn how to design normalized schemas, define relationships, and write efficient queries to support your backend services.
                    </div>
                </div>

                <div className="aboutCourseDiv2" style={{ paddingBottom: '0em' }}>
                    <div className="introductionDiv">Core Concepts</div>
                    <div className="frontImageBeginner">
                        <h1 className="headerDivText" style={{ fontSize: '1.7em' }}>
                            <div className="headerContainer" style={{ width: 'fit-content' }}>
                                Tables, Relations & Queries
                            </div>
                            <div className="imageContainer">
                                <img src={logDB} alt="Database Modeling" className="imageForCourse" />
                            </div>
                        </h1>
                    </div>

                    <div className="descriptionOfCourse">
                        Key database modeling and PostgreSQL concepts include:
                        <ul>
                            <li><b>Schema Design:</b> normalize tables to reduce redundancy; use primary and foreign keys to define relationships.</li>
                            <li><b>Relationships:</b> one-to-one, one-to-many, many-to-many with join tables.</li>
                            <li><b>Indexes:</b> speed up queries with B-tree, GIN, and other index types; know when to avoid over-indexing.</li>
                            <li><b>Optimized Queries:</b> SELECT, JOIN, WHERE, GROUP BY, and window functions for performance.</li>
                            <li><b>Constraints:</b> UNIQUE, NOT NULL, CHECK constraints to enforce data integrity.</li>
                            <li><b>Transactions:</b> ensure ACID compliance and handle rollback in case of errors.</li>
                            <li><b>Integration:</b> connect your Spring Boot backend or Node.js server to PostgreSQL using JDBC or ORM tools like Hibernate or TypeORM.</li>
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
                        By the end of this lesson, you will have a strong foundation in designing relational schemas, writing performant queries,
                        and connecting your backend services to PostgreSQL. This prepares you for building robust, data-driven full-stack applications.
                    </div>

                    <div className='key-areas3' style={{ marginTop: '-10em' }}>
                        <div className="imageContainerWebBeginner2">
                            <img src={db3} alt="Schema Design" className="imageForWebBeginner2" />
                            <div className="overlay">
                                <div className='keyAreasOfBeginnerWebDev3'>
                                    <strong>Database Design:</strong>
                                    <div className='keyDescription2'>
                                        Normalize tables, define relationships, and enforce integrity with constraints.
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="imageContainerWebBeginner2">
                            <img src={db3} alt="Optimized Queries" className="imageForWebBeginner2" />
                            <div className="overlay">
                                <div className='keyAreasOfBeginnerWebDev3'>
                                    <strong>Query Performance:</strong>
                                    <div className='keyDescription2'>
                                        Indexing strategies, efficient SELECTs, JOINs, and transaction management.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div style={{ display: 'flex' }}>
                <div className='moreCoursesDiv' onClick={handleNextLesson}>
                    Finish Tutorial
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