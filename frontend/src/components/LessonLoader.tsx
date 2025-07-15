import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { Lesson1 } from '../pages/webCourses/BeginnerWebCourse/Lessons/Lesson1';
import { Lesson2 } from '../pages/webCourses/BeginnerWebCourse/Lessons/Lesson2';
import { Lesson3 } from '../pages/webCourses/BeginnerWebCourse/Lessons/Lesson3';
import { Lesson4 } from '../pages/webCourses/BeginnerWebCourse/Lessons/Lesson4';
import { Lesson5 } from '../pages/webCourses/BeginnerWebCourse/Lessons/Lesson5';
import { Lesson6 } from '../pages/webCourses/BeginnerWebCourse/Lessons/Lesson6';
import { Lesson7 } from '../pages/webCourses/BeginnerWebCourse/Lessons/Lesson7';
import { Lesson8 } from '../pages/webCourses/BeginnerWebCourse/Lessons/Lesson8';
import { Lesson9 } from '../pages/webCourses/BeginnerWebCourse/Lessons/Lesson9';
import { Lesson10 } from '../pages/webCourses/BeginnerWebCourse/Lessons/Lesson10';

export function LessonLoader() {
    const [lessons, setLessons] = useState<{ id: number; title: string }[]>([]);
    const [lesson, setLesson] = useState<{ id: number; title: string; content: string } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { getAccessTokenSilently } = useAuth0();
    const { courseId, lessonNumber } = useParams<{ courseId: string; lessonNumber: string }>();
    const numericLessonNumber = parseInt(lessonNumber || '', 10);

    useEffect(() => {
        async function fetchAllLessons() {
            try {
                const token = await getAccessTokenSilently();
                const res = await fetch(`http://localhost:8080/api/courses/${courseId}/lessons`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (!res.ok) throw new Error('Failed to fetch lessons');
                const data = await res.json();
                setLessons(data);
            } catch (err: any) {
                setError(err.message);
            }
        }

        if (courseId) fetchAllLessons();
    }, [courseId, getAccessTokenSilently]);

    useEffect(() => {
        async function fetchLessonContent() {
            if (!courseId || !lessonNumber) {
                setError('Missing courseId or lesson number');
                setLoading(false);
                return;
            }

            try {
                const token = await getAccessTokenSilently();
                const res = await fetch(`http://localhost:8080/api/progress/lessons/${courseId}/number/${numericLessonNumber}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (!res.ok) throw new Error('Lesson not found or access denied');
                const data = await res.json();
                setLesson(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchLessonContent();
    }, [courseId, lessonNumber, getAccessTokenSilently]);

    const staticComp = getStaticLessonComponentFromNumber(numericLessonNumber);

    if (loading) return <p>Loading lesson...</p>;
    if (staticComp) return staticComp;
    if (error) return <p>Error: {error}</p>;
    if (!lesson) return <p>Lesson not found</p>;

    return (
        <div>
            <h1>{lesson.title}</h1>
            <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
        </div>
    );

    function getStaticLessonComponentFromNumber(lessonNumber: number) {
        const components = [
            <Lesson1 />,
            <Lesson2 />,
            <Lesson3 />,
            <Lesson4 />,
            <Lesson5 />,
            <Lesson6 />,
            <Lesson7 />,
            <Lesson8 />,
            <Lesson9 />,
            <Lesson10 />,
        ];

        if (lessonNumber > 0 && lessonNumber <= components.length) {
            return components[lessonNumber - 1];
        }
        return null;
    }
}