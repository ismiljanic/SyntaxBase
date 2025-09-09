import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import enrolledCourse from '../images/enrolledCourse.png';
import '../styles/CoursesList.css';
import { useAuth0 } from '@auth0/auth0-react';
import AnimatedCounter from './AnimatedCounter';
import AnimatedProgressBar from './AnimatedProgressBar';
import LoadingScreen from './LoadingScreen';
import { profile } from 'console';

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
    profileUserId: string | null;
    currentUserId: string | null;
    courses?: Course[];
    title?: string;
    role?: string;
    isCreatorList?: boolean;
}

//TODO: Map course IDs to their respective enrollment pages on course addition
const enrollmentPages: { [courseId: number]: string } = {
    1: "/beginnerWebCourse",
    2: "/intermediateWebCourse",
    3: "/advancedWebCourse",
};


const CoursesList: React.FC<CoursesListProps> = ({ profileUserId, currentUserId, courses: propCourses, title = "My courses", role, isCreatorList }) => {
    const { getAccessTokenSilently } = useAuth0();
    const [courses, setCourses] = useState<Course[]>(propCourses || []);
    const [progressData, setProgressData] = useState<{ [key: number]: Progress }>({});
    const [loading, setLoading] = useState<boolean>(!propCourses);
    const [error, setError] = useState<FetchError | null>(null);
    const navigate = useNavigate();
    const [ratings, setRatings] = useState<{ [key: number]: number }>({});
    const [hoveredRating, setHoveredRating] = useState(0);
    const [deletingCourseId, setDeletingCourseId] = useState<number | null>(null);
    const [modalMessage, setModalMessage] = useState<string | null>(null);
    const userId = currentUserId;

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
                const encodedProfileUserId = encodeURIComponent(profileUserId || userId);

                const coursesResponse = await axios.get<Course[]>(
                    `http://localhost:8080/api/user-courses/user/${encodedProfileUserId}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                        withCredentials: true,
                    }
                );

                setCourses(coursesResponse.data);

                const progressResponses = await Promise.all(
                    coursesResponse.data.map(async (course) => {
                        try {
                            const res = await axios.get<Progress>(
                                `http://localhost:8080/api/progress/progressBar`,
                                {
                                    params: { userId, courseId: course.courseId },
                                    headers: { Authorization: `Bearer ${token}` },
                                    withCredentials: true,
                                }
                            );
                            return { courseId: course.courseId, progress: res.data };
                        } catch (err: any) {
                            if (err.response?.status === 403 || err.response?.status === 404) {
                                return { courseId: course.courseId, progress: null };
                            } else {
                                throw err;
                            }
                        }
                    })
                );

                const progressDataMap = progressResponses.reduce((acc, item) => {
                    if (item.progress) acc[item.courseId] = item.progress;
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
    }, [userId, profileUserId, propCourses, getAccessTokenSilently]);

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

    const handleCourseClick = async (course: Course) => {
        if (!userId) return;

        try {
            const token = await getAccessTokenSilently();

            const res = await axios.get(
                `http://localhost:8080/api/progress/progressBar`,
                {
                    params: { userId, courseId: course.courseId },
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            const lessonNumber = res.data?.lessonNumber || 1;

            if (course.systemCourse) {
                navigate(`/course/${course.courseId}/lesson/${lessonNumber}`);
            } else {
                navigate(`/dynamic-course/${course.courseId}/lesson/${lessonNumber}`);
            }
        } catch (err: any) {
            if (err.response?.status === 403 || err.response?.status === 404) {
                const enrollmentPage = enrollmentPages[course.courseId];
                if (enrollmentPage) {
                    navigate(enrollmentPage);
                } else {
                    console.warn(
                        `No enrollment page mapped for course "${course.courseName}" (id: ${course.courseId})`
                    );
                    navigate("/courses");
                }
            } else {
                console.error("Error fetching lesson info:", err);
            }
        }
    };

    const handleRating = async (index: number, courseId: number) => {
        if (!userId) return;

        const newRating = index + 1;

        if (ratings[courseId]) {
            setModalMessage(`You've already rated this course: ${ratings[courseId]}`);
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
        return <LoadingScreen />;
    }

    if (error) {
        return (
            <p style={{ backgroundColor: 'rgb(247, 250, 251)' }}>
                Error fetching courses: {error.message}
            </p>
        );
    }

    const handleDeleteCourse = async (courseId: number) => {
        if (!currentUserId) return;

        const confirmDelete = window.confirm("Are you sure you want to delete this course? This action cannot be undone.");
        if (!confirmDelete) return;

        setDeletingCourseId(courseId);

        try {
            const token = await getAccessTokenSilently();

            await axios.delete(`http://localhost:8080/api/courses/${courseId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setCourses(prevCourses => prevCourses.filter(course => course.courseId !== courseId));
            setModalMessage("Course successfully deleted.");
        } catch (error) {
            console.error("Error deleting course:", error);
            setModalMessage("Failed to delete course. Please try again later.");
        } finally {
            setDeletingCourseId(null);
        }
    };

    if (courses.length === 0) {
        return (
            <div
                style={{
                    backgroundColor: 'rgb(247, 250, 251)',
                    paddingLeft: '41em',
                    fontSize: '1.5em',
                    // paddingBottom: '10em',
                    paddingTop: '4em',
                }}
            >
                No courses available.
            </div>
        );
    }

    return (
        <div className="bigDaddyContainer" style={{ paddingTop: '13em' }}>
            <div className={`container2 ${isCreatorList ? 'creator-margin' : ''}`}>
                <div className="container2">
                    <div className="webCourseDiv3">{title}</div>
                    {!isCreatorList && (
                        <>
                            <a href="/courses" className="moreCoursesDiv">More courses</a>
                            <div className="lineDiv"></div>
                        </>
                    )}
                </div>
            </div>
            <div className="pictureContainerCoursesList">
                {courses.map(course => (
                    <div
                        key={course.courseId}
                        className="courseWrapper"
                        onClick={() => handleCourseClick(course)}
                    >
                        <div className="leftSide">
                            <img src={enrolledCourse} alt={course.courseName} className="courseImage2" />
                            <div className="imageDescription2">
                                <strong>{course.courseName}</strong>
                                <p>{course.description || 'No description available.'}</p>
                            </div>
                        </div>

                        <div className="rightSide">
                            {!isCreatorList && course.creatorId !== currentUserId && (
                                <div className="progress-section2">
                                    <h2>Your Progress</h2>
                                    <AnimatedProgressBar progress={progressData[course.courseId]?.progress || 0} />
                                    <p>
                                        Completed{' '}
                                        <AnimatedCounter targetNumber={progressData[course.courseId]?.completedLessons || 0} /> /{' '}
                                        {progressData[course.courseId]?.totalLessons || 0} lessons
                                    </p>
                                    <div className="rateCourseDiv" onClick={(e) => e.stopPropagation()}>
                                        <div className="rateLabel">Rate course:</div>
                                        <div className="yourRating">Your Rating: {ratings[course.courseId] || 0}</div>
                                        <div className="starsRow">
                                            {[...Array(5)].map((_, index) => (
                                                <span
                                                    key={index}
                                                    className={`star ${(hoveredRating || ratings[course.courseId] || 0) > index ? 'filled' : ''}`}
                                                    onClick={() => handleRating(index, course.courseId)}
                                                    onMouseEnter={() => handleMouseEnter(index)}
                                                    onMouseLeave={handleMouseLeave}
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    ★
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {isCreatorList && !course.systemCourse && (
                                <div className="courseButtonsWrapper">
                                    <button
                                        className="deleteCourseButton"
                                        onClick={e => {
                                            e.stopPropagation();
                                            handleDeleteCourse(course.courseId);
                                        }}
                                        disabled={deletingCourseId === course.courseId}
                                    >
                                        {deletingCourseId === course.courseId ? 'Deleting...' : 'Delete'}
                                    </button>
                                    <button
                                        className="shareCourseButton"
                                        onClick={async e => {
                                            e.stopPropagation();
                                            try {
                                                const email = prompt('Enter the email address of the invitee:');
                                                if (!email) return;

                                                const token = await getAccessTokenSilently();
                                                await axios.post(
                                                    `http://localhost:8080/api/invite/send-invite`,
                                                    { email, courseId: course.courseId },
                                                    {
                                                        headers: {
                                                            Authorization: `Bearer ${token}`,
                                                        },
                                                    }
                                                );

                                                setModalMessage('Invite link sent to ' + email);
                                            } catch (err) {
                                                console.error('Error sending invite:', err);
                                                if (axios.isAxiosError(err) && err.response?.data) {
                                                    setModalMessage(err.response.data);
                                                } else {
                                                    setModalMessage('Failed to send invite link.');
                                                }
                                            }
                                        }}
                                    >
                                        Share Link
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {modalMessage && (
                <div className="tier-modal-overlay">
                    <div className="tier-modal">
                        <p>{modalMessage}</p>
                        <button onClick={() => setModalMessage(null)}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CoursesList;