import React, { useState } from 'react';
import '../../../styles/webCourses/BeginnerWebCourse/Quiz.css';
import { Header } from '../../Header'
import { Footer } from '../../Footer';
import { Footer2 } from '../../Footer2';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

export function IntermediateWebDevelopmentQuiz() {
    const navigate = useNavigate();
    const { user, isAuthenticated, loginWithRedirect, isLoading } = useAuth0();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [score, setScore] = useState(0);
    const [isQuizCompleted, setIsQuizCompleted] = useState(false);
    const [feedback, setFeedback] = useState<string>('');

    if (isLoading) return <div>Loading...</div>;
    console.log("prije provjere auth-a");
    if (!isAuthenticated) {
        loginWithRedirect();
        return null;
    }
    const userId = user?.sub;


    const quizQuestions = [
        {
            question: 'Which backend framework did we use for API development?',
            options: ['Express', 'Django', 'Ruby on Rails', 'Flask'],
            correctAnswer: 'Express',
        },
        {
            question: 'What database technology did we connect our backend to?',
            options: ['MySQL', 'MongoDB', 'PostgreSQL', 'SQLite'],
            correctAnswer: 'PostgreSQL',
        },
        {
            question: 'Which authentication protocol did we integrate?',
            options: ['OAuth2', 'SAML', 'Basic Auth', 'JWT only'],
            correctAnswer: 'OAuth2',
        },
        {
            question: 'Where do you store environment variables in this project?',
            options: ['.env files', 'package.json', 'README.md', 'config.js'],
            correctAnswer: '.env files',
        },
        {
            question: 'What frontend library did we use for building UI?',
            options: ['React', 'Vue', 'Angular', 'Svelte'],
            correctAnswer: 'React',
        },
        {
            question: 'What is the purpose of QR code generation in our app?',
            options: ['Ticket verification', 'User authentication', 'Database backup', 'Styling elements'],
            correctAnswer: 'Ticket verification',
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