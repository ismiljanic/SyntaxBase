import React, { useEffect, useState } from 'react';
import '../styles/CreateCourse.css';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import { Header } from './Header';
import { Footer } from './Footer';
import { Footer2 } from './Footer2';
import { tierLessonLimits } from '../models/tierLimits';
import { useNavigate } from 'react-router-dom';

interface CourseTemplate {
    name: string;
    description: string;
    category: string;
    length: number;
    lessons: string[];
    tier: Tier;
}

type Tier = "Free" | "Professional" | "Ultimate";

const templates: CourseTemplate[] = [
    {
        name: "Free Tier Starter Course",
        description: "5 lessons free tier course.",
        category: "Premade templates",
        length: 5,
        lessons: [
            "Introduction",
            "Basic Concepts",
            "Getting Started",
            "Common Pitfalls",
            "Summary & Next Steps"
        ],
        tier: "Free",
    },
    {
        name: "PROFESSIONAL TIER",
        description: "Up to 15 lessons professional tier course.",
        category: "Premade templates",
        length: 5,
        lessons: [
            "Introduction PROFESSIONAL",
            "Basic Concepts PROFESSIONAL",
            "Getting Started PROFESSIONAL",
            "Common Pitfalls PROFESSIONAL",
            "Summary & Next Steps PROFESSIONAL"
        ],
        tier: "Professional",
    },
    {
        name: "ULTIMATE TIER",
        description: "Unlimited lessons ultimate tier course.",
        category: "Premade templates",
        length: 5,
        lessons: [
            "Introduction ULTIMATE",
            "Basic Concepts ULTIMATE",
            "Getting Started ULTIMATE",
            "Common Pitfalls ULTIMATE",
            "Summary & Next Steps ULTIMATE"
        ],
        tier: "Ultimate",
    }
];

const tierHierarchy: Record<Tier, number> = {
    Free: 1,
    Professional: 2,
    Ultimate: 3,
};

const CreateCourse: React.FC = () => {
    const [selected, setSelected] = useState<CourseTemplate | null>(null);
    const [loading, setLoading] = useState(false);
    const { getAccessTokenSilently, user } = useAuth0();
    const [userTier, setUserTier] = useState<Tier | null>(null);
    const [modalMessage, setModalMessage] = useState<string | null>(null);
    const navigate = useNavigate();
    const [role, setRole] = useState<string | null>(null);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchUserRole = async () => {
            try {
                const token = await getAccessTokenSilently();
                const response = await axios.get(`http://localhost:8080/api/users/role/${user.sub}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setRole(response.data.role);
            } catch (error) {
                console.error('Error fetching user role:', error);
                navigate('/error');
            }
        };

        fetchUserRole();
    }, [user, getAccessTokenSilently, navigate]);

    //zbog backenda u kojem je sve upercase
    const normalizeTier = (tier: string): Tier => {
        const t = tier.toLowerCase();
        if (t === "free") return "Free";
        if (t === "professional") return "Professional";
        if (t === "ultimate") return "Ultimate";
        return "Free";
    };


    useEffect(() => {
        const fetchUserTier = async () => {
            if (!user) return;

            const token = await getAccessTokenSilently();
            try {
                const response = await axios.get('http://localhost:8080/api/users/userInformation', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setUserTier(normalizeTier(response.data.tier));
            } catch (error) {
                console.error("Failed to fetch user tier", error);
            }
        };

        fetchUserTier();
    }, [user]);

    const handleCreate = async () => {
        if (!selected || !user) return;

        setLoading(true);

        const tierLimits: Record<Tier, number> = {
            Free: 5,
            Professional: 15,
            Ultimate: Number.MAX_SAFE_INTEGER
        };

        if (userTier && tierHierarchy[userTier] < tierHierarchy[selected.tier]) {
            setModalMessage(`Your tier (${userTier}) does not permit creating courses of the ${selected.tier} tier.`);
            setLoading(false);
            return;
        }

        const lessonCount = selected.lessons.length;
        if (userTier && selected.lessons.length > tierLessonLimits[userTier]) {
            setModalMessage(`Your tier (${userTier}) allows a maximum of ${tierLessonLimits[userTier]} lessons per course. Selected course has ${selected.lessons.length}.`);
            setLoading(false);
            return;
        }

        try {
            const token = await getAccessTokenSilently();

            const coursePayload = {
                courseName: selected.name,
                description: selected.description,
                category: selected.category,
                courseLength: selected.length,
                auth0UserId: user.sub,
                lessons: selected.lessons,
            };

            await axios.post('http://localhost:8080/api/courses/create-with-lessons', coursePayload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            setModalMessage("Course successfully created!");
            setSelected(null);
        } catch (error: any) {
            console.error("Error creating course:", error);
            if (error.response && error.response.data && error.response.data.message) {
                setModalMessage("Error: " + error.response.data.message);
            } else {
                setModalMessage("Failed to create course. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    if (role !== 'INSTRUCTOR') {
        navigate('/forbidden');
        return null;
    }

    return (
        <div>
            <Header bgColor='#f5f5f5' />
            <div className="create-course-container">
                <h1>Create a New Course</h1>

                {userTier ? (
                    <p>Your current tier: <strong>{userTier}</strong></p>
                ) : (
                    <p>Loading your tier...</p>
                )}

                {userTier ? (
                    <div className="templates-grid">
                        {templates.map((template, index) => {
                            const isAvailable = tierHierarchy[template.tier] <= tierHierarchy[userTier];
                            return (
                                <div
                                    key={index}
                                    className={`template-card ${selected === template ? 'selected' : ''}`}
                                    onClick={() => {
                                        if (!isAvailable) return;

                                        if (selected?.name === template.name) {
                                            setSelected(null);
                                        } else {
                                            setSelected(template);
                                        }
                                    }}

                                    style={{
                                        cursor: isAvailable ? 'pointer' : 'not-allowed',
                                        opacity: isAvailable ? 1 : 0.5,
                                        pointerEvents: isAvailable ? 'auto' : 'none'
                                    }}
                                >
                                    <h3>{template.name}</h3>
                                    <p>{template.description}</p>
                                    <span className="category-badge">{template.category}</span>
                                    <p><em>Tier: {template.tier}</em></p>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <p>Loading your tier...</p>
                )}
                <div
                    className={`template-preview-container ${selected ? 'expanded' : 'collapsed'}`}
                >
                    {selected && (
                        <div className="template-preview">
                            <h2>{selected.name}</h2>
                            <p>{selected.description}</p>
                            <p><strong>Category:</strong> {selected.category}</p>
                            <p><strong>Lessons:</strong></p>
                            <ul>
                                {selected.lessons.map((lesson, i) => (
                                    <li key={i}>{lesson}</li>
                                ))}
                            </ul>
                            <p><strong>Tier:</strong> {selected.tier}</p>
                            <button onClick={handleCreate} className="confirm-button" disabled={loading}>
                                {loading ? "Creating..." : "Create Course"}
                            </button>
                            <button onClick={() => setSelected(null)} className="back-button" disabled={loading}>
                                Back to Templates
                            </button>
                        </div>
                    )}
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
            <Footer2 bgColor='#f5f5f5' />
            <Footer bgColor='#f5f5f5' />
        </div>
    );
};
export default CreateCourse;