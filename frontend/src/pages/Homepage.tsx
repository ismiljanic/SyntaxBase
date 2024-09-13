import React, { useState, useEffect } from 'react';
import '../styles/Homepage.css';
import { HomepageHeader } from './HomepageHeader';
import { Footer2 } from './Footer2';
import { Footer } from './Footer';
import CoursesList from '../components/CoursesList';

const Homepage: React.FC = () => {
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const storedUserId = sessionStorage.getItem('userId');
    
    // console.log("Stored userId from sessionStorage:", storedUserId);
    
    if (storedUserId) {
      setUserId(parseInt(storedUserId, 10)); 
    }
  }, []);
  
  useEffect(() => {
    if (userId !== null) {
      // console.log("Updated userId:", userId);
    }
  }, [userId]);
  

  return (
    <div className='homepageContainer'>
      <HomepageHeader bgColor='rgb(247, 250, 251)' />

      {userId ? (
        <CoursesList userId={userId} />
      ) : (
        <p>Loading courses...</p>
      )}

      <Footer2 bgColor='rgb(247, 250, 251)' />
      <Footer bgColor="rgb(247, 250, 251)" />
    </div>
  );
};

export default Homepage;
