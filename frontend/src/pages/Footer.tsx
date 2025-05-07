import React from 'react';
import '../styles/Footer.css';
import picture from '../images/logoSyntaxBase.png';

interface FooterProps {
  bgColor?: string;
}

export function Footer({ bgColor = '#333' }: FooterProps) {
  return (
    <footer className="footer" style={{ backgroundColor: bgColor }}>
      <a href="/" className="footer-logo-link">
        <img src={picture} alt="Logo SyntaxBase" className="footer-logo" />
      </a>
      <div className="footer-text">
        <p>&copy; 2025 SyntaxBase.</p>
        <p> All rights reserved.</p>
      </div>
      <div className="footer-links">
        <a href="/privacy">Privacy Policy</a>
        <a href="/terms">Terms of Service</a>
        <a href="/contact">Contact Us</a>
      </div>
    </footer>
  );
}
