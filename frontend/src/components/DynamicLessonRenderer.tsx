import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import { LessonTemplate } from './LessonTemplate';

// interface LessonContent {
//     title: string;
//     sections: Array<{
//         subtitle?: string;
//         paragraphs: string[];
//         images?: { src: string; alt?: string; caption?: string }[];
//     }>;
//     objectives: string[];
// }

interface LessonDB {
    id: number;
    title: string;
    description: string;
    active: boolean;
}

interface LessonAPIResponse {
    id: number;
    lessonName: string;
    content: string;
    completed: string;
    editable: boolean;
    courseId: number;
    userId: number | null;
}

const DynamicLessonRenderer = () => {
    const { courseId, lessonId } = useParams();
    const { getAccessTokenSilently } = useAuth0();
    const [lessonContent, setLessonContent] = useState<LessonAPIResponse | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLesson = async () => {
            const token = await getAccessTokenSilently();
            const response = await axios.get(`http://localhost:8080/api/progress/lessons/${courseId}/${lessonId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                withCredentials: true,
            });
            setLessonContent(response.data);
        };

        fetchLesson();
    }, [courseId, lessonId, getAccessTokenSilently]);

    const goToLesson = (lessonIdToGo: number) => {
        navigate(`/dynamic-course/${courseId}/lesson/${lessonIdToGo}`);
    };

    const handleNext = async () => {
        try {
            const token = await getAccessTokenSilently();
            const response = await axios.get<{ id?: number }>(
                `http://localhost:8080/api/progress/lessons/next`,
                {
                    params: { courseId, currentLessonId: lessonId },
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true,
                }
            );

            if (response.data?.id) {
                goToLesson(response.data.id);
            } else {
                navigate('/homepage');
            }
        } catch (err: any) {
            if (axios.isAxiosError(err) && err.response?.status === 404) {
                navigate('/homepage');
            } else {
                console.error('Error fetching next lesson:', err);
            }
        }
    };


    const handlePrevious = async () => {
        try {
            const token = await getAccessTokenSilently();
            const response = await axios.get<{ id?: number }>(
                `http://localhost:8080/api/progress/lessons/previous`,
                {
                    params: { courseId, currentLessonId: lessonId },
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true,
                }
            );

            if (response.data?.id) {
                goToLesson(response.data.id);
            } else {
                navigate('/homepage');
            }
        } catch (err: any) {
            if (axios.isAxiosError(err) && err.response?.status === 404) {
                navigate('/homepage');
            } else {
                console.error('Error fetching previous lesson:', err);
            }
        }
    };



    if (!lessonContent) return <p>Loading lesson...</p>;

    const lessonForTemplate: LessonDB = {
        id: lessonContent.id,
        title: lessonContent.lessonName,
        description: lessonContent.content,
        active: !lessonContent.editable ? true : false,
    };

    return (
        <LessonTemplate
            lesson={lessonForTemplate}
            onNext={handleNext}
            onPrevious={handlePrevious}
        />
    );
};

export default DynamicLessonRenderer;