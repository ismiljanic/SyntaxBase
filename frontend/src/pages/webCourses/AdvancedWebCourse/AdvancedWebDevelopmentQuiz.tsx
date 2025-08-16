import React, { useState } from 'react';
import '../../../styles/webCourses/BeginnerWebCourse/Quiz.css';
import { Header } from '../../Header'
import { Footer } from '../../Footer';
import { Footer2 } from '../../Footer2';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import LoadingScreen from '../../../components/LoadingScreen';

export function AdvancedWebDevelopmentQuiz() {
    const navigate = useNavigate();
    const { user, isAuthenticated, loginWithRedirect, isLoading } = useAuth0();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [score, setScore] = useState(0);
    const [isQuizCompleted, setIsQuizCompleted] = useState(false);
    const [feedback, setFeedback] = useState<string>('');

    if (isLoading) {
        return <LoadingScreen />;
    }

    if (!isAuthenticated) {
        loginWithRedirect();
        return null;
    }
    const userId = user?.sub;


    const quizQuestions = [
        {
            question: 'Which frontend technology did we use to build the Blood Donation Management System?',
            options: ['React with TypeScript', 'Vue with JavaScript', 'Angular with TypeScript', 'Svelte with JavaScript'],
            correctAnswer: 'React with TypeScript',
        },
        {
            question: 'Which backend framework powers the APIs in our final project?',
            options: ['Express.js', 'Spring Boot', 'Django', 'NestJS'],
            correctAnswer: 'Spring Boot',
        },
        {
            question: 'What database solution is used to store donor, appointment, and blood stock information?',
            options: ['PostgreSQL', 'MongoDB', 'MySQL', 'SQLite'],
            correctAnswer: 'PostgreSQL',
        },
        {
            question: 'Which key feature ensures only authorized users can access sensitive data?',
            options: ['Authentication & Authorization', 'Caching', 'Code Splitting', 'CI/CD'],
            correctAnswer: 'Authentication & Authorization',
        },
        {
            question: 'Which module allows organizations to manage blood stock and donations?',
            options: ['Donor Registration', 'Organization Management Tools', 'Reward System', 'Appointment Scheduling'],
            correctAnswer: 'Organization Management Tools',
        },
        {
            question: 'Why did we implement a reward system in the application?',
            options: ['To gamify donation and increase user engagement', 'To manage database backups', 'To handle session storage', 'To reduce server load'],
            correctAnswer: 'To gamify donation and increase user engagement',
        },
        {
            question: 'Which testing strategy is recommended for ensuring both frontend and backend work correctly together?',
            options: ['Unit Testing Only', 'Integration Testing', 'Manual Testing Only', 'Linting'],
            correctAnswer: 'Integration Testing',
        },
        {
            question: 'How is appointment scheduling handled in the system?',
            options: ['By linking donors with available times and storing them in the database', 'Through manual email communication', 'By storing schedules in localStorage', 'By exporting times to a CSV file'],
            correctAnswer: 'By linking donors with available times and storing them in the database',
        },
    ];


    const handleAnswerSelect = (answer: string) => {
        setSelectedAnswer(answer);
        if (answer === quizQuestions[currentQuestionIndex].correctAnswer) {
            setFeedback('Correct!');
        } else {
            setFeedback('Incorrect, try again.');
        }
    };

    const handleNextQuestion = () => {
        if (selectedAnswer === quizQuestions[currentQuestionIndex].correctAnswer) {
            setScore(score + 1);
        }
        if (currentQuestionIndex < quizQuestions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedAnswer(null);
            setFeedback('');
        } else {
            setIsQuizCompleted(true);
        }
    };

    const handleRestartQuiz = () => {
        setCurrentQuestionIndex(0);
        setSelectedAnswer(null);
        setScore(0);
        setIsQuizCompleted(false);
        setFeedback('');
    };

    if (isQuizCompleted) {
        return (
            <>
                <Header bgColor="#f6f6f6" />
                <div className="quiz-result-wrapper">
                    <div className="quiz-result">
                        <h2>Quiz Completed!</h2>
                        <p>Your score: {score} / {quizQuestions.length}</p>
                        <button className="quiz-btn-restart" onClick={handleRestartQuiz}>
                            Try Again
                        </button>
                        <div className="quiz-navigation-buttons">
                            <button className="quiz-btn-home" onClick={() => navigate('/')}>
                                Go to Homepage
                            </button>
                            <button className="quiz-btn-user-home" onClick={() => navigate(`/homepage/${userId}`)}>
                                Go to Your Homepage
                            </button>
                        </div>
                    </div>
                </div>
                <Footer2 bgColor="#f6f6f6" />
                <Footer bgColor="#f6f6f6" />
            </>
        );
    }
    return (
        <div>
            <Header bgColor="#f6f6f6" />
            <div className="quiz-container">
                <h2>{quizQuestions[currentQuestionIndex].question}</h2>

                <div className="feedback">
                    <p>{feedback}</p>
                </div>

                <div className="answerOptions">
                    {quizQuestions[currentQuestionIndex].options.map((option, index) => (
                        <button
                            key={index}
                            className={`answer-option quiz-answer-btn ${selectedAnswer === option ? 'selected' : ''}`}
                            onClick={() => handleAnswerSelect(option)}
                        >
                            {option}
                        </button>
                    ))}
                </div>

                <button
                    className="quiz-btn-next"
                    onClick={handleNextQuestion}
                    disabled={selectedAnswer === null}
                >
                    Next Question
                </button>
            </div>
            <Footer2 bgColor="#f6f6f6" />
            <Footer bgColor="#f6f6f6" />
        </div>
    );
}