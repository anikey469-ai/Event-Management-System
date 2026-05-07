School Event Management System
A full-stack school event management project with:

Node.js, Express, MongoDB, and JWT authentication for the backend
React and Vite for the frontend
Features
User registration and login
Role-based access with admin and student
Create, update, delete, and view events
Register and unregister for events
MongoDB database with Mongoose models
Frontend dashboard with login, register, admin event controls, and student registration flow
Setup
Install backend dependencies:

npm install
Create an environment file:

copy .env.example .env
Add your MongoDB connection string to .env:

MONGODB_URI=mongodb://127.0.0.1:27017/school-event-management
Start the backend server:

npm run dev
Install frontend dependencies:

cd client
npm install
Start the frontend:

npm run dev
Open the frontend in your browser:

http://127.0.0.1:5173
API Endpoints
POST /api/auth/register
POST /api/auth/login
GET /api/auth/me
GET /api/events
GET /api/events/:id
POST /api/events
PUT /api/events/:id
DELETE /api/events/:id
POST /api/events/:id/register
DELETE /api/events/:id/register
Example Admin Registration Body
{
  "name": "Admin User",
  "email": "admin@school.com",
  "password": "123456",
  "role": "admin"
}
