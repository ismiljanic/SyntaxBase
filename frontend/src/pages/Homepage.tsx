import React from 'react';
import '../styles/Homepage.css';
import { HomepageHeader } from './HomepageHeader';
import { Footer2 } from './Footer2';
import { Footer } from './Footer';
import CoursesList from '../components/CoursesList';

const Homepage: React.FC = () => {

  return (
    <div className='homepageContainer'>
      <HomepageHeader bgColor='#f5f5f5'></HomepageHeader>
      <CoursesList userId={3} />
      <div className='homepageDiv'></div>
      <Footer2 bgColor='#f5f5f5' />
      <Footer bgColor="#f5f5f5" />
    </div>
  )
};
export default Homepage;