import React from 'react';
import '../styles/Homepage.css';
import { HomepageHeader } from './HomepageHeader';
import { Footer2 } from './Footer2';
import { Footer } from './Footer';

const Homepage: React.FC = () => {

  return (
    <div>
      <HomepageHeader></HomepageHeader>
      <Footer2 bgColor='#f5f5f5' />
      <Footer bgColor="#f5f5f5" />
    </div>
  )
};
export default Homepage;