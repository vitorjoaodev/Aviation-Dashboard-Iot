# ✈️ Aviation Dashboard IoT

A full-stack web application designed to **monitor and mitigate operational risks** at **Guarulhos International Airport (GRU), Brazil**, through real-time data visualization and control powered by IoT integrations.

This project aims to provide actionable insights to aviation professionals by connecting backend services, sensor data, and a dynamic interface in one modern dashboard solution.

---

## 🚀 Tech Stack

### Backend
- **Express** – Fast, unopinionated web server
- **TypeScript** – Strongly typed JavaScript
- **Drizzle ORM** – Type-safe SQL layer
- **Neon (PostgreSQL)** – Serverless relational database
- **Express Session** – Robust session handling
- **Passport.js** – Authentication (Local Strategy)
- **WebSockets (`ws`)** – Real-time updates
- **connect-pg-simple** / **memorystore** – Session stores

### Frontend
- **React 18**
- **Vite** – Lightning-fast bundler and dev server
- **Tailwind CSS** with **tailwindcss-animate** and **tw-animate-css**
- **Radix UI + ShadCN** – Beautiful, accessible UI components
- **Framer Motion** – Seamless animations
- **React Hook Form + Zod** – Form validation and error handling
- **TanStack Query (React Query)** – Powerful data synchronization
- **Recharts** – Advanced charting and data visualization
- **Lucide Icons**, **Embla Carousel**, **Wouter**, **Next Themes**

### Developer Tools
- **tsx + vite** – Fast builds and reloads
- **Drizzle Kit** – Schema & migrations
- **esbuild** – Production-grade bundling
- **TypeScript**, **PostCSS**, **Autoprefixer**
- **@replit plugins** – Optional: runtime error modal, cartographer

---

## 📂 Project Structure

/server → Express backend (IoT and REST endpoints)
/client → Vite-powered React frontend
/db → Drizzle ORM config and schema

yaml
Copiar
Editar

---

## 📦 Scripts

| Script            | Description                                |
|-------------------|--------------------------------------------|
| `npm run dev`     | Launch app in development mode             |
| `npm run build`   | Build frontend and bundle backend          |
| `npm start`       | Run the production-ready app               |
| `npm run check`   | Type check with TypeScript                 |
| `npm run db:push` | Push database schema with Drizzle Kit      |

---

## 🔐 Authentication & Sessions

- Secure user authentication with **Passport.js**
- Sessions stored via **PostgreSQL** or **in-memory**
- Designed to support scalable multi-user environments

---

## 🌐 Purpose & Context

This platform was developed as part of a security and monitoring initiative to **enhance aviation safety operations** through the **integration of real-time IoT systems**, aiming to mitigate runway incursions, unauthorized access, equipment failure, and other risk factors at **Guarulhos International Airport (SBGR)**.

---

## 🛠️ Features

- IoT data visualization for runway and terminal monitoring  
- Real-time WebSocket updates  
- Role-based user access and authentication  
- Custom charts and analytics  
- Responsive, accessible UI  
- Modular and production-ready codebase  

---

## 👨‍💻 Developed by

**João Vitor Belasque**

- 🌐 [LinkedIn](https://www.linkedin.com/in/joaovitorfullstack/)  
- 💻 [GitHub](https://github.com/vitorjoaodev)

---

## 📝 License

MIT