import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LoadingScreen from "../components/LoadingScreen";
import "../styles/UserProfile.css";
import { useAuth0 } from "@auth0/auth0-react";

interface User {
    username: string;
    role: string;
    dateCreated: Date;
};

interface Post {
    id: number;
    content: string;
    userId: string;
    username: string;
    createdAt: string;
    replies?: Post[];
    parentPostId?: number | null;
    isExpanded?: boolean;
    category: string;
    userRole?: string;
    updatedAt: string;
    deleted: boolean;
    userAccountCreatedAt?: Date;
}

interface BadgeDTO {
    id: string;
    name: string;
    description: string;
    type: string;
    criteria?: string;
    permanent: boolean;
}

interface UserBadge {
    id: string;
    badge: BadgeDTO;
    awardedAt: string;
    revoked: boolean;
    progress?: string;
}

interface Course {
    courseId: number;
    courseName: string;
    category?: string;
    length?: number;
    description?: string;
    creatorId?: string;
    systemCourse?: boolean;
}

interface UserProfileData {
    user: User;
    badges: UserBadge[];
    posts: Post[];
    courses: Course[];
}

const UserProfile = () => {
    const { username } = useParams();
    const [user, setUser] = useState<UserProfileData | null>(null);

    const { getAccessTokenSilently } = useAuth0();

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const token = await getAccessTokenSilently();

                const res = await fetch(`http://localhost:8080/api/users/${username}/profile`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) {
                    console.error("Failed to fetch profile:", res.status, res.statusText);
                    return;
                }

                const data = await res.json();
                setUser(data);
            } catch (err) {
                console.error("Error fetching profile:", err);
            }

        };
        fetchUserProfile();
    }, [username]);

    if (!user) {
        return <LoadingScreen />;
    }
    return (
        <div className="user-profile">
            <div className="profile-header">
                {/* <img src={user.avatarUrl || "/images/default-avatar.png"} alt="Avatar" className="profile-avatar" /> */}
                <h1>{user.user.username}</h1>
                <span className="role">{user.user.role}</span>
                <span className="joined-date">Joined: {new Date(user.user.dateCreated).toLocaleString()}</span>
            </div>

            <section className="profile-badges">
                <h2>Badges</h2>
                <div className="user-badges-profile">
                    {user.badges.map((ub) => (
                        <span key={ub.id} className={`badge ${ub.badge.type.toLowerCase()}`}>
                            {ub.badge.name}
                        </span>
                    ))}
                </div>
            </section>

            <section className="profile-courses">
                <h2>Enrolled Courses</h2>
                <ul>
                    {user.courses.map(course => (
                        <li key={course.courseId}>{course.courseName}</li>
                    ))}
                </ul>
            </section>

            <section className="profile-posts">
                <h2>Posts</h2>
                <ul>
                    {user.posts.map(post => (
                        <li key={post.id}>{post.content}</li>
                    ))}
                </ul>
            </section>
        </div>
    );
};

export default UserProfile;
