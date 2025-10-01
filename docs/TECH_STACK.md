# Tech Stack – SyntaxBase

This document provides a detailed overview of the technologies used in **SyntaxBase**, along with reasoning for each choice. The stack was selected to demonstrate good engineering practices, event-driven architectures, real-time communication, and full-stack integration.

---

## Backend

- **Spring Boot**  
  Reliable and widely used Java framework for building RESTful APIs and microservices. Provides dependency injection, security integration, and modular structure. Ideal for demonstrating layered architecture (controllers, services, repositories).

- **Kafka**  
  Event streaming platform used for asynchronous communication between microservices. Enables decoupling of services and supports real-time notifications. Demonstrates event-driven architecture principles.

- **WebSockets**  
  Provides real-time bi-directional communication between server and client. Used for chat and live notifications, enhancing interactivity.

- **PostgreSQL**  
  Relational database with strong consistency guarantees. Stores structured data for users, messages, notifications, courses, and forum content. Chosen for reliability and compatibility with Spring Data JPA.

---

## Frontend

- **React**  
  Component-based JavaScript library for building dynamic and responsive user interfaces. Enables modular UI development and state management, making it easier to maintain and extend.

---

## DevOps / Deployment

- **Docker**  
  Containerization platform used to package backend services, frontend, database and microservice components. Ensures consistent environments for development, testing, and deployment.

- **GitHub Actions**  
  CI/CD workflow used to automatically build and test the application on every commit. Ensures code quality, and maintains reproducible builds.

---

## Testing

- **JUnit**  
  Unit testing framework for Java backend services. Used to validate business logic and service layer functionality.

- **Mockito**  
  Mocking framework for Java, used in conjunction with JUnit to isolate units during testing.

---

## Communication & Architecture

- **REST APIs**  
  Used for communication between frontend and backend services, providing CRUD operations and structured data exchange.

- **Kafka Topics**  
  Channels for asynchronous event messaging, such as notifications or chat events, decoupling service interactions.

- **WebSocket Channels**  
  Real-time push updates for chat and notifications, enabling instant user feedback.

---

## Additional Tools

- **Maven**  
  Java build and dependency management tool, used to manage Spring Boot backend modules.

- **Node.js / npm**  
  Frontend package management and build system for React.

- **Visual Studio Code / IntelliJ IDEA**  
  IDEs used for frontend and backend development.

- **Git**  
  Version control system used for source code management, branching, and committing changes to GitHub. Enables collaboration and keeps project history organized.

- **Postman**  
  API testing and exploration tool used to test REST endpoints, validate responses, and catch bugs during development.

- **curl**  
  Command-line tool for testing and interacting with backend services and REST APIs directly, useful for quick verification of endpoints.

- **pgAdmin4**  
  PostgreSQL administration tool used to manage, query, and visualize the database schema and data.

---

### Why This Stack?

The stack was chosen to demonstrate modern, full-stack development practices while supporting the architectural goals of SyntaxBase.

- **Spring Boot** and **PostgreSQL** provide a reliable backend foundation with clear separation of concerns and support for data consistency.
- **React** enables a dynamic, modular frontend with reusable components and maintainable state management.
- **Kafka** and **WebSockets** allow real-time communication and event-driven design between microservices.
- **Docker** ensures consistent environments across development, testing, and deployment.

This combination of technologies allows the project to showcase **modular and maintainable engineering practices** while also providing a platform to learn and experiment with new technologies.

---

