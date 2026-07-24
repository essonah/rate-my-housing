# Rate My Housing

Rate My Housing is a web app for Mount Holyoke College students to browse dorms and read and leave reviews covering things like location, cleanliness, and amenities. Built on the MERN stack with Firebase-based authentication.

## Features

- **Browse & search dorms** — view dorm listings with details and photos, filter by name.
- **Rate & review** — submit a rating and written review for a dorm once logged in (one review per user per dorm).
- **Photo uploads** — attach photos to a dorm listing, stored via Cloudinary.
- **Authentication** — sign up / log in with Firebase; protected routes on the frontend and verified ID tokens on the backend.
- **Rate limiting** — write endpoints (posting dorms, reviews, photos) are rate-limited to curb abuse.

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React (Create React App), React Router v6 |
| Backend | Node.js, Express |
| Database | MongoDB (Mongoose) |
| Auth | Firebase Auth (frontend), token verification via `jose` (backend) |
| Image storage | Cloudinary |
| Deployment | Docker (backend), gh-pages (frontend) |

## Project Structure

```
backend/
  index.js            # Express app entry point
  db/connection.js     # MongoDB connection
  models/               # Mongoose schemas (Dorm, Review)
  routes/dormRoutes.js  # API routes
  middleware/           # auth (Firebase token verification), rate limiting
  config/cloudinary.js  # Cloudinary + multer upload config

frontend/
  src/
    components/         # Pages and UI components
    context/AuthContext.jsx  # Firebase auth state, exposed via useAuth()
    api.js               # Axios instance that attaches Firebase ID tokens
    firebase.jsx          # Firebase client config
```

## Getting Started

### Prerequisites
- Node.js 22+
- A MongoDB connection string (e.g. MongoDB Atlas)
- A Firebase project (for auth)
- A Cloudinary account (for photo uploads)

### Backend setup

```bash
cd backend
npm install
cp .env.example .env   # fill in MONGODB_URI, CLOUDINARY_*, FIREBASE_PROJECT_ID
npm start
```

The API runs on `http://localhost:5050` by default (see `PORT` in `.env`).

### Frontend setup

```bash
cd frontend
npm install
cp .env.example .env   # set REACT_APP_BACKEND_URL to the backend URL above
npm start
```

The app runs on `http://localhost:3000` by default.

## Environment Variables

**backend/.env**
| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB connection string |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Cloudinary credentials for photo uploads |
| `FIREBASE_PROJECT_ID` | Used to verify Firebase ID tokens sent from the frontend |
| `PORT` | Server port (defaults to `5050`) |
| `FRONTEND_URL` | Deployed frontend origin(s), comma-separated, used for CORS in production |

**frontend/.env**
| Variable | Description |
|---|---|
| `REACT_APP_BACKEND_URL` | Base URL of the backend API, no trailing slash |

## API Overview

All routes are prefixed with `/api`.

| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/dorms` | – | List all dorms |
| GET | `/dorms/search?q=` | – | Search dorms by name |
| GET | `/dorms/:id` | – | Get a single dorm |
| POST | `/dorms` | required | Create a dorm |
| POST | `/dorms/:id/photos` | required | Upload up to 5 photos for a dorm |
| GET | `/reviews` | – | List all reviews |
| GET | `/reviews/dorm/:dormId` | – | List reviews for a dorm |
| POST | `/reviews/submit` | required | Submit a review (one per user per dorm) |

Routes marked "required" expect a Firebase ID token in the `Authorization: Bearer <token>` header.

## Deployment

- **Backend**: containerized via `backend/Dockerfile` (`node:22-alpine`, exposes port `5050`).
- **Frontend**: deployed on vercel
