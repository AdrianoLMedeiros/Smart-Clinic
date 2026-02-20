# Smart Clinic API Documentation

Base URLs:

Local:

```
http://localhost:3000
```

Production:

```
https://smart-clinic-pv7c.onrender.com
```

---

# Health

## GET /health

Returns server status.

Response:

```json
{ "ok": true }
```

---

# Authentication

## POST /auth/register

Registers a new user (default role: PATIENT).

Body:

```json
{
  "name": "Adriano",
  "email": "adriano@smartclinic.com",
  "password": "SenhaForte123",
  "cep": "22745-004"
}
```

Response:

```json
{
  "user": {
    "id": "...",
    "name": "...",
    "email": "...",
    "role": "PATIENT"
  },
  "token": "..."
}
```

Errors:

- 409 Email already in use
- 400 Validation error

---

## POST /auth/login

Authenticates user.

Body:

```json
{
  "email": "adriano@smartclinic.com",
  "password": "SenhaForte123"
}
```

Response:

```json
{
  "user": { "id": "...", "role": "PATIENT" },
  "token": "..."
}
```

Errors:

- 401 Invalid credentials

---

## GET /auth/me

Returns authenticated user profile.

Headers:

```
Authorization: Bearer <token>
```

---

# CEP Integration

## GET /integrations/cep/:cep

Example:

```
/integrations/cep/01001-000
```

Response:

```json
{
  "cep": "01001-000",
  "street": "...",
  "neighborhood": "...",
  "city": "...",
  "state": "SP"
}
```

---

# Appointments

## GET /appointments/available?date=YYYY-MM-DD

Returns available time slots.

---

## POST /appointments

Creates new appointment.

Headers:

```
Authorization: Bearer <token>
```

Body:

```json
{
  "date": "2026-02-20",
  "time": "13:00"
}
```

Response:

```json
{
  "appointment": {
    "status": "PENDING",
    "rainAlert": true,
    "weatherSummary": "Rain chance: 25%"
  }
}
```

Errors:

- 409 Time slot already booked

---

## GET /appointments/me

Returns appointments for logged user.

---

# Administrative Panel (SECRETARY / ADMIN)

## GET /admin/appointments

Optional filters:

- date
- status

---

## PATCH /admin/appointments/:id/status

Body:

```json
{ "status": "CONFIRMED" }
```

Allowed statuses:

- PENDING
- CONFIRMED
- CANCELED
