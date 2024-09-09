import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RegisterComponent } from "../components/Register";
import '../styles/Login.css';


export function Register() {
    return (
        <div className="login-page">
            <div className="login-header">
                <h1>Don't have account?</h1>
                <p>Please register to access our courses and tutorials!</p>
            </div>
            <RegisterComponent />
        </div>
    );
}
