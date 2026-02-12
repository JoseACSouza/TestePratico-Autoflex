# Running Tests (Unit and End-to-End)

This document explains how to run both unit tests and end-to-end (E2E) tests in the AutoFlex project.

The project uses:

- Docker Compose for Database, Backend, and Frontend
- Vitest for unit testing
- Cypress for end-to-end testing
- Bun as the package manager

---

## Prerequisites

- Docker installed
- Docker Compose installed
- Bun installed locally
- The project cloned locally

---

# 1. Start the Application Stack

From the project root (where docker-compose.yml is located):

docker compose up -d --build

Verify containers are running:

docker compose ps

Access the application in the browser:

Frontend:
http://localhost:3000

Backend:
http://localhost:8080

---

# 2. Running Unit Tests (Vitest)

Unit tests are located in the frontend project and use Vitest with jsdom.

Navigate to the frontend directory:

cd frontend

Run tests once:

bun run test:run

Run in watch mode:

bun run test:watch

Important:

- Do NOT use bun test
- Always use the Vitest scripts defined in package.json

---

# 3. Running End-to-End Tests (Cypress)

E2E tests require the application to be running.

Make sure Docker containers are up before running Cypress.

Navigate to the frontend directory:

cd frontend

Open Cypress UI:

bunx cypress open

Run Cypress in headless mode:

bunx cypress run

Cypress must be configured with:

baseUrl: http://localhost:3000

---

# 4. Resetting the Database

The Oracle database uses a Docker volume and persists data.

To reset everything:

docker compose down -v
docker compose up -d --build

---

# 5. Useful Commands

Stop containers:

docker compose down

View logs:

docker compose logs -f frontend
docker compose logs -f backend
docker compose logs -f oracle-db

Run unit tests and E2E tests sequentially:

cd frontend
bun run test:run
bunx cypress run
