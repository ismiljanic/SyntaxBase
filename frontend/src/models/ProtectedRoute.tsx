// models/ProtectedRoute.tsx
import { useAuth0 } from '@auth0/auth0-react';
import { Navigate } from 'react-router-dom';
import React from 'react';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRoles?: string[];
}

const ProtectedRoute = ({ children, requiredRoles }: ProtectedRouteProps) => {
    const { isAuthenticated, isLoading, user } = useAuth0();
    const rolesClaim = process.env.REACT_APP_AUTH0_ROLES_CLAIM!;
    
    if (isLoading) return <p>Loading...</p>;

    if (!isAuthenticated) {
        return <Navigate to="/unauthorized" replace />;
    }


    if (requiredRoles && requiredRoles.length > 0) {
        const userRoles: string[] = user?.[rolesClaim] || [];
        const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));

        if (!hasRequiredRole) {
            return <Navigate to="/forbidden" replace />;
        }
    }

    return <>{children}</>;
};

export default ProtectedRoute;
