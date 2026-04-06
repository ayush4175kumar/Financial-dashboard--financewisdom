t# Finance Dashboard Backend

A backend API for managing users, roles, and financial records with role-based access control, built with Node.js, Express.js, and MongoDB.

## Features
- User and role management (Viewer, Analyst, Admin)
- Financial records CRUD
- Dashboard summary APIs
- Role-based access control
- Input validation and error handling

## Tech Stack
- Node.js, Express.js
- MongoDB, Mongoose

## Setup
1. Install dependencies:
   ```
   npm install
   ```
2. Start MongoDB locally or set `MONGO_URI` in environment variables.
3. Run the server:
   ```
   npm run dev
   ```

## API Endpoints
- `/api/users` - User and role management
- `/api/records` - Financial records CRUD
- `/api/dashboard` - Summary analytics

## Assumptions
- JWT-based mock authentication
- Local MongoDB for development

## To Do
- Implement authentication
- Add pagination and search
- Add tests
