import React, { useEffect, useState } from 'react';

interface AnimatedCounterProps {
  targetNumber: number;
  duration?: number;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ targetNumber, duration = 500 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    if (targetNumber === 0) {
      setCount(0);
      return;
    }

    const incrementTime = Math.floor(duration / targetNumber);
    const interval = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= targetNumber) {
        clearInterval(interval);
      }
    }, incrementTime);

    return () => clearInterval(interval);
  }, [targetNumber, duration]);

  return <span>{count}</span>;
};

export default AnimatedCounter;
