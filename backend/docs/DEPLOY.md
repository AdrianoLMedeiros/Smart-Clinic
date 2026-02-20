# Deployment Guide — Smart Clinic Backend

This project is deployed using Render and MongoDB Atlas.

---

## 1. Push to GitHub

Ensure:

- `.env` and `.env.test` are in `.gitignore`
- `node_modules` is ignored
- Production build works locally

---

## 2. Create Web Service on Render

1. Go to https://render.com
2. Create new Web Service
3. Connect GitHub repository
4. Set:

Root Directory:

```
backend
```

Build Command:

```
npm install && npm run build
```

Start Command:

```
npm start
```

---

## 3. Environment Variables on Render

Add:

- `MONGODB_URI`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`

Render automatically sets `PORT`.

---

## 4. MongoDB Atlas Configuration

In Atlas:

Security → Network Access

Add IP:

```
0.0.0.0/0
```

(Recommended only for academic/testing environments)

---

## 5. Validate Deployment

Test:

```
GET /health
POST /auth/register
POST /auth/login
```

Production URL:

```
https://smart-clinic-pv7c.onrender.com
```

---

## 6. Common Deployment Errors

### 502 Bad Gateway

- MongoDB connection error
- Incorrect MONGODB_URI
- Atlas IP not allowed

### 404 Not Found

- Incorrect HTTP method (GET instead of POST)
- Wrong route prefix

---

Deployment complete.
