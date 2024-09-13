import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

export function MyCourses() {
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        console.log(`User ID: ${id}`);
    }, [id]);

    return (
        <div>
            <h1>My Courses for User {id}</h1>
        </div>
    );
}
