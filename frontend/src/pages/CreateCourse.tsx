import React, { useState } from 'react';
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
}

const templates: CourseTemplate[] = [
    {
        name: "Beginner JavaScript",
        description: "Learn JavaScript from scratch. Perfect for beginners.",
        category: "Programming",
        length: 4,
        lessons: ["Variables & Types", "Functions", "Loops", "DOM Manipulation"],
    },
    {
        name: "React Bootcamp",
        description: "Dive into React.js and build dynamic web apps.",
        category: "Web Development",
        length: 5,
        lessons: ["JSX Basics", "State & Props", "Hooks", "Routing", "Project Setup"],
    },
    {
        name: "Python for Data Science",
        description: "Start with Python, then explore data science tools.",
        category: "Data Science",
        length: 6,
        lessons: ["Intro to Python", "Numpy", "Pandas", "Visualization", "Stats", "Mini Project"],
    }
];

const CreateCourse: React.FC = () => {
    const [selected, setSelected] = useState<CourseTemplate | null>(null);
    const [loading, setLoading] = useState(false);
    const { getAccessTokenSilently, user } = useAuth0();

    const handleCreate = async () => {
        if (!selected || !user) return;

        setLoading(true);

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

            alert("✅ Course successfully created!");
            setSelected(null);
        } catch (error) {
            console.error("Error creating course:", error);
            alert("❌ Failed to create course. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Header bgColor='#f5f5f5'></Header>
            <div className="create-course-container">
                <h1>Create a New Course</h1>
                {!selected && (
                    <div className="templates-grid">
                        {templates.map((template, index) => (
                            <div key={index} className="template-card" onClick={() => setSelected(template)}>
                                <h3>{template.name}</h3>
                                <p>{template.description}</p>
                                <span className="category-badge">{template.category}</span>
                            </div>
                        ))}
                    </div>
                )}
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
                        <button onClick={handleCreate} className="confirm-button" disabled={loading}>
                            {loading ? "Creating..." : "Create Course"}
                        </button>
                        <button onClick={() => setSelected(null)} className="back-button" disabled={loading}>
                            Back to Templates
                        </button>
                    </div>
                )}
            </div>
            <Footer bgColor='#f5f5f5'/>
            <Footer2 bgColor='#f5f5f5'/>
        </div>
    );
};

export default CreateCourse;