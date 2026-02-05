# Fullstack Oracle + Quarkus + React

Fullstack project using a container-based architecture, with clear separation
between database, backend, and frontend responsibilities.

## Tech Stack
- Database: Oracle (Docker)
- Backend: Java + Quarkus
- Frontend: React + Redux + Tailwind (Bun)
- E2E Tests: Cypress
- Infrastructure: Docker + Docker Compose
- DB Client: Beekeeper Studio

## Repository Structure
backend/ # Quarkus API
frontend/ # React + Redux + Tailwind
infra/ # Docker, docker-compose, scripts
docs/ # Technical documentation and decisions


## Host Requirements
- Docker >= 29
- Docker Compose plugin
- Java 21 (JDK)
- Bun >= 1.3
- Git

## Start environment (when available)
```bash
docker compose up -d

## Planned Ports
| Service  | Port |
| -------- | ---- |
| Oracle   | 1521 |
| Backend  | 8080 |
| Frontend | 3000 |

## Environments

- Development: containers with mounted volumes

- Production: prebuilt images (no hot reload)

## Conventions

Backend follows Quarkus conventions

Frontend uses Bun (no npm)

Each service runs in an isolated container

Services communicate through Docker networking
