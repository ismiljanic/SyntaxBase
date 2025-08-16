import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import LoadingScreen from '../components/LoadingScreen';

const Lesson: React.FC = () => {
    const { courseId, lessonId } = useParams();
    const [lesson, setLesson] = useState<any>(null);

    useEffect(() => {
        const fetchLesson = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/lessons/${courseId}/${lessonId}`);
                setLesson(response.data);
            } catch (err) {
                console.error("Failed to fetch lesson", err);
            }
        };

        fetchLesson();
    }, [courseId, lessonId]);

    if (!lesson) {
        return <LoadingScreen />;
    }

    return (
        <div className="lesson-container">
            <h1>{lesson.title}</h1>
            <p>{lesson.content}</p>
        </div>
    );
};

export default Lesson;
