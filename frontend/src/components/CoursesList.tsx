import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import web4 from '../images/web4.png';

interface Course {
    courseId: number;
    courseName: string;
    category?: string;
    length?: number;
    description?: string;
}

interface FetchError {
    message: string;
}

interface CoursesListProps {
    userId: number;
}

const CoursesList: React.FC<CoursesListProps> = ({ userId }) => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<FetchError | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get<Course[]>(`http://localhost:8080/api/user-courses/user/${userId}`);
                const fetchedCourses = response.data;
                setCourses(fetchedCourses);
            } catch (err) {
                if (err instanceof Error) {
                    setError({ message: err.message });
                } else {
                    setError({ message: 'An unknown error occurred' });
                }
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, [userId]);

    const handleCourseClick = async (courseId: number) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/progress/current-lesson`, {
                params: {
                    userId,
                    courseId
                }
            });

            const lesson = response.data;
            console.log(lesson);

            if (lesson && lesson.id) {
                navigate(`/course/${courseId}/lesson/${lesson.id}`);
            } else {
                navigate(`/course/${courseId}/lesson/1`);
            }
        } catch (err) {
            console.error('Error fetching user progress:', err);
            navigate(`/course/${courseId}/lesson/1`);
        }
    };




    if (loading) return <p style={{ backgroundColor: 'rgb(247, 250, 251)' }}>Loading courses...</p>;
    if (error) return <p style={{ backgroundColor: 'rgb(247, 250, 251)' }}>Error fetching courses: {error.message}</p>;
    if (courses.length === 0) return <div style={{ backgroundColor: 'rgb(247, 250, 251)', paddingLeft: '41em', fontSize: '1.5em', paddingBottom: '10em', paddingTop: '4em' }}>No courses available.</div>;

    return (
        <div className="bigDaddyContainer" style={{ paddingTop: '4em' }}>
            <div className="container2">
                <div className="webCourseDiv3">
                    My courses
                </div>
                <a href="/courses" className="moreCoursesDiv">
                    More courses
                </a>
                <div className="lineDiv"></div>
            </div>
            <div className="pictureContainer2">
                {courses.map(course => (
                    <div
                        key={course.courseId}
                        className="imageWithDescription2"
                        onClick={() => handleCourseClick(course.courseId)}
                    >
                        <img src={web4} alt={course.courseName} className="courseImage2" />
                        <div className="imageDescription2">
                            {course.description || 'No description available.'}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CoursesList;
