// models/ProtectedRoute.tsx
import { useAuth0 } from '@auth0/auth0-react';
import { Navigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRoles?: string[];
}

const ProtectedRoute = ({ children, requiredRoles }: ProtectedRouteProps) => {
    const { isAuthenticated, isLoading, user, getAccessTokenSilently } = useAuth0();
    const rolesClaim = process.env.REACT_APP_AUTH0_ROLES_CLAIM!;
    const [userActive, setUserActive] = useState<boolean | null>(null);

    useEffect(() => {
        const checkUserActive = async () => {
            if (!user?.sub) return;
            try {
                const token = await getAccessTokenSilently();
                const response = await fetch(`http://localhost:8080/api/users/${encodeURIComponent(user.sub)}/status`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch user status');
                }

                const data = await response.json();
                setUserActive(data.active);

            } catch (error) {
                console.error('Error fetching user status:', error);
                setUserActive(false);
            }
        };

        checkUserActive();
    }, [user, getAccessTokenSilently]);

    if (isLoading) return <p>Loading...</p>;

    if (!isAuthenticated) {
        return <Navigate to="/unauthorized" replace />;
    }

    if (userActive === false) {
        return <Navigate to="/suspended" replace />;
    }

    if (userActive === null) {
        return <p>Verifying access...</p>;
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
