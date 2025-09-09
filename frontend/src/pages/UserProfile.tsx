import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LoadingScreen from "../components/LoadingScreen";
import "../styles/UserProfile.css";
import { useAuth0 } from "@auth0/auth0-react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Footer2 } from "./Footer2";
import image from "../images/default-avatar.png";
import CoursesList from "../components/CoursesList";

interface User {
    auth0UserId: string;
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
    const { isAuthenticated, getAccessTokenSilently, user: auth0User } = useAuth0();
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    useEffect(() => {
        if (auth0User) {
            setCurrentUserId(auth0User.sub || null);
        }
    }, [auth0User]);

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
        <div>
            <Header bgColor="#f9f9f9" />
            <div className="user-profile">
                <div className="profile-header">
                    <img src={image} alt="Avatar" className="profile-avatar" />
                    <div className="profile-info">
                        <h1>{user.user.username}</h1>
                        <p className="role">{user.user.role}</p>
                        <p className="joined-date">Joined {new Date(user.user.dateCreated).toLocaleDateString()}</p>
                    </div>
                </div>

                <div className="profile-grid">
                    <section className="profile-section">
                        <h2>Badges</h2>
                        <div className="badge-grid">
                            {user.badges.map((ub) => (
                                <span className="badge-tooltip">
                                    {ub.badge.name}
                                    <span className="tooltip-text">{ub.badge.description}</span>
                                </span>
                            ))}
                        </div>
                    </section>

                    <section className="profile-section">
                        <div className="user-profile-courses-wrapper">
                            <CoursesList
                                profileUserId={user.user.auth0UserId}
                                currentUserId={currentUserId}
                                title="Enrolled Courses"
                                isCreatorList={false}
                            />
                        </div>
                    </section>
                    <section className="profile-section">
                        <h2>Recent Posts</h2>
                        <div className="post-list">
                            {user.posts.map(post => (
                                <div key={post.id} className="post-card">
                                    <p>{post.content}</p>
                                    <small>{new Date(post.createdAt).toLocaleDateString()}</small>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
            <Footer2 bgColor="#f9f9f9" />
            <Footer bgColor="#f9f9f9" />
        </div>
    );
};

export default UserProfile;
