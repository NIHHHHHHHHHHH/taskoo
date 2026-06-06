# Tasko

A simple task management app to keep your work organized. Create tasks, mark them done, and filter by status. Works great for personal use or small teams.

**Live App:** https://taskoo-three.vercel.app

**Live API:** https://taskoo-backend.onrender.com

## Features

- User registration and login with JWT auth
- Create, edit, delete tasks
- Mark tasks as pending or completed
- Search tasks by title or description
- Filter by status (all, pending, completed)
- Pagination for task lists
- Dark theme UI with Tailwind CSS
- Responsive design for mobile and desktop

## Tech Stack

Frontend:
- React + Vite
- Tailwind CSS 
- React Router
- Lucide React icons

Backend:
- Node.js + Express
- MongoDB
- JWT authentication
- Bcrypt for password hashing

## Setup

Clone the repo:
```bash
git clone https://github.com/yourname/tasko.git
cd tasko
```

### Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
FRONTEND_URL=http://localhost:5173
```

Get MongoDB URI from MongoDB Atlas (free tier available at mongodb.com)

Run backend:
```bash
npm run dev
```

Backend runs on http://localhost:5000

### Frontend Setup

```bash
cd frontend
npm install
```

Create `.env` file:
```
VITE_API_BASE_URL=http://localhost:5000
```

Run frontend:
```bash
npm run dev
```

Frontend runs on http://localhost:5173

## How to Use

1. Register a new account or login
2. Click "New Task" to create a task
3. Enter task title and description
4. Use search box to find tasks
5. Filter by status using buttons (All, Pending, Completed)
6. Click circle icon to mark task done
7. Edit or delete tasks with the buttons on each task

## Deployment

Frontend is deployed on Vercel.
Backend is deployed on Render .
Database is on MongoDB Atlas free tier.

To deploy your own version:
- Push code to GitHub
- Connect frontend repo to Vercel
- Connect backend repo to Render
- Add environment variables in their dashboards

