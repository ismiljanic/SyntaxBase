import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { Footer2 } from "../pages/Footer2";
import { Footer } from "../pages/Footer";
import { Header } from "../pages/Header";
import LoadingScreen from "./LoadingScreen";

export function PlaceToStartCourse() {
  const navigate = useNavigate();
  const courseId = 4;
  const [progress, setProgress] = useState(0);
  const [completedLessons, setCompletedLessons] = useState(0);
  const [totalLessons, setTotalLessons] = useState(0);

  const { user, isAuthenticated, getAccessTokenSilently, isLoading } = useAuth0();

  useEffect(() => {
    const fetchProgress = async () => {
      if (!isAuthenticated || !user?.sub) return;

      try {
        const token = await getAccessTokenSilently();

        const response = await axios.get("http://localhost:8080/api/progress/progressBar", {
          params: { userId: user.sub, courseId },
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        const { progress, completedLessons, totalLessons } = response.data;
        setProgress(progress);
        setCompletedLessons(completedLessons);
        setTotalLessons(totalLessons);
      } catch (error) {
        console.error("Failed to load progress", error);
      }
    };

    fetchProgress();
  }, [isAuthenticated, user, getAccessTokenSilently]);

  const courseOutline = [
    { title: "New Course Introduction", description: "Overview and goals of this new course." },
    { title: "First Module", description: "Introduction to the first topic." },
    { title: "Second Module", description: "Deep dive into the second topic." },
    { title: "Final Project", description: "Apply everything learned in a project." },
  ];

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="bigContainer">
      <Header bgColor="rgb(247, 250, 251)" />
      <div className="main-container">
        <div className="intro-section">
          <h1>Welcome to Your New Course</h1>
          <p>This course will guide you through exciting new material step-by-step.</p>
          <div className="button-container">
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate(`/dynamic-course/${courseId}/lesson/1`)}
              className="divni1"
            >
              Get Started
            </Button>
          </div>
        </div>

        <div className="course-outline">
          <h2>Course Progress</h2>
          <div className="outline-grid">
            {courseOutline.map((module, index) => (
              <div key={index} className="module-card">
                <div className="module-card-content">
                  <h3>{module.title}</h3>
                  <p>{module.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="progress-section">
          <h2>Your Progress</h2>
          <div className="progress-bar">
            <div
              className="progress-bar-inner"
              style={{ width: `${progress}%`, transition: "width 0.5s ease-in-out" }}
            ></div>
          </div>
          <p>You have completed {progress.toFixed(1)}% of the course</p>
        </div>

        <div className="motivation-section">
          <h2>Keep Going! You're doing great.</h2>
          <p>By the end of the course, you will master new skills and concepts.</p>
        </div>
      </div>
      <Footer2 bgColor="rgb(247, 250, 251)" />
      <Footer bgColor="rgb(247, 250, 251)" />
    </div>
  );
}
