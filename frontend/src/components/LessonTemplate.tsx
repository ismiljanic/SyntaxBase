import React from "react";
import { Header } from '../pages/Header';
import { Footer } from '../pages/Footer';
import { Footer2 } from '../pages/Footer2';
import '../styles/EditableLesson.css';

interface LessonDB {
    id: number;
    title: string;
    description: string;
    active: boolean;
}

interface LessonTemplateProps {
    lesson: LessonDB;
    onNext: () => void;
    onPrevious: () => void;
    first: boolean;
    last: boolean;
}

export function LessonTemplate({ lesson, onNext, onPrevious, first, last }: LessonTemplateProps) {
    if (!lesson.active) return <div>This lesson is inactive.</div>;
    console.log(first, last, lesson);
    return (
        <div className='mainContainer'>
            <Header bgColor="rgb(247, 250, 251)" />

            <div className='lessonIntroduction'>
                <h1 className="lessonIntroduction__title" style={{ fontSize: "2rem", fontWeight: "bold" }}>
                    {lesson.title}
                </h1>
                <p style={{ fontSize: "1.1rem" }}>{lesson.description}</p>
            </div>

            <div style={{ display: 'flex', marginTop: "2em" }}>
                <div className='goToPreviousLessonDiv' onClick={onPrevious} style={{ marginLeft: '6em' }}>
                    {first ? 'Homepage' : 'Previous Lesson'}
                </div>
                <div className='moreCoursesDiv' onClick={onNext} style={{ cursor: "pointer", marginLeft: '62.5em' }}>
                    {last ? 'Finish Lesson' : 'Next Lesson'}
                </div>
            </div>

            <Footer2 bgColor="rgb(247, 250, 251)" />
            <Footer bgColor="rgb(247, 250, 251)" />
        </div>
    );
}
export default LessonTemplate;