# Lunix Web Desktop Environment

## Overview

This is a web-based desktop environment simulation inspired by Linux Mint. It provides a complete desktop experience in the browser with draggable windows, a taskbar, customizable settings, and multiple built-in applications like Terminal, File Manager, Browser, Calculator, and a custom App Maker.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript, using Vite as the build tool
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: Zustand for window manager state, TanStack React Query for server state
- **UI Components**: shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming (Mint-inspired color palette)
- **Animations**: Framer Motion for window animations, react-draggable for draggable windows

### Backend Architecture
- **Server**: Express.js running on Node.js with TypeScript
- **API Pattern**: RESTful endpoints defined in shared/routes.ts with Zod validation
- **File Uploads**: Multer for handling wallpaper/media uploads to local `uploads/` directory

### Data Storage
- **Database**: PostgreSQL with Drizzle ORM
- **Schema Location**: `shared/schema.ts` contains all table definitions
- **Tables**:
  - `settings`: Stores user preferences (wallpaper, theme color, cursor style, dark mode, taskbar position)
  - `customApps`: Stores user-created applications with name, icon, content (HTML), and config

### Key Design Patterns
- **Shared Code**: The `shared/` directory contains code used by both client and server (schema, routes, types)
- **Path Aliases**: `@/` maps to client/src, `@shared/` maps to shared/
- **Window Management**: Centralized Zustand store handles window lifecycle (open, close, minimize, maximize, focus, z-index)
- **Component Architecture**: Apps are self-contained components in `client/src/components/apps/`, using an `AppTemplate` wrapper for consistent styling

### Build System
- **Development**: Vite dev server with HMR, proxied through Express
- **Production**: Vite builds client to `dist/public`, esbuild bundles server to `dist/index.cjs`
- **Database Migrations**: Drizzle Kit with `db:push` command for schema synchronization

## External Dependencies

### Database
- **PostgreSQL**: Primary database, connection via `DATABASE_URL` environment variable
- **Drizzle ORM**: Type-safe database queries with automatic schema inference

### UI Libraries
- **Radix UI**: Headless component primitives for accessibility
- **shadcn/ui**: Pre-styled component collection (new-york style variant)
- **Lucide React**: Icon library used throughout the application

### Core Libraries
- **TanStack React Query**: Server state management and caching
- **Zustand**: Client-side state management for window system
- **Zod**: Schema validation for API inputs and responses
- **date-fns**: Date formatting for system clock display

### Build Tools
- **Vite**: Frontend bundler with React plugin
- **esbuild**: Server bundler for production builds
- **TypeScript**: Full type safety across client, server, and shared code