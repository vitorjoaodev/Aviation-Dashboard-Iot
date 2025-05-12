Aviation Dashboard IOT

A modern, full-stack web application built with TypeScript, Express, Vite, and React, designed to deliver fast and scalable RESTful services with a clean and responsive UI.

🚀 Tech Stack
Backend
Express – Lightweight web framework for building APIs

TypeScript – Type-safe JavaScript for improved development

Drizzle ORM – Modern SQL ORM for TypeScript

Neon (Serverless PostgreSQL) – Cloud-native database

Express Session – Session management for authentication

Passport.js – Authentication middleware (with local strategy)

WebSockets (ws) – Real-time communication

connect-pg-simple – Store sessions in PostgreSQL

memorystore – Fallback session store

Frontend
React 18

Vite – Lightning-fast dev server and bundler

Tailwind CSS + tailwindcss-animate + tw-animate-css

ShadCN (Radix UI) – Accessible and themeable component library

Framer Motion – Smooth and expressive animations

React Hook Form + Zod – Form handling with validation

TanStack Query (React Query) – Data fetching and caching

Recharts – Beautiful charts and data visualizations

Embla Carousel – Lightweight carousel

Lucide Icons – Customizable and consistent icons

Next Themes – Theme switching with Tailwind support

Wouter – Minimalist routing for React

Dev Tools
Vite + tsx – Fast local development

Drizzle Kit – Migrations and schema generation

ESBuild – Fast bundling for production

TypeScript, PostCSS, Autoprefixer

@replit plugins – Enhanced DX on Replit

📂 Project Structure
bash
Copiar
Editar
/server      → Express server code (TS)
/client      → React frontend (via Vite)
/db          → Drizzle ORM schema and config
📦 Scripts
Command	Description
npm run dev	Starts the app in development mode
npm run build	Builds the app for production
npm start	Runs the compiled app in production
npm run check	Type-check with TypeScript
npm run db:push	Pushes schema to the database

🔒 Authentication
Local username/password strategy using Passport.js

Session stored in PostgreSQL or MemoryStore

Protected routes and user management

🌐 Deployment Ready
Optimized build with vite + esbuild

Server and client code bundled separately

Modular and maintainable structure

📝 License
MIT

