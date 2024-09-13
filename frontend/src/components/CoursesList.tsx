import React, { useEffect, useState } from 'react';
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

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error fetching courses: {error.message}</p>;

    const handleCourseClick = (courseId: number) => {
        navigate(`/beginnerWebCourse/${userId}`);
    };

    return (
        <div className="bigDaddyContainer" style={{paddingTop: '4em'}}>
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
                    <a
                        key={course.courseId}
                        href={`/course/${course.courseId}`}
                        className="imageWithDescription2"
                    >
                        <img src={web4} alt={course.courseName} className="courseImage2" />
                        <div className="imageDescription2">
                            {course.description || 'No description available.'}
                        </div>
                        
                    </a>
                ))}
            </div>
        </div>
    );
};

export default CoursesList;
