import { Header } from '../../..//Header';
import { Footer } from '../../../Footer';
import { Footer2 } from '../../../Footer2';
import typescript from '../../../../pages/webCourses/AdvancedWebCourse/images/typescript.png';

export function AdvancedWebTutorialLesson3() {

    const handleNextLesson = async () => {
        window.location.href = `/advancedWebTutorial/lesson/4`;
    };

    const handlePreviousLesson = async () => {
        window.location.href = `/advancedWebTutorial/lesson/2`;
    };

    return (
        <div className='mainContainer'>
            <Header bgColor="rgb(247, 250, 251)" />

            <div className='lessonIntroduction'>
                <h1>Introduction to TypeScript Deep Dive</h1>
                <p>
                    Welcome to <b>Lesson 3</b> of the <b>Intermediate Web Development Tutorial</b>.
                    Master type safety, interfaces, generics, and utility types to make your code more reliable and maintainable.
                </p>
            </div>

            <div className='aboutBeginnerWeb'>
                <div className="aboutCourseDiv2" style={{ paddingBottom: '7em' }}>
                    <div className="introductionDiv">Introduction</div>
                    <div className="frontImageBeginner">
                        <h1 className="headerDivText" style={{ fontSize: '1.7em' }}>
                            <div className="headerContainer" style={{ width: 'fit-content' }}>
                                Why TypeScript Matters
                            </div>
                            <div className="imageContainer">
                                <img src={typescript} alt="TypeScript Logo" className="imageForCourse" />
                            </div>
                        </h1>
                    </div>

                    <div className="descriptionOfCourse">
                        TypeScript enhances JavaScript with static type checking. It helps you catch errors early, write self-documenting code, and improves maintainability in large projects.
                        We’ll cover core concepts such as <code>interfaces</code>, <code>types</code>, <code>generics</code>, and built-in utility types.
                    </div>
                </div>

                <div className="aboutCourseDiv2" style={{ paddingBottom: '7em' }}>
                    <div className="introductionDiv">Core TypeScript Concepts</div>
                    <div className="frontImageBeginner">
                        <h1 className="headerDivText" style={{ fontSize: '1.7em' }}>
                            <div className="headerContainer" style={{ width: 'fit-content' }}>
                                Interfaces, Generics & Utility Types
                            </div>
                            <div className="imageContainer">
                                <img src={typescript} alt="Interfaces" className="imageForCourse" />
                            </div>
                        </h1>
                    </div>

                    <div className="descriptionOfCourse">
                        Interfaces define the shape of objects and enforce consistent contracts across your code.
                        Generics allow components and functions to work with a variety of types while maintaining type safety.
                        Utility types like <code>Partial</code>, <code>Pick</code>, and <code>Omit</code> make type transformations easy and maintainable.
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