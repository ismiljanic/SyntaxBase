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
    userId: number; // Pass userId as a prop
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
                console.log('Fetched courses for user:', fetchedCourses);

                // Check for duplicates
                const ids = fetchedCourses.map(course => course.courseId);
                const hasDuplicates = new Set(ids).size !== ids.length;
                if (hasDuplicates) {
                    console.warn('Duplicate IDs found in the courses data');
                }

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
    }, [userId]); // Fetch courses when userId changes

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error fetching courses: {error.message}</p>;

    const handleCourseClick = (courseId: number) => {
        navigate(`/beginnerWebCourse/${userId}`);
    };

    return (
        <div>
            <h1>Courses List</h1>
            <div className="course-container">
                {courses.map(course => (
                    <div
                        key={course.courseId}
                        className='features3'
                        onClick={() => handleCourseClick(course.courseId)}
                    >
                        <div className="reactDiv">
                            <img src={web4} alt="Logo SyntaxBase" className="reactImage" />
                            <div className="webCourses">
                                {course.courseName}<br />Create Simple Frontend Application!
                            </div>
                            <div className="arrow-circle"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CoursesList;
