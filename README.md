# Dentist Appointment Booking Platform (MERN)

Production-ready MERN stack app where users can browse dentists and book appointments, and admins can view all appointments.

## Tech Stack

- **Frontend**: React (Hooks), Tailwind CSS, Fetch API
- **Backend**: Node.js, Express.js
- **Database**: MongoDB, Mongoose

## Features

- **Dentist listing**: Responsive grid, modern cards, loading + error states
- **Search**: Filter dentists by name/clinic/location/etc.
- **Pagination**: `/api/dentists?page=1&limit=6` + UI pager
- **Book appointment**: Patient form (name, age, gender, date) → stored in MongoDB
- **Admin authentication**: JWT login + protected admin routes
- **Admin panel**: View all appointments and mark them completed
- **Seed data**: Inserts 6 dentists so UI is never empty

## Folder Structure

```
dentist-appointment/
├── backend/
│   ├── server.js
│   ├── config/db.js
│   ├── models/
│   │   ├── Dentist.js
│   │   └── Appointment.js
│   ├── controllers/
│   │   ├── dentistController.js
│   │   └── appointmentController.js
│   ├── routes/
│   │   ├── dentistRoutes.js
│   │   └── appointmentRoutes.js
│   ├── data/dentists.js
│   ├── seeder.js
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── DentistCard.js
│   │   │   ├── DentistList.js
│   │   │   ├── BookAppointment.js
│   │   │   ├── AdminPanel.js
│   │   │   ├── Navbar.js
│   │   │   └── Loader.js
│   │   ├── services/api.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── tailwind.config.js
│   └── postcss.config.js
└── package.json
```

## API Endpoints

### Dentists

- `GET /api/dentists?page=1&limit=6` (supports `&search=...`) returns:
  - `{ dentists: [], currentPage: 1, totalPages: 3 }`
- `POST /api/dentists`

### Appointments

- `POST /api/appointments`
- `GET /api/appointments` (**admin**)
- `PUT /api/appointments/:id/status` (**admin**)

### Admin

- `POST /api/admin/login` → `{ token }`

## Setup (Local)

### Prerequisites

- Node.js (LTS recommended)
- MongoDB running locally (or MongoDB Atlas connection string)

### 1) Install dependencies

From the project root:

```bash
npm install
cd backend && npm install
cd ../frontend && npm install
```

### 2) Configure environment variables

Create `backend/.env` (or copy the example):

```bash
cd backend
copy .env.example .env
```

Set your Mongo connection string in `backend/.env`:

```
MONGO_URI=mongodb://127.0.0.1:27017/dentist_appointment
PORT=5000
JWT_SECRET=replace_with_long_random_string
ADMIN_EMAIL=admin@demo.com
ADMIN_PASSWORD_HASH=<bcrypt-hash>
```

### 3) Seed the database

From the project root:

```bash
npm run seed
```

### 4) Run the app (backend + frontend)

From the project root:

```bash
npm run dev
```

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000` (health: `/api/health`)

## Deployment (Production)

### Backend (Node/Express)

- Set environment variables on your host:
  - `MONGO_URI`
  - `PORT`
- Install deps and start:

```bash
cd backend
npm install --omit=dev
npm start
```

### Frontend (Static)

Build the React app:

```bash
cd frontend
npm install
npm run build
```

Deploy `frontend/build/` to a static host (Netlify, Vercel static, S3, Nginx, etc).

If you host frontend + backend on different domains, update CORS settings in `backend/server.js` (currently open for dev).

