import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import { LessonTemplate } from './LessonTemplate';

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
    first: boolean;
    last: boolean;
}


const DynamicLessonRenderer = () => {
    const { courseId, lessonId } = useParams();
    const [lessonContent, setLessonContent] = useState<LessonAPIResponse | null>(null);
    const navigate = useNavigate();
    const { user, getAccessTokenSilently } = useAuth0();
    const [role, setRole] = useState<string | null>(null);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchUserRole = async () => {
            try {
                const token = await getAccessTokenSilently();
                const response = await axios.get(`http://localhost:8080/api/users/role/${user.sub}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setRole(response.data.role);
            } catch (error) {
                console.error('Error fetching user role:', error);
                navigate('/error');
            }
        };

        fetchUserRole();
    }, [user, getAccessTokenSilently, navigate]);

    useEffect(() => {
        if (role && role !== 'INSTRUCTOR') {
            navigate('/forbidden');
        }
    }, [role, navigate]);


    useEffect(() => {
        const fetchLesson = async () => {
            try {
                const token = await getAccessTokenSilently();
                const response = await axios.get(`http://localhost:8080/api/progress/lessons/${courseId}/${lessonId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    withCredentials: true,
                });
                setLessonContent(response.data);
            } catch (error) {
                if (axios.isAxiosError(error) && error.response?.status === 403) {
                    navigate('/forbidden');
                } else {
                    console.error('Failed to fetch lesson:', error);
                    navigate('/error');
                }
            }
        };

        fetchLesson();
    }, [courseId, lessonId, getAccessTokenSilently, navigate]);


    const goToLesson = (lessonIdToGo: number) => {
        navigate(`/dynamic-course/${courseId}/Lesson/${lessonIdToGo}`);
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
        active: !lessonContent.editable,
    };

    return (
        <LessonTemplate
            lesson={lessonForTemplate}
            onNext={handleNext}
            onPrevious={handlePrevious}
            first={lessonContent.first}
            last={lessonContent.last}
        />
    );
};

export default DynamicLessonRenderer;