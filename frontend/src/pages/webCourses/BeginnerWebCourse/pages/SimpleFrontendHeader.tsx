import React from 'react';
import { Link } from 'react-router-dom';

const SimpleFrontendHeader = () => (
  <header className='simpleHeader'>
    <nav className='simpleHeaderText'>
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
    </nav>
  </header>
);

export default SimpleFrontendHeader;
