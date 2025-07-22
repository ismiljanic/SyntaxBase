import React, { useEffect, useState } from 'react';
import { AdminInstructorRequests } from '../../components/admin/AdminInstructorRequests';
import { useAuth0 } from '@auth0/auth0-react';
import '../../styles/AdminPage.css';
import { Header } from '../../pages/Header';
import { AdminUserManagement } from '../../components/admin/AdminUserManagment';
import { AdminCoursesManagement } from '../../components/admin/AdminCoursesManagment';

export function AdminPage() {
  const { getAccessTokenSilently, isAuthenticated, loginWithRedirect } = useAuth0();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'users' | 'requests' | 'courses'>('users');

  useEffect(() => {
    const checkAccess = async () => {
      try {
        if (!isAuthenticated) {
          setError('You must be logged in to access this page.');
          setLoading(false);
          return;
        }
        await getAccessTokenSilently();
        setLoading(false);
      } catch (e) {
        setError('Session expired or you are not authorized. Please log in again.');
        setLoading(false);
      }
    };
    checkAccess();
  }, [getAccessTokenSilently, isAuthenticated]);

  if (loading) return (
    <div className="loading-container">
      <div className="loader"></div>
      <p className="loading-text">Loading...</p>
    </div>
  );

  if (error)
    return (
      <div className="error-container">
        <h2 className="error-title">Access Denied</h2>
        <p className="error-message">{error}</p>
        <div className="button-group">
          <button className="primary-button" onClick={() => loginWithRedirect()}>
            Log In
          </button>
          <button
            className="secondary-button"
            onClick={() => (window.location.href = '/')}
          >
            Go to Homepage
          </button>
        </div>
      </div>
    );

  return (
    <div className="page-container">
      <Header bgColor='#f5f5f5' />

      <div className="admin-tabs">
        <button
          className={activeTab === 'users' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
        <button
          className={activeTab === 'requests' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('requests')}
        >
          Instructor Requests
        </button>
         <button
          className={activeTab === 'courses' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('courses')}
        >
          Courses
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'users' && <AdminUserManagement />}
        {activeTab === 'requests' && <AdminInstructorRequests />}
        {activeTab === 'courses' && <AdminCoursesManagement />}
      </div>
    </div>
  );
}