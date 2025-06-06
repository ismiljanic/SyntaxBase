# SyntaxBase

**SyntaxBase** is a full-stack web application designed to help users **learn programming** and **build real-world applications** from the ground up. Built with **React**, **Spring Boot**, and **PostgreSQL**, the platform provides a structured, self-paced learning experience across multiple domains of software development.

## What is SyntaxBase?

SyntaxBase offers a wide range of tutorials, exercises, and interactive content organized into **five core sections**:

- **Web Development**
- **Game Development**
- **Database Management**
- **Problem Solving**
- **Instructions & Lectures**

Each section is divided into **three tiers**—**Beginner**, **Intermediate**, and **Advanced**—allowing users to progress based on their skill level and experience.

## Community

SyntaxBase includes an integrated **community forum** where users can:
- Share ideas and projects
- Give and receive feedback
- Connect with other developers and tech enthusiasts
---
## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Demonstration](#demonstration)

---
## Features
Some core features in SyntaxBase include:
### User
- User registration & authentication
- Exploring tutorials and courses
- Getting help & consultation via email
- Personal homepage with options to view courses/tutorials
- Rate course/tutorial
- Check progress per course/tutorial
- Authenticated users can enroll courses
- Courses provide more features than tutorials
  - more examples
  - more lessons
  - friendly feedback after every lesson
  - in lesson code demonstration and ability to customize code in browser
  - final project after finishing lessons with step-by-step guide
  - quiz after project to confirm knowledge
- Authenticated users have access to community forum
- Authenticated users can post and reply and delete posts in forum
- Authenticated users are notified when somebody replies to their post
- Authenticated users can change personal information
- Authenticated users can apply for instructor role
- After their request is approved they will receive email with confirmation

### Admin

- Approving user requests for instructor role
- managing users
- managing courses
- managing forum

### Instructor
Features will be added soon.

### And many more!

---
# Tech stack


<h3>Frontend</h3>
<ul class="horizontal-list">
    <li>
        <a href="https://www.w3schools.com/css/" target="_blank" rel="noreferrer">
            <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/css3/css3-original-wordmark.svg" alt="css3" width="40" height="40"/>
        </a>
        CSS
    </li>
    <li>
        <a href="https://www.w3.org/html/" target="_blank" rel="noreferrer">
            <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/html5/html5-original-wordmark.svg" alt="html5" width="40" height="40"/>
        </a>
        HTML5
    </li>
    <li>
        <a href="https://reactjs.org/" target="_blank" rel="noreferrer">
            <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original-wordmark.svg" alt="react" width="40" height="40"/>
        </a>
        React
    </li>
  <li>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" height="40" alt="typescript logo"  /> Typescript
  </li>
</ul>

<h3>Backend</h3>
<ul class="horizontal-list">
    <li>
        <a href="https://www.java.com" target="_blank" rel="noreferrer">
            <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/java/java-original.svg" alt="java" width="40" height="40"/>
        </a>
        Java
    </li>
    <li>
        <a href="https://spring.io/" target="_blank" rel="noreferrer">
            <img src="https://www.vectorlogo.zone/logos/springio/springio-icon.svg" alt="spring" width="40" height="40"/>
        </a>
         Spring
    </li>
  <li>
    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tomcat/tomcat-original.svg" height="40" alt="tomcat logo"  /> Tomcat
  </li> 
  <li>
    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" height="40" alt="git logo"  />
  <img width="12" /> Git
  </li>
</ul>
<h3>Database</h3>
  <li>
        <a href="https://www.postgresql.org" target="_blank" rel="noreferrer">
            <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/postgresql/postgresql-original-wordmark.svg" alt="postgresql" width="40" height="40"/>
        </a>
         PostgreSQL
    </li>
<h3>Tools</h3>
<li>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg" height="40" alt="vscode logo"  /> Visual Studio Code
  <img width="12" />
</li>
<li>
     <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/intellij/intellij-original.svg" height="40" alt="intellij logo"  />
  <img width="12" /> Intelij
  </li>

---
## Getting started

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

### Frontend
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/) (npm comes with Node.js)
- A modern web browser (e.g., Chrome, Firefox)

### Backend
- [Java JDK 17+](https://www.java.com/en/)
- [Maven](https://maven.apache.org/) (or Gradle, if your project uses it)
- [Spring Boot](https://spring.io/projects/spring-boot) (handled via Maven/Gradle)

### Database
- [PostgreSQL](https://www.postgresql.org/) (v14+ recommended)
  - Ensure a local or remote instance is running
  - Create a database and user with the proper privileges

### Optional (Recommended for Development)
- [Docker](https://www.docker.com/) (to run PostgreSQL easily)
- [Postman](https://www.postman.com/) for testing APIs
- [pgAdmin](https://www.pgadmin.org/) or another PostgreSQL client for database management

### Environment Setup
Since this is side project .env files must be manually configrued.
Make sure to configure the following:

- `.env` file for frontend (e.g., API base URL)
- `application.properties` or `application.yml` for Spring Boot (DB URL, credentials, etc.)

### Development environment

For development environment VSCode and/or IntelijIDEA is recommended.

- Clone or donwload project
- Open project inside desired development environment
---
## Development Environment

The recommended integrated development environment (IDE) for this project is **IntelliJ IDEA**.

### Project Setup

1. **Clone or download** the repository from your version control system.
2. Open IntelliJ IDEA and navigate to:  
   `File → New → Project from Version Control...`
3. Paste the repository URL and select  
   **"Load Maven build script"** to import the project properly.

#### Screenshots
**Cloning the repository**

<img src="docs/images/clone.png" style="max-width: 100%; height: auto;" alt="cloningRepository">

**Importing the project using Maven**

<img src="docs/images/vc.png" style="max-width: 100%; height: auto;" alt="versionControl">

---
## Frontend setup

To launch the frontend application, follow these steps:

1. Open a terminal window inside **IntelliJ IDEA**/**VSCode** (or use your system terminal).
2. Navigate to the frontend directory:  
   `/SyntaxBase/frontend/src`
3. Install the dependencies:
   ```bash
   npm install
---
4. Start frontend
   ```bash
   npm start
---

#### Screenshots
**Installing dependencies**

<img src="docs/images/install.png" style="max-width: 100%; height: auto;" alt="npminstall">

**Starting frontend**

<img src="docs/images/start.png" style="max-width: 100%; height: auto;" alt="npmstart">

---
## Backend setup

To start the backend application, follow these steps:

1. Ensure that **Java 17** (or higher) is installed.
2. In IntelliJ, navigate to:  
   `SyntaxBase/backend/src/main/java/opp`
3. Locate the `TutorialApplication.java` class.
4. Right-click the file and select **Run** to start the Spring Boot server.

#### Screenshot

*Running the Spring Boot application*

<img src="docs/images/runbackend.png" style="max-width: 100%; height: auto;" alt="npmstart">

---
## Project structure

### Project Structure (High Level) - v1

### Frontend
<details>
<summary><strong>Frontend Structure</strong></summary></details>

```text
src/
├── components/
├── functions/
├── hooks/
├── images/
├── models/
├── pages/
│   ├── databaseCourses/     
│   ├── gameCourses/         
│   ├── problemSolvingCourses/
│   └── webCourses/          
└── styles/
```

### Backend
 <details> <summary><strong>Backend Structure</strong></summary></details>

```text
com/programming.tutorial/
├── config/
├── controller/
├── dao/
├── domain/
├── dto/
├── services/
└── TutorialApplication.java
```
---
## Demonstration
The following images provide a visual overview of some features and interface elements of the application.

### Homepage
<img src="docs/images/homepage.png" style="max-width: 100%; height: auto;" alt="homepage">
<img src="docs/images/homepage2.png" style="max-width: 100%; height: auto;" alt="homepage2">
<img src="docs/images/homepage3.png" style="max-width: 100%; height: auto;" alt="homepage3">

### Courses on homepage

#### Web development course
<img src="docs/images/course1.png" style="max-width: 100%; height: auto;" alt="course1">

#### Game development course
<img src="docs/images/course2.png" style="max-width: 100%; height: auto;" alt="course2">

#### Database managment course
<img src="docs/images/course3.png" style="max-width: 100%; height: auto;" alt="course3">

#### Problem solving course
<img src="docs/images/course4.png" style="max-width: 100%; height: auto;" alt="course4">

#### Instructions and tutorials
<img src="docs/images/course5.png" style="max-width: 100%; height: auto;" alt="course5">

### Tutorial example (initial lesson)

<img src="docs/images/tutorialExample.png" style="max-width: 100%; height: auto;" alt="tutorialExample">
<img src="docs/images/tutorialExample2.png" style="max-width: 100%; height: auto;" alt="tutorialExample2">
<img src="docs/images/tutorialExample3.png" style="max-width: 100%; height: auto;" alt="tutorialExample3">

### Apply to course example

<img src="docs/images/course1Example.png" style="max-width: 100%; height: auto;" alt="course1Example1">
<img src="docs/images/course1Example2.png" style="max-width: 100%; height: auto;" alt="course1Example2>
<img src="docs/images/tutorialExample3.png" style="max-width: 100%; height: auto;" alt="tutorialExample3">

### Course example (initial)

<img src="docs/images/courseExample3.png" style="max-width: 100%; height: auto;" alt="courseExample3">
<img src="docs/images/courseExample4.png" style="max-width: 100%; height: auto;" alt="courseExample4">
<img src="docs/images/finishCourse.png" style="max-width: 100%; height: auto;" alt="finishCourse">

### Auth login

<img src="docs/images/authExample.png" style="max-width: 100%; height: auto;" alt="authExample">


### User homepage

<img src="docs/images/userHomepage.png" style="max-width: 100%; height: auto;" alt="userHomepage">

### User information
<img src="docs/images/accountinfo.png" style="max-width: 100%; height: auto;" alt="accountinfo">
<img src="docs/images/changepersonalinfo.png" style="max-width: 100%; height: auto;" alt="changepersonalinfo">

### Instructor role request
<img src="docs/images/instructorrequest.png" style="max-width: 100%; height: auto;" alt="instructorrequest">