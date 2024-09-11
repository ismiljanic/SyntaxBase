import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

export function MyCourses() {
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        console.log(`User ID: ${id}`);
        // Fetch or handle courses based on the ID here
    }, [id]);

    return (
        <div>
            <h1>My Courses for User {id}</h1>
            {/* Render the user's courses here */}
        </div>
    );
}
