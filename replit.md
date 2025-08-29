# Yemen Jobs Application

## Overview

Yemen Jobs is a bilingual (Arabic/English) job board application built with a modern full-stack architecture. The platform serves both job seekers and employers, providing a comprehensive job search and posting solution tailored for the Yemeni market. The application features a React frontend with TypeScript, Express.js backend, and PostgreSQL database integration through Drizzle ORM.

The application is currently in a partial state with core infrastructure completed. It includes home pages, job listings, company profiles, and basic posting functionality. The project is designed to integrate with an existing Supabase deployment while maintaining the current architecture for local development.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The frontend is built using React 18 with TypeScript, utilizing Vite as the build tool for fast development and optimized production builds. The UI layer implements shadcn/ui components built on top of Radix UI primitives, providing accessible and customizable interface elements.

**Key Frontend Decisions:**
- **React Router Alternative**: Uses Wouter for lightweight client-side routing, chosen for its minimal bundle size and simple API
- **State Management**: Combines React Query (TanStack Query) for server state management with React's built-in state for local UI state
- **Styling System**: Tailwind CSS with CSS variables for theming, supporting both light/dark modes and RTL/LTR layouts for Arabic content
- **Internationalization**: Custom language provider supporting Arabic and English with automatic RTL layout switching
- **Form Handling**: React Hook Form with Zod validation for type-safe form management

### Backend Architecture
The backend follows a RESTful API design built on Express.js with TypeScript. The server implements a clean separation between routing, business logic, and data access layers.

**Key Backend Decisions:**
- **Development Setup**: Custom Vite integration for seamless full-stack development experience
- **API Design**: RESTful endpoints with consistent JSON responses and proper HTTP status codes
- **Error Handling**: Centralized error handling middleware with structured error responses
- **Request Logging**: Custom middleware for API request logging with response time tracking

### Data Storage Solutions
The application uses a dual-storage approach to support both development and production environments.

**Database Architecture:**
- **Production**: PostgreSQL with Neon Database for cloud deployment
- **Development**: In-memory storage implementation for rapid local development
- **ORM Layer**: Drizzle ORM chosen for type-safe database operations and excellent TypeScript integration
- **Schema Management**: Centralized schema definitions with Zod validation for runtime type checking

**Schema Design:**
- Users table with role-based access (job_seeker/employer)
- Companies table linked to employer users
- Jobs table with comprehensive job details and company relationships
- Applications table tracking job application workflow

### Authentication and Authorization
The current architecture includes placeholders for authentication but doesn't implement a full auth system yet. The design anticipates integration with external auth providers.

**Planned Auth Approach:**
- Session-based authentication with PostgreSQL session storage
- Role-based access control (job seekers vs employers)
- Integration points prepared for Supabase Auth migration

### External Dependencies

**Core Framework Dependencies:**
- **React Ecosystem**: React 18, React DOM, React Hook Form for modern React development
- **Routing**: Wouter for lightweight client-side routing
- **HTTP Client**: Native fetch API with custom request wrapper for API communication

**UI and Styling:**
- **Component Library**: Radix UI primitives for accessible base components
- **Styling**: Tailwind CSS for utility-first styling approach
- **Icons**: Lucide React for consistent iconography
- **Fonts**: Google Fonts integration (Inter, Noto Sans Arabic)

**Database and Validation:**
- **Database**: Neon Database (PostgreSQL) for production data storage
- **ORM**: Drizzle ORM for type-safe database operations
- **Validation**: Zod for runtime type validation and schema definition
- **Session Storage**: connect-pg-simple for PostgreSQL session management

**Development Tools:**
- **Build Tool**: Vite for fast development and optimized builds
- **TypeScript**: Full TypeScript support across frontend and backend
- **Development Enhancement**: Replit-specific plugins for development environment integration

**Date and Utility Libraries:**
- **Date Handling**: date-fns for date manipulation and formatting
- **Utility**: clsx and class-variance-authority for conditional CSS classes
- **Carousel**: Embla Carousel for interactive content display

The architecture is designed to be modular and scalable, with clear separation of concerns and the flexibility to migrate to different deployment targets while maintaining development efficiency.