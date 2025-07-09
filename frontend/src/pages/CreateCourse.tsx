import React, { useEffect, useState } from 'react';
import '../styles/CreateCourse.css';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import { Header } from './Header';
import { Footer } from './Footer';
import { Footer2 } from './Footer2';

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
        category: "General",
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
        description: "DESCRIPTION",
        category: "Web Development",
        length: 5,
        lessons: ["JSX Basics", "State & Props", "Hooks", "Routing", "Project Setup"],
        tier: "Professional",
    },
    {
        name: "ULTIMATE TIER",
        description: "DESCRIPTION",
        category: "Data Science",
        length: 6,
        lessons: ["Intro to Python", "Numpy", "Pandas", "Visualization", "Stats", "Mini Project"],
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
            alert(`Your tier (${userTier}) does not permit creating courses of the ${selected.tier} tier.`);
            setLoading(false);
            return;
        }

        const lessonCount = selected.lessons.length;
        if (userTier && lessonCount > tierLimits[userTier]) {
            alert(`Your tier (${userTier}) allows a maximum of ${tierLimits[userTier]} lessons per course. Selected course has ${lessonCount}.`);
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

            alert("Course successfully created!");
            setSelected(null);
        } catch (error: any) {
            console.error("Error creating course:", error);
            if (error.response && error.response.data && error.response.data.message) {
                alert("Error: " + error.response.data.message);
            } else {
                alert("Failed to create course. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

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

            </div>
            <Footer2 bgColor='#f5f5f5' />
            <Footer bgColor='#f5f5f5' />
        </div>
    );
};
export default CreateCourse;