# Testing – SyntaxBase

This document provides an overview of the **testing strategy** used in **SyntaxBase**, including types of tests, how to run them and coverage information.


## Types of Tests

SyntaxBase employs multiple layers of automated testing to ensure code quality, reliability and maintainability:

### 1. Unit Tests
- Focus on **individual components** or classes in isolation.
- Test **business logic** in backend services (Spring Boot)
- Examples:
  - Backend: validating service methods (e.g., calculating lesson progress, notification generation).

### 2. Integration Tests
- Verify **interaction between components**, services and external systems.
- Examples:
  - Backend: REST endpoints interacting with PostgreSQL using Spring Boot test context.
  - Kafka consumers and producers tested to ensure events propagate correctly.
  - WebSocket connections verified for real-time notifications.

### 3. Optional / Planned Tests
- End-to-end (E2E) testing is planned for future iterations using tools like **Cypress** or **Selenium**.

---

## Running Tests

### Backend (Spring Boot)

Navigate to /backend folder

Run all unit and integration tests using Maven:

```bash
mvn clean test
```
Test reports are generated in target/surefire-reports.

### To run a single test class:

```bash
mvn -Dtest=UserServiceTest test
```

### Microservice-chat (Spring Boot)

Navigate to /microservice-chat folder

Run all unit and integration tests using Maven:

```bash
mvn clean test
```
Test reports are generated in target/surefire-reports.

### To run a single test class:

```bash
mvn -Dtest=UserServiceTest test
```

### Microservice-notifications (Spring Boot)

Navigate to /microservice-notifications folder

Run all unit and integration tests using Maven:

```bash
mvn clean test
```
Test reports are generated in target/surefire-reports.

### To run a single test class:

```bash
mvn -Dtest=UserServiceTest test
```

## Test Coverage

### Backend (Spring Boot)

Coverage reports are generated via **JaCoCo** Maven plugin.

**Latest coverage metrics (2.10.2025.):**

| Metric    | Coverage |
|-----------|----------|
| Lines     | 94%      |
| Branches  | 82%      |
| Functions | 82%      |


> **Note:** Coverage percentages are indicative; they reflect the current test quality and can be updated after running tests.

---

## Summary

- **Unit tests** validate individual functions, methods and components in isolation.  
- **Integration tests** confirm that services, databases, Kafka topics and WebSockets interact correctly.  
- **Automated testing** ensures reliability, maintainability and consistent behavior across both backend and frontend.  
- **Coverage badges** provide quick visual insight evaluating project quality.  