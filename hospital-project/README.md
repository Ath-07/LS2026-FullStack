# Hospital Management System

A full-stack hospital management application with a Django REST backend and React (Vite) frontend.

## Tech Stack

**Backend:** Django 6.0, Django REST Framework, SimpleJWT, SQLite  
**Frontend:** React 19, Vite 8, React Router 7, Axios

## Features

- **Authentication** — Email-based JWT login/registration with role-based access (patient/doctor)
- **Dashboard** — Overview for patients and doctors
- **Appointment Booking** — Schedule and manage appointments
- **User Management** — Admin/doctor panel for managing users
- **Departments & Doctors** — Browse hospital departments and doctors

## Project Structure

```
hospital-project/
├── backend/              # Django project config
│   ├── settings.py
│   ├── urls.py
│   ├── asgi.py
│   └── wsgi.py
├── accounts/             # Custom user model & auth
│   ├── models.py         # CustomUser (patient/doctor roles)
│   ├── serializers.py    # Register, login, user serializers
│   ├── views.py          # RegisterView, current_user
│   ├── backends.py       # Email-based auth backend
│   └── urls.py           # /api/token/, /api/register/, /api/user/
├── hospital/             # Core domain models
│   ├── models.py         # Department, Doctor, Appointment
│   ├── serializers.py
│   ├── views.py          # ViewSets for CRUD
│   └── urls.py           # /api/departments/, /api/doctors/, /api/appointments/
├── 24B4537/              # React frontend
│   └── src/
│       ├── api/          # Axios config
│       ├── context/      # AuthContext (JWT state management)
│       ├── components/   # Navbar, Layout
│       ├── pages/        # Login, Dashboard, Booking, UserManagement
│       └── App.jsx       # Route definitions
├── manage.py
└── db.sqlite3
```

## API Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `POST /api/token/` | Auth | Login (email + password) |
| `POST /api/token/refresh/` | Auth | Refresh JWT |
| `POST /api/register/` | Auth | Register new user |
| `GET /api/user/` | Auth | Current user info |
| `GET/POST /api/departments/` | CRUD | List/create departments |
| `GET/POST /api/doctors/` | CRUD | List/create doctors |
| `GET/POST /api/appointments/` | CRUD | List/create appointments |
| `GET /api/users/` | Admin | List all users (admin only) |

## Getting Started

### Backend

```bash
cd hospital-project
venv\Scripts\activate        # Activate virtual environment
python manage.py migrate     # Apply database migrations
python manage.py runserver   # Start Django dev server (port 8000)
```

### Frontend

```bash
cd hospital-project/24B4537
npm install                  # Install dependencies
npm run dev                  # Start Vite dev server (port 5173)
```

### Default Admin

Create a superuser:

```bash
python manage.py createsuperuser
```

Access the Django admin at `http://localhost:8000/admin/`.
