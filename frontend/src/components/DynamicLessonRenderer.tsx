import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import { LessonTemplate } from './LessonTemplate';

interface LessonContent {
    title: string;
    sections: Array<{
        subtitle?: string;
        paragraphs: string[];
        images?: { src: string; alt?: string; caption?: string }[];
    }>;
    objectives: string[];
}

const someLessonData = {
    title: "Intro to Web Dev",
    objectives: ["Understand basics", "Build a simple page"],
    sections: [
        {
            subtitle: "What is Web Development?",
            paragraphs: ["It is the creation of websites..."],
            images: [{ src: "image.png", alt: "Example" }],
        },
    ],
};

const DynamicLessonRenderer = () => {
    const { courseId, lessonId } = useParams();
    const { getAccessTokenSilently } = useAuth0();
    const [lessonContent, setLessonContent] = useState<LessonContent | null>(null);
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
        const token = await getAccessTokenSilently();
        try {
            const response = await axios.get(`http://localhost:8080/api/progress/lessons/next`, {
                params: { courseId, currentLessonId: lessonId },
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
            });
            if (response.data?.id) {
                goToLesson(response.data.id);
            } else {
                alert('No next lesson.');
            }
        } catch (err) {
            console.error('Error fetching next lesson:', err);
        }
    };

    const handlePrevious = async () => {
        const token = await getAccessTokenSilently();
        try {
            const response = await axios.get(`http://localhost:8080/api/progress/lessons/previous`, {
                params: { courseId, currentLessonId: lessonId },
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
            });
            if (response.data?.id) {
                goToLesson(response.data.id);
            } else {
                alert('No previous lesson.');
            }
        } catch (err) {
            console.error('Error fetching previous lesson:', err);
        }
    };


    if (!lessonContent) return <p>Loading lesson...</p>;

    return (
        <LessonTemplate
            initialLesson={someLessonData}
            onNext={handleNext}
            onPrevious={handlePrevious}
        />
    );
};

export default DynamicLessonRenderer;