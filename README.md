# Smart Clinic — Scheduling System (Vue + Node)

Smart Clinic is a web application designed for small medical clinics to manage appointment scheduling securely, with integrations for address lookup (ViaCEP) and weather forecast alerts (Open-Meteo).

## Features

- Secure authentication with JWT
- Roles:
  - **PATIENT**: can create and view their own appointments
  - **SECRETARY**: can manage clinic appointments (list, confirm, cancel)
  - **ADMIN** (optional): same access as secretary (kept for extensibility)
- Appointment scheduling with time-slot validation and conflict prevention (HTTP 409)
- Address auto-fill using **ViaCEP** by CEP
- Weather integration to flag rain alerts for appointment day
- Automated integration tests with isolated MongoDB test database

## Tech Stack

- Backend: Node.js, Express, TypeScript, MongoDB Atlas, JWT
- Frontend: Vue.js (to be added / in progress)
- Hosting: Render (backend)

## Live Backend

Base URL:

- https://smart-clinic-pv7c.onrender.com

Health check:

- `GET /health`

## Repository Structure

- `backend/` → API server and business logic
- `backend/docs/API.md` → endpoints documentation

## Quick Start (Backend)

See: `backend/README.md`

## License

Academic project / educational use.
