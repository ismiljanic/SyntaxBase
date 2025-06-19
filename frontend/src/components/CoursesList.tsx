import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import web4 from '../images/web4.png';
import '../styles/CoursesList.css';
import { useAuth0 } from '@auth0/auth0-react';
import AnimatedCounter from './AnimatedCounter';
import AnimatedProgressBar from './AnimatedProgressBar';

interface Course {
    courseId: number;
    courseName: string;
    category?: string;
    length?: number;
    description?: string;
    creatorId?: string;
    systemCourse?: boolean;
}

interface FetchError {
    message: string;
}

interface Progress {
    totalLessons: number;
    completedLessons: number;
    progress: number;
}

interface CoursesListProps {
    userId?: string;
    courses?: Course[];
    title?: string;
    role?: string;
}

const CoursesList: React.FC<CoursesListProps> = ({ userId, courses: propCourses, title = "My courses", role }) => {
    const { getAccessTokenSilently } = useAuth0();
    const [courses, setCourses] = useState<Course[]>(propCourses || []);
    const [progressData, setProgressData] = useState<{ [key: number]: Progress }>({});
    const [loading, setLoading] = useState<boolean>(!propCourses);
    const [error, setError] = useState<FetchError | null>(null);
    const navigate = useNavigate();
    const [ratings, setRatings] = useState<{ [key: number]: number }>({});
    const [hoveredRating, setHoveredRating] = useState(0);

    useEffect(() => {
        if (propCourses) {
            setCourses(propCourses);
            setLoading(false);
            setError(null);
            return;
        }

        const fetchCoursesAndProgress = async () => {
            if (!userId) {
                setLoading(false);
                setError({ message: 'User not authenticated.' });
                return;
            }

            try {
                setLoading(true);
                const token = await getAccessTokenSilently();
                const encodedUserId = encodeURIComponent(userId);

                const coursesResponse = await axios.get<Course[]>(
                    `http://localhost:8080/api/user-courses/user/${encodedUserId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        withCredentials: true,
                    }
                );

                setCourses(coursesResponse.data);
                const progressResponses = await Promise.all(
                    coursesResponse.data.map(course =>
                        axios.get<Progress>(
                            `http://localhost:8080/api/progress/progressBar`,
                            {
                                params: { userId, courseId: course.courseId },
                                headers: { Authorization: `Bearer ${token}` },
                                withCredentials: true,
                            }
                        )
                    )
                );
                console.log('Progress responses:', progressResponses);
                const progressDataMap = progressResponses.reduce((acc, response, index) => {
                    const courseId = coursesResponse.data[index].courseId;
                    acc[courseId] = response.data;
                    return acc;
                }, {} as { [key: number]: Progress });

                setProgressData(progressDataMap);
                setError(null);
            } catch (err) {
                console.error('Error fetching courses or progress:', err);
                setError(
                    err instanceof Error
                        ? { message: err.message }
                        : { message: 'An unknown error occurred' }
                );
            } finally {
                setLoading(false);
            }
        };

        fetchCoursesAndProgress();
    }, [userId, propCourses, getAccessTokenSilently]);

    useEffect(() => {
        const fetchRatings = async () => {
            if (!userId) return;

            try {
                const token = await getAccessTokenSilently();

                const response = await axios.get(
                    `http://localhost:8080/api/ratings/user/${encodeURIComponent(userId)}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                        withCredentials: true,
                    }
                );

                const userRatings: { [key: number]: number } = {};
                response.data.forEach((rating: { courseId: number; rating: number }) => {
                    userRatings[rating.courseId] = rating.rating;
                });

                setRatings(userRatings);
            } catch (err) {
                console.error("Error fetching user ratings:", err);
            }
        };

        fetchRatings();
    }, [userId, courses, getAccessTokenSilently]);

    const getFirstLessonId = async (courseId: number, token: string) => {
        const res = await axios.get(`http://localhost:8080/api/progress/lessons/first`, {
            params: { courseId },
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data?.id;
    };

    const handleCourseClick = async (course: Course) => {
        if (!userId) return;
        try {
            const token = await getAccessTokenSilently();

            if (course.systemCourse) {
                const res = await axios.get(`http://localhost:8080/api/progress/current-lesson`, {
                    params: { userId, courseId: course.courseId },
                    headers: { Authorization: `Bearer ${token}` },
                });
                const lessonId = res.data?.id || 1;
                navigate(`/course/${course.courseId}/lesson/${lessonId}`);
            } else {
                const lessonId = await getFirstLessonId(course.courseId, token);
                navigate(`/dynamic-course/${course.courseId}/lesson/${lessonId || 1}`);
            }
        } catch (err) {
            console.error("Error fetching lesson info:", err);
            if (course.systemCourse) {
                navigate(`/course/${course.courseId}/lesson/1`);
            } else {
                navigate(`/dynamic-course/${course.courseId}/lesson/1`);
            }
        }
    };



    const handleRating = async (index: number, courseId: number) => {
        if (!userId) return;

        const newRating = index + 1;

        if (ratings[courseId]) {
            alert(`You've already rated this course: ${ratings[courseId]}`);
            return;
        }

        setRatings(prev => ({ ...prev, [courseId]: newRating }));
        const token = await getAccessTokenSilently();

        try {
            await axios.post(
                'http://localhost:8080/api/ratings/save',
                { courseId, rating: newRating, auth0UserId: userId },
                {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
        } catch (err) {
            console.error('Error saving rating:', err);
        }
    };

    const handleMouseEnter = (index: number) => {
        setHoveredRating(index + 1);
    };

    const handleMouseLeave = () => {
        setHoveredRating(0);
    };

    if (loading) {
        return <p style={{ backgroundColor: 'rgb(247, 250, 251)' }}>Loading courses...</p>;
    }

    if (error) {
        return (
            <p style={{ backgroundColor: 'rgb(247, 250, 251)' }}>
                Error fetching courses: {error.message}
            </p>
        );
    }

    if (courses.length === 0) {
        return (
            <div
                style={{
                    backgroundColor: 'rgb(247, 250, 251)',
                    paddingLeft: '41em',
                    fontSize: '1.5em',
                    paddingBottom: '10em',
                    paddingTop: '4em',
                }}
            >
                No courses available.
            </div>
        );
    }

    return (
        <div className="bigDaddyContainer" style={{ paddingTop: '13em' }}>
            <div className="container2">
                <div className="webCourseDiv3">{title}</div>
                <a href="/courses" className="moreCoursesDiv">More courses</a>
                <div className="lineDiv"></div>
            </div>
            <div className="pictureContainer2">
                {courses.map(course => (
                    <div
                        key={course.courseId}
                        className="imageWithDescription2"
                        onClick={() => handleCourseClick(course)}
                        style={{ marginLeft: '1em', cursor: 'pointer' }}
                    >
                        <img src={web4} alt={course.courseName} className="courseImage2" />
                        <div className="imageDescription2">
                            {course.description || 'No description available.'}
                        </div>
                    </div>
                ))}
                {courses
                    .filter(course => course.creatorId !== userId)
                    .map(course => (
                        <div key={`progress-${course.courseId}`} className="progress-section2">
                            <h2>Your Progress</h2>
                            <AnimatedProgressBar progress={progressData[course.courseId]?.progress || 0} />
                            <p>
                                You have completed{' '}
                                <AnimatedCounter targetNumber={progressData[course.courseId]?.completedLessons || 0} /> /{' '}
                                {progressData[course.courseId]?.totalLessons || 0} lessons
                            </p>
                        </div>
                    ))}
                {courses
                    .filter(course => course.creatorId !== userId)
                    .map(course => (
                        <div key={`rating-${course.courseId}`} className="rateCourseDiv">
                            <span style={{ marginLeft: '1.8em' }}>Rate course: </span>
                            <div style={{ marginLeft: '1.6em', marginBottom: '1em' }}>
                                Your Rating: {ratings[course.courseId] || 0}
                            </div>
                            {[...Array(5)].map((_, index) => (
                                <span
                                    key={index}
                                    className={`star ${(hoveredRating || ratings[course.courseId] || 0) > index ? 'filled' : ''
                                        }`}
                                    onClick={() => handleRating(index, course.courseId)}
                                    onMouseEnter={() => handleMouseEnter(index)}
                                    onMouseLeave={handleMouseLeave}
                                    style={{ transitionDelay: `${index * 0.1}s`, cursor: 'pointer' }}
                                >
                                    ★
                                </span>
                            ))}
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default CoursesList;