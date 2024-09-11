import React from 'react';
import '../styles/About.css';

export function About() {

    return (
        <div className="about-container">
            {/* Introduction Section */}
            <section className="introduction">
                <h1>About Our Platform</h1>
                <p>Welcome to [Your Platform Name], where developers, learners, and enthusiasts come together to grow their skills and solve real-world challenges. Our mission is to provide accessible and quality learning experiences to help you reach your full potential as a developer.</p>
            </section>

            {/* Mission and Vision Section */}
            <section className="mission-vision">
                <h2>Our Mission</h2>
                <p>We aim to democratize coding education by offering a platform where anyone can learn, build, and excel, regardless of their experience level. We believe in fostering an inclusive, supportive community where innovation and creativity thrive.</p>
                
                <h2>Our Vision</h2>
                <p>To become the go-to platform for coding enthusiasts and developers, where every learner can access world-class resources and personalized support for their journey.</p>
            </section>

            {/* Core Values Section */}
            <section className="core-values">
                <h2>Our Core Values</h2>
                <ul>
                    <li><strong>Innovation:</strong> We push the boundaries of what's possible in online learning.</li>
                    <li><strong>Accessibility:</strong> Coding should be for everyone, which is why we ensure our content is accessible to all.</li>
                    <li><strong>Community:</strong> Together, we learn faster and achieve more.</li>
                    <li><strong>Quality:</strong> We are committed to providing the best resources and experiences for our users.</li>
                </ul>
            </section>

            {/* The Team Section */}
            <section className="team">
                <h2>Meet the Team</h2>
                <div className="team-members">
                    <div className="team-member">
                        <img src="team1.jpg" alt="Team Member 1" />
                        <h3>John Doe</h3>
                        <p>Co-Founder & Lead Developer</p>
                    </div>
                    <div className="team-member">
                        <img src="team2.jpg" alt="Team Member 2" />
                        <h3>Jane Smith</h3>
                        <p>Co-Founder & Content Creator</p>
                    </div>
                    {/* Add more team members here */}
                </div>
            </section>

            {/* The Story Section */}
            <section className="story">
                <h2>Our Story</h2>
                <p>[Your Platform Name] started with a simple idea: to make coding education more accessible and enjoyable for everyone. From humble beginnings as a small project, we’ve grown into a platform that serves learners worldwide, providing hands-on tutorials, expert guidance, and a vibrant community.</p>
            </section>

            {/* Technologies Section */}
            <section className="technologies">
                <h2>Technologies We Use</h2>
                <p>Our platform is built using modern technologies like React, Node.js, and cloud computing. We are constantly evolving to adopt the latest tools and frameworks to give our users the best possible experience.</p>
            </section>

            {/* Testimonials Section */}
            <section className="testimonials">
                <h2>What Our Users Are Saying</h2>
                <div className="testimonial">
                    <p>"This platform transformed my coding skills. The tutorials are practical and easy to follow!" – Alex</p>
                </div>
                <div className="testimonial">
                    <p>"The community support here is phenomenal. Whenever I get stuck, help is just a message away." – Maria</p>
                </div>
                {/* Add more testimonials */}
            </section>

            {/* Call to Action */}
            <section className="cta">
                <h2>Ready to Get Started?</h2>
                <p>Join us today and unlock your full potential as a developer. Whether you're a beginner or an experienced coder, we have something for you.</p>
                <a href="/signup" className="cta-button">Join the Community</a>
            </section>
        </div>
    );
};

export default About;