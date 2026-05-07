# School Event Management System

A full-stack school event management project with:

- Node.js, Express, MongoDB, and JWT authentication for the backend
- React and Vite for the frontend

## Features

- User registration and login
- Role-based access with `admin` and `student`
- Create, update, delete, and view events
- Register and unregister for events
- MongoDB database with Mongoose models
- Frontend dashboard with login, register, admin event controls, and student registration flow

## Setup

1. Install backend dependencies:

   ```bash
   npm install
   ```

2. Create an environment file:

   ```bash
   copy .env.example .env
   ```

3. Add your MongoDB connection string to `.env`:

   ```env
   MONGODB_URI=mongodb://127.0.0.1:27017/school-event-management
   ```

4. Start the backend server:

   ```bash
   npm run dev
   ```

5. Install frontend dependencies:

   ```bash
   cd client
   npm install
   ```

6. Start the frontend:

   ```bash
   npm run dev
   ```

7. Open the frontend in your browser:

   ```text
   http://127.0.0.1:5173
   ```

## API Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/events`
- `GET /api/events/:id`
- `POST /api/events`
- `PUT /api/events/:id`
- `DELETE /api/events/:id`
- `POST /api/events/:id/register`
- `DELETE /api/events/:id/register`

## Example Admin Registration Body

```json
{
  "name": "Admin User",
  "email": "admin@school.com",
  "password": "123456",
  "role": "admin"
}
```
