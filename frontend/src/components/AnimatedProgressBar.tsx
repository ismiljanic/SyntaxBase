import React, { useEffect, useState } from "react";

interface ProgressBarProps {
  progress: number; // 0 to 100
}

const AnimatedProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 100;
    const incrementTime = 10;
    const steps = duration / incrementTime;
    const increment = progress / steps;

    if (progress === 0) {
      setWidth(0);
      return;
    }

    const interval = setInterval(() => {
      start += increment;
      if (start >= progress) {
        start = progress;
        clearInterval(interval);
      }
      setWidth(start);
    }, incrementTime);

    return () => clearInterval(interval);
  }, [progress]);

  return (
    <div className="progress-bar2">
      <div
        className="progress-bar-inner2"
        style={{
          width: `${width}%`,
        }}
      ></div>
    </div>
  );
};

export default AnimatedProgressBar;
