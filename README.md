# Fullstack Oracle + Quarkus + React

A container-based fullstack application built with Oracle Database, Quarkus, and React.  
The project follows a clean separation of responsibilities between database, backend, and frontend layers, using Docker for consistent local development and deployment.

For complete technical documentation, architectural decisions, and detailed specifications, please refer to the files inside the `/docs` directory.

---

# Overview

This project demonstrates a modern fullstack architecture using:

- Oracle Database running in Docker
- Quarkus REST API (Java 21)
- React frontend with Redux state management
- Tailwind CSS for styling
- Bun as the frontend package manager
- Cypress for end-to-end testing
- Docker Compose for infrastructure orchestration

Each service runs in an isolated container and communicates through Docker networking.

---

# Tech Stack

- Database: Oracle XE (Docker)
- Backend: Java 21 + Quarkus
- Frontend: React + Redux + Tailwind (Bun)
- Unit Testing: Vitest
- E2E Testing: Cypress
- Infrastructure: Docker + Docker Compose
- Database Client: Beekeeper Studio

---

# Repository Structure

backend/        # Quarkus REST API  
frontend/       # React + Redux + Tailwind (Bun)  
infra/          # Docker configuration, docker-compose, scripts  
docs/           # Technical documentation and architecture decisions  

---

# Host Requirements

- Docker >= 29
- Docker Compose plugin
- Java 21 (JDK)
- Bun >= 1.3
- Git

Optional:
- Beekeeper Studio (or any SQL client) for database inspection

---

# Architecture

The system is composed of three main services:

1. Oracle Database  
   - Runs in a container  
   - Persists data using a Docker volume  

2. Backend (Quarkus API)  
   - Connects to Oracle via JDBC  
   - Exposes REST endpoints  
   - Runs on port 8080  

3. Frontend (React + Redux)  
   - Consumes backend REST API  
   - Served via Nginx inside a container  
   - Exposed on port 3000  

All services communicate through Docker internal networking.

---

# Start the Environment

From the project root (where docker-compose.yml is located):

docker compose up -d --build

Verify services:

docker compose ps

Access the application:

Frontend:
http://localhost:3000

Backend:
http://localhost:8080

Oracle:
localhost:1521

---

# Stop the Environment

docker compose down

To remove database volume and reset everything:

docker compose down -v

---

# Running Tests

## Unit Tests (Frontend - Vitest)

Navigate to the frontend directory:

cd frontend

Run tests once:

bun run test:run

Run in watch mode:

bun run test:watch

Important:
- Do not use bun test.
- Use the Vitest scripts defined in package.json.

---

## End-to-End Tests (Cypress)

Make sure the application stack is running:

docker compose up -d

Then navigate to the frontend directory:

cd frontend

Open Cypress UI:

bunx cypress open

Run headless:

bunx cypress run

Cypress baseUrl must be configured as:

http://localhost:3000

---

# Planned Ports

| Service   | Port |
| ----------|------|
| Oracle    | 1521 |
| Backend   | 8080 |
| Frontend  | 3000 |

---

# Environments

Development:
- Containers with mounted volumes
- Suitable for local iteration

Production:
- Prebuilt images
- No hot reload
- Optimized static frontend build

---

# Conventions

Backend:
- Follows Quarkus conventions
- Clean architecture separation (DTO, Entity, Service, Controller)

Frontend:
- Uses Bun (no npm)
- Redux for state management
- Tailwind for styling
- Component-based architecture

Infrastructure:
- Each service runs in its own container
- Services communicate via Docker networking
- Environment variables define cross-service configuration

---

# Documentation

For complete documentation, architectural decisions, API contracts, and design explanations, refer to the `/docs` directory.

The `/docs` folder contains the full technical reference for this project.