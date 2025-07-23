import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import '../../styles/AdminPage.css';

interface CourseRatingDTO {
    courseId: number;
    averageRating: number;
    courseName: string;
}

interface CourseCompletionDTO {
    courseId: number;
    completionRate: number;
    courseName: string;
}

export function AdminCoursesManagement() {
    const { getAccessTokenSilently } = useAuth0();

    const [topRatedCourses, setTopRatedCourses] = useState<CourseRatingDTO[]>([]);
    const [completionRates, setCompletionRates] = useState<CourseCompletionDTO[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const token = await getAccessTokenSilently();

                const [ratingsRes, completionRes] = await Promise.all([
                    axios.get("http://localhost:8080/api/admin/analytics/top-rated-courses", {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    axios.get("http://localhost:8080/api/admin/analytics/completion-rates", {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                ]);

                setTopRatedCourses(ratingsRes.data);
                setCompletionRates(completionRes.data);
            } catch (err: any) {
                console.error("Error fetching analytics:", err);
                setError("Failed to load course analytics.");
            }
        };

        fetchAnalytics();
    }, [getAccessTokenSilently]);

    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="admin-courses-container">
            <h2>Top Rated Courses</h2>
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>Course Name</th>
                        <th>Average Rating</th>
                    </tr>
                </thead>
                <tbody>
                    {topRatedCourses.map((course) => (
                        <tr key={course.courseId}>
                            <td>{course.courseName}</td>
                            <td>{course.averageRating.toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h2 style={{ marginTop: "2rem" }}>Course Completion Rates</h2>
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>Course Name</th>
                        <th>Completion Rate (%)</th>
                    </tr>
                </thead>
                <tbody>
                    {completionRates.map((course) => (
                        <tr key={course.courseId}>
                            <td>{course.courseName}</td>
                            <td>{(course.completionRate * 100).toFixed(1)}%</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}