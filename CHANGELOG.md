# Changelog

All notable changes to this project will be documented in this file

---

## [2.2.0] - 2025-09-27

This release introduces a fully-featured real-time chat system, allowing users to share experiences, ask each other for help, or casually chat with each other.

Alongside this feature, the platform has been refined with new **UI/UX improvements, bug fixes, and performance optimizations**.

---

### Added
- Live messaging via chat
  - Messages sorted chronologically
  - Option to delete messages
  - Reply feature for chat messages
  - Edit feature for chat messages
  - Option to remove users from contact list
- User Profile Page enhancements
  - View personal profile and profiles of other users
  - Display available certificates
  - Badge awards for course completion and forum activity

---

### Improvements
- Enhanced chat UI for better user experience
- Contact sidebar displays last non-deleted message with each contact
- Improved certificate generation and storage process
- Restricted certificate access to authenticated users only
- Further functionality optimizations across the platform
- Minor UI tweaks for better **usability and consistency**
- Error logging for Kafka and WebSocket connections
- Updated `FEATURES_OVERVIEW.md` and `README.md`

---

### Fixed
- Message sending and receiving bugs in chat
- Import issues and TypeScript configuration in frontend
- Docker/PostgreSQL issues, including `spring.jpa.hibernate.ddl-auto=update`
- CORS preflight and frontend fetch errors

---

### Other
- Added jUnit tests for backend and microservices
- Included final project submodule changes for Advanced Web Course
- Removed sensitive and unnecessary information

---

## Release Links
- [Changelog](https://github.com/ismiljanic/SyntaxBase/blob/main/CHANGELOG.md)
- [v2.2.0 Tag](https://github.com/ismiljanic/SyntaxBase/tree/v2.2.0)
- [Compare with v2.1.0](https://github.com/ismiljanic/SyntaxBase/compare/v2.1.0...v2.2.0)


[2.2.0]: https://github.com/ismiljanic/SyntaxBase/tree/v2.2.0

---

## [2.1.0] - 2025-08-16

### Added
- Added complete Intermediate Web Development course with:
    - Showcase examples for some lessons
    - Final project (Auth Ticketing App)
    - Full tutorial as separate objective
- Added complete Advanced Web Development course with:
    - Showcase examples for some lessons
    - Final project (Full-Stack Blood Donation App)
    - Full tutorial as separate objective

### Changed
- Enhanced general UI/UX of the application 
- Improved further overall functionality of the application
- Changed CHANGELOG.md to reflect newest updates and release
- Minor UI enhancements across the platform for improved usability and consistency

### Fixed
- Fixed enrollment issues for some users when joining courses
- Fixed lesson navigation inconsistencies
- Optimized some database queries for better performance

---

[2.1.0]: https://github.com/ismiljanic/SyntaxBase/tree/v2.1.0

## [2.0.0] - 2025-08-05

### Added
- CI/CD workflows via GitHub Actions for Maven builds and Docker image publishing
- Microservice for real-time notifications using Kafka and WebSocket
- Frontend support for live notifications with unread/read tracking
- Email notifications for unread messages
- Reporting system for forum posts and replies that violate community guidelines
- Post/reply edit and delete functionality
- Date created/modified timestamps displayed on forum posts and replies
- Admin dashboard features: top-rated courses, completion metrics and user reports dashboard
- Docker support for all services, including the new notification microservice

### Changed
- Enhanced UI/UX of the forum module
- Updated admin panel with improved capabilities and metrics display
- Improved `README.md` and `FEATURES_OVERVIEW.md` with clearer documentation
- Minor UI enhancements across the platform for improved usability and consistency

### Fixed
- Maven build failure in notification microservice due to Java version misconfiguration
- UI bug where notifications failed to render correctly
- Forums now correctly display username and role for each post
- Admins no longer see deleted posts as active content
- Deleted forum posts now handled properly across all views

---

[2.0.0]: https://github.com/ismiljanic/SyntaxBase/tree/v2.0.0

## [1.0.0] - 2025-07-21

### Added
- Initial core functionality including user registration, course enrollment, and progress tracking
- Docker support for local development environment
- UI components for course listing, rating, and progress visualization
- Role-based activity, including instructor role and ability to create courses
- Three-tier subscription model integrated with Stripe payment processing
- Five course sections, each with three different experience levels
- Free tutorials available for each course
- Final quiz and assessment following the final project of each course
- Secure authentication with Auth0 support
- Secure session management using JWT refresh and access tokens

### Changed
- Improved user interface for course management
- Added this `CHANGELOG.md` file
- Enhanced administrative functionalities

### Fixed
- Fixed database connectivity issues within the Docker environment

---

[1.0.0]: https://github.com/ismiljanic/SyntaxBase/tree/v1.0.0