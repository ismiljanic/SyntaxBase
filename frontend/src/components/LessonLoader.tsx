import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { lessonComponentMap } from '../utils/LessonComponentMap';

export function LessonLoader() {
    const [lessons, setLessons] = useState<{ id: number; title: string }[]>([]);
    const [lesson, setLesson] = useState<{ id: number; title: string; content: string } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { getAccessTokenSilently } = useAuth0();
    const { courseId, lessonNumber } = useParams<{ courseId: string; lessonNumber: string }>();
    const numericLessonNumber = parseInt(lessonNumber || '', 10);

    useEffect(() => {
        async function fetchAllLessons() {
            try {
                const token = await getAccessTokenSilently();
                const res = await fetch(`http://localhost:8080/api/courses/${courseId}/lessons`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
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
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (!res.ok) {
                    if (res.status === 403) {
                        navigate('/suspended');
                    } else if (res.status === 404) {
                        navigate('/not-found');
                    }
                    throw new Error('Lesson not found or access denied');
                }

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

    function getStaticLessonComponentFromNumber(lessonNumber: number): JSX.Element | null {
        if (!courseId) return null;

        //IDs are from database as a premade course so this won't change
        const courseIdToSlug: Record<string, 'beginner' | 'intermediate'> = {
            '1': 'beginner',
            '2': 'intermediate',
        };

        const courseSlug = courseIdToSlug[courseId];
        if (!courseSlug) return null;

        const components = lessonComponentMap[courseSlug];
        if (!components) return null;

        if (lessonNumber > 0 && lessonNumber <= components.length) {
            return components[lessonNumber - 1];
        }

        return null;
    }
}