# GRU IOT - Aviation Safety Dashboard

A responsive IoT dashboard for aviation safety operations at Guarulhos Airport that monitors runway conditions, weather, equipment status, and incidents in real-time.

## Features

- Real-time monitoring of runway conditions
- Weather monitoring system with alerts for adverse conditions
- Equipment status tracking and maintenance scheduling
- Incident management and historical analysis
- Visual analytics and performance metrics
- Flight radar integration
- Critical alerts with sound notifications
- Dark/Light theme support
- Responsive design for desktop and mobile

## Technology Stack

- **Frontend**: React, TypeScript, TailwindCSS, shadcn/ui components
- **Backend**: Node.js, Express
- **Real-time updates**: WebSocket
- **Visualization**: Recharts
- **State Management**: React Context API
- **Routing**: Wouter
- **TypeSafety**: Zod, TypeScript
- **Containerization**: Docker
- **Package Management**: npm

## Running the Application

### Using Docker

1. Make sure you have Docker and Docker Compose installed

2. Build and run the application:

```bash
docker-compose up --build
```

3. Access the application at http://localhost:5000

### Development Mode

1. Clone the repository

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Access the application at http://localhost:5000

## Project Structure

- `client/` - Frontend React application
- `server/` - Backend Express server
- `shared/` - Shared types and schemas
- `public/` - Static assets

## Credits

Developed by João Vitor Belasque

- [GitHub](https://github.com/joaobelasque) 
- [LinkedIn](https://www.linkedin.com/in/joaobelasque)