# Overview

EducTrack is a comprehensive school management system designed to enhance communication and collaboration among school administrators, teachers, and parents. The application provides role-based dashboards, student progress tracking, real-time messaging, and event management capabilities. Built as a mobile-first progressive web application (PWA), it focuses on three user types: administrators, teachers, and parents, while students do not have direct access to the system.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript for type safety and component-based architecture
- **Build Tool**: Vite for fast development and optimized production builds
- **Styling**: Tailwind CSS with custom design system using CSS variables for theming
- **UI Components**: Radix UI primitives with shadcn/ui component library for accessible, customizable components
- **State Management**: React Query (TanStack Query) for server state management and caching
- **Routing**: Client-side navigation using React state management (no traditional routing library)

## Backend Architecture
- **Server**: Express.js with TypeScript for API endpoints
- **Development**: Hot module replacement with Vite middleware integration
- **Data Layer**: Abstracted storage interface supporting both in-memory storage (development) and database implementations
- **API Design**: RESTful API structure with `/api` prefix for all backend endpoints

## Authentication & Authorization
- **Method**: OTP (One-Time Password) based authentication via email
- **User Management**: Firebase Authentication for user sessions
- **Role-Based Access**: Three distinct user roles with customized registration:
  - **Admin**: Can register with school setup information, creates teacher accounts
  - **Parent**: Self-registration with parent-specific information and school ID
  - **Teacher**: Cannot self-register; accounts created only by school administrators
- **Session Management**: Firebase session handling with automatic token refresh
- **Registration System**: Java-friendly architecture with role-specific schemas and validation

## Data Architecture
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Schema**: Enhanced user table with role-specific fields:
  - Admin fields: school information, admin title
  - Parent fields: contact info, emergency contacts, relationship to student
  - Teacher fields: subjects, qualifications, employee ID (admin-created only)
- **Real-time Updates**: Firestore for real-time messaging and notifications
- **File Storage**: Local storage abstraction for file uploads and attachments
- **Java Compatibility**: Structured for easy conversion to Java with clear separation of concerns

## Mobile-First Design
- **Progressive Web App**: Full PWA support with service worker, manifest, and offline capabilities
- **Responsive Design**: Mobile-first approach with touch-optimized interfaces
- **Navigation**: Bottom navigation pattern optimized for mobile usage
- **Performance**: Lazy loading, code splitting, and optimized asset delivery

# External Dependencies

## Core Technologies
- **Database**: Neon Database (PostgreSQL) as the primary data store
- **ORM**: Drizzle ORM for database schema management and type-safe queries
- **Authentication**: Firebase Authentication for user management and session handling
- **Real-time Data**: Firestore for messaging and live updates

## Communication Services
- **Email Service**: EmailJS for OTP delivery and notification emails
- **Messaging**: Custom real-time messaging system built on Firestore

## Development & Deployment
- **Build System**: Vite for development server and production builds
- **Package Manager**: npm with lockfile for dependency consistency  
- **Code Quality**: TypeScript for static type checking
- **Asset Optimization**: Automated image optimization and lazy loading

## UI & Styling
- **Design System**: Custom theme based on shadcn/ui with Tailwind CSS
- **Icons**: Material Icons for consistent iconography
- **Fonts**: Inter font family via Google Fonts
- **Components**: Radix UI for accessible component primitives

## Storage & Caching
- **Browser Storage**: LocalStorage for offline file management and user preferences
- **Query Caching**: React Query for intelligent data fetching and caching
- **Service Worker**: Custom service worker for offline functionality and asset caching