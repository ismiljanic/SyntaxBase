import React from 'react';
import { AdminInstructorRequests } from './AdminInstructorRequests';

export function AdminPage() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Admin Dashboard</h1>
      <AdminInstructorRequests />
    </div>
  );
}
