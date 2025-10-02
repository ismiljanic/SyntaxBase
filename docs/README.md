# SyntaxBase Documentation

![GitHub last commit](https://img.shields.io/github/last-commit/ismiljanic/SyntaxBase)
![License](https://img.shields.io/github/license/ismiljanic/SyntaxBase)

## Overview

This is extended documentation for **SyntaxBase**.  
This section provides an overview of the project’s goals, architecture and implementation details.  
While the [root README](../README.md) gives a quick overview and setup guide, [here](./DOCS.md) you’ll find full technical docs,
diagrams and design decisions.

---

## Documentation Index

### [Project Overview](./PROJECT_OVERVIEW.md)

Explains what SyntaxBase is and the **problem it solves**: creating a scalable learning and collaboration platform with
modern backend and frontend practices.  
Covers the **core goals** (real-time interaction, modularity, reliability), summarizes the **main features** (user
management, chat, notifications, content sharing, etc.) and defines the **intended audience** (students, teachers,
developers).

---

### [Tech Stack](./TECH_STACK.md)

Detailed overview of all technologies used and **why they were chosen**:

- **Spring Boot** → reliable backend framework with dependency injection and REST support.
- **React** → dynamic, component-based frontend for rich UIs.
- **PostgreSQL** → robust relational DB with strong consistency guarantees.
- **Kafka** → event streaming for async communication between services.
- **WebSockets** → real-time notifications and chat.
- **Docker** → consistent containerized deployments.  
  This section demonstrates the architectural trade-offs and reasoning behind stack decisions.

---

### [Architecture](./ARCHITECTURE.md)

Presents a **high-level system design** with diagrams showing interactions between frontend, backend, Kafka, database,
and WebSocket channels.  
Breaks down:

- **Microservices** → responsibilities and separation.
- **Backend layers** → controllers, services, repositories, DTOs, validation.
- **Frontend structure** → routing, components, state management.
- **Communication flows** → REST for CRUD, Kafka for events, WebSockets for push notifications and chat.

---

### [Database](./DATABASE.md)

Contains the **ERD diagram** showing tables and relationships.  
Explains the **main entities** (users, messages, notifications, posts, etc.), how they connect and why they’re modeled
that way.

---

### [Usage Guide](./USAGE.MD)

Step-by-step instructions on **how to run the application**:

- Running with Docker (production-style setup).
- Running locally (for development).
- Required environment variables and sample `.env` file.
- Walkthrough of **core features** with screenshots: registration, login, messaging, notifications, content browsing.

---

### [Testing](./TESTING.md)

Overview of the **testing strategy**:

- Unit tests for business logic.
- Integration tests for service/database boundaries.
- Instructions to run tests (`mvn test`).  
  If coverage reports are available, explains how to generate them and includes a badge or percentage.

---

### [Future Work](./FUTURE_WORK.md)

Lists **planned improvements** and **possible extensions**:

- Scaling out Kafka topics for higher throughput.
- Additional microservices.
- Advanced monitoring/logging.
- UX/UI enhancements.  
  Also highlights **lessons learned** during development and what could be done differently in the next iteration.
- Finishing rest of the courses and lessons

---

### [Docs](./DOCS.md)

Full documentation available for SyntaxBase application.

---

## About This Documentation

- This documentation was created for everyone interested in understanding the technical aspects of SyntaxBase
  application. Purpose was to showcase the project’s architecture, demonstrate professional engineering practices and
  provide a usage manual. Each topic lives in its own file for clarity. This README serves as the entrypoint and table
  of contents.

---