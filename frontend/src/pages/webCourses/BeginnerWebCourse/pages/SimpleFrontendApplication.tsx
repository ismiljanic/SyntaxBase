import React from 'react';
import SimpleFrontendHeader from './SimpleFrontendHeader';
import SimpleFrontendFooter from './SimpleFrontendFooter';
import '../../../../styles/webCourses/BeginnerWebCourse/SimpleFrontendApplication.css';

export function SimpleFrontendApplication() {
    return (
        <div>
            <SimpleFrontendHeader />
            <div className='simple-container'>
                <h1>
                    Simple Frontend Application
                </h1>
            </div>
            <SimpleFrontendFooter />
        </div>
    );
}
