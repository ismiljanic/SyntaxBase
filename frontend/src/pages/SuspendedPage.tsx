import React from 'react';
import { Header } from '../pages/Header';
import { Footer } from '../pages/Footer';
import { Footer2 } from './Footer2';

export function SuspendedPage() {
    return (
        <div>
            <Header bgColor="#f5f5f5" />
            <div style={{ padding: '4rem', textAlign: 'center' }}>
                <h2>Your account has been suspended</h2>
                <p>Please contact support or your administrator for more information.</p>
            </div>
            <Footer2 bgColor="#f5f5f5" />
            <Footer bgColor="#f5f5f5" />
        </div>
    );
}