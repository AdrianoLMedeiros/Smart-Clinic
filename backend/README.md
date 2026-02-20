# Smart Clinic Backend

Backend API for Smart Clinic — a medical appointment scheduling system built with Node.js, Express and TypeScript.

This backend provides authentication, appointment management, address lookup via CEP (Brazil Only), weather integration and role-based access control.

---

## 1. Overview

Smart Clinic enables small clinics to:

- Register and authenticate users securely (JWT)
- Support role-based access control (PATIENT, SECRETARY, ADMIN)
- Schedule appointments with time-slot conflict validation
- Automatically populate address from CEP (ViaCEP API)
- Generate rain alerts based on weather forecast (Open-Meteo API)
- Provide an administrative panel for appointment management

---

## 2. Tech Stack

- Node.js
- Express
- TypeScript
- MongoDB Atlas
- Mongoose
- JWT (JSON Web Tokens)
- Zod (validation)
- Axios (external API calls)
- Jest + Supertest (integration testing)
- Render (deployment)

---

## 3. User Roles

### PATIENT

- Register and login
- Create appointments
- View their own appointments

### SECRETARY

- View all appointments
- Filter by date or status
- Confirm or cancel appointments

### ADMIN (optional / extensibility)

- Same permissions as SECRETARY
- Reserved for future system-level controls

---

## 4. Project Structure

```
backend/
│
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── tests/
│   └── utils/
│
├── docs/
│   ├── API.md
│   └── DEPLOY.md
│
├── package.json
├── tsconfig.json
├── .env
└── .env.test
```

---

## 5. Local Setup

### 5.1. Install dependencies

```bash
cd backend
npm install
```

---

### 5.2. Environment Variables

Create a `.env` file inside `backend/`:

```env
PORT=3000
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>/<database>?retryWrites=true&w=majority
JWT_SECRET=your_secret_here
JWT_EXPIRES_IN=1d
```

ALERT: Do not commit `.env` files.

---

### 5.3. Run in development mode

```bash
npm run dev
```

Server will run at:

```
http://localhost:3000
```

---

## 6. Running Tests (Isolated Database)

This project uses a separate MongoDB database for testing.

Create `.env.test`:

```env
MONGODB_URI_TEST=mongodb+srv://<user>:<password>@<cluster>/<test-database>?retryWrites=true&w=majority
JWT_SECRET=test_secret
JWT_EXPIRES_IN=1d
```

Run tests:

```bash
npm test
```

The test database is automatically cleared between test runs.

---

## 7. Build for Production

```bash
npm run build
npm start
```

This compiles TypeScript into JavaScript (`dist/` folder) and runs the compiled server.

---

## 8. Security Considerations

- Passwords are hashed with bcrypt.
- JWT is required for protected routes.
- Role-based access control enforced via middleware.
- Registration forces default role to PATIENT (prevents privilege escalation).
- Test database isolated from development and production.

---

## 9. Live Deployment

Production backend:

```
https://smart-clinic-pv7c.onrender.com
```

Health check:

```
GET /health
```

---

## 10. API Documentation

See:

```
docs/API.md
```

---

## 11. License

Educational project. Intended for academic and portfolio use.
