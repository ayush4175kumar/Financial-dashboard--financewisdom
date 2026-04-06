# Financial Dashboard Backend

Backend API for a financial dashboard with role-based access control. The system supports three user roles, secure login with JWT, financial record management, and dashboard analytics for income and expense tracking.

## Project Summary

This project is built for a finance workflow where:

- `admin` can manage users and create, update, and delete financial records
- `analyst` can review records and dashboard analytics
- `viewer` can register and log in, but cannot access admin or analyst-only APIs unless promoted

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token (JWT)
- bcryptjs

## Features

- User registration and login
- Password hashing with bcrypt
- JWT-based authentication
- Role-based authorization
- Financial records CRUD
- Dashboard summary and trend analytics
<<<<<<< HEAD
- MongoDB persistence with Mongo
=======
- MongoDB persistence with Mongoose

>>>>>>> 3c2d18c82b17203a0ca7d19193f0053f475651a6
## Base URL

For local development:

```text
http://localhost:3000
```

All endpoints are prefixed with:

```text
/api
```

## Environment Variables

Create a `.env` file in the project root.

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/finance_dashboard
JWT_SECRET=your_super_secret_key
```

## Installation and Run

1. Install dependencies

```bash
npm install
```

2. Start MongoDB locally or provide a cloud MongoDB connection string in `MONGO_URI`

3. Run the server

```bash
npm run dev
```

For production:

```bash
npm start
```

## Authentication

Protected endpoints require a JWT token in the `Authorization` header:

```http
Authorization: Bearer <token>
```

You receive the token from the login endpoint.

## Roles and Access Rules

### Roles

- `viewer`
- `analyst`
- `admin`

### User Status

- `active`
- `inactive`

### Access Matrix

| Endpoint Group | Viewer | Analyst | Admin |
|---|---|---|---|
| Register / Login | Yes | Yes | Yes |
| List users | No | No | Yes |
| Update user role/status | No | No | Yes |
| Delete user | No | No | Yes |
| Create financial record | No | No | Yes |
| View financial records | No | Yes | Yes |
| View dashboard analytics | No | Yes | Yes |

## API Endpoints

### 1. User APIs

#### Register User

- Method: `POST`
- Route: `/api/users/register`
- Access: Public

Request body:

```json
{
  "username": "admin1",
  "password": "StrongPassword123",
  "role": "admin"
}
```

Notes:

- `username` and `password` are required
- `role` is optional
- allowed roles: `viewer`, `analyst`, `admin`

Success response:

```json
{
  "id": "6611d5f0f3f2c1d2e3a4b5c6",
  "username": "admin1",
  "role": "admin"
}
```

Possible errors:

- `400` Username and password required
- `409` Username already exists

#### Login User

- Method: `POST`
- Route: `/api/users/login`
- Access: Public

Request body:

```json
{
  "username": "admin1",
  "password": "StrongPassword123"
}
```

Success response:

```json
{
  "token": "your_jwt_token"
}
```

Possible errors:

- `401` Invalid credentials
- `403` User inactive

#### List All Users

- Method: `GET`
- Route: `/api/users`
- Access: Admin only

Headers:

```http
Authorization: Bearer <token>
```

Success response:

```json
[
  {
    "_id": "6611d5f0f3f2c1d2e3a4b5c6",
    "username": "admin1",
    "role": "admin",
    "status": "active",
    "createdAt": "2026-04-05T10:00:00.000Z",
    "updatedAt": "2026-04-05T10:00:00.000Z"
  }
]
```

#### Update User Role or Status

- Method: `PATCH`
- Route: `/api/users/:id`
- Access: Admin only

Request body:

```json
{
  "role": "analyst",
  "status": "active"
}
```

Success response:

```json
{
  "id": "6611d5f0f3f2c1d2e3a4b5c6",
  "username": "user1",
  "role": "analyst",
  "status": "active"
}
```

Possible errors:

- `404` User not found

#### Delete User

- Method: `DELETE`
- Route: `/api/users/:id`
- Access: Admin only

Success response:

```json
{
  "message": "User deleted"
}
```

Possible errors:

- `404` User not found

### 2. Financial Record APIs

#### Create Record

- Method: `POST`
- Route: `/api/records`
- Access: Admin only

Request body:

```json
{
  "amount": 2500,
  "type": "income",
  "category": "salary",
  "date": "2026-04-01",
  "notes": "Monthly salary"
}
```

Notes:

- required fields: `amount`, `type`, `category`, `date`
- allowed record types: `income`, `expense`

Success response:

```json
{
  "_id": "6611d9b9b6b4a24fe1dc1111",
  "amount": 2500,
  "type": "income",
  "category": "salary",
  "date": "2026-04-01T00:00:00.000Z",
  "notes": "Monthly salary",
  "createdBy": "6611d5f0f3f2c1d2e3a4b5c6",
  "createdAt": "2026-04-05T11:00:00.000Z",
  "updatedAt": "2026-04-05T11:00:00.000Z",
  "__v": 0
}
```

Possible errors:

- `400` Missing required fields

#### Get All Records

- Method: `GET`
- Route: `/api/records`
- Access: Analyst and Admin

Optional query parameters:

- `type`
- `category`
- `startDate`
- `endDate`

Example:

```text
/api/records?type=expense&category=food&startDate=2026-04-01&endDate=2026-04-30
```

Success response:

```json
[
  {
    "_id": "6611d9b9b6b4a24fe1dc1111",
    "amount": 500,
    "type": "expense",
    "category": "food",
    "date": "2026-04-03T00:00:00.000Z",
    "notes": "Groceries",
    "createdBy": {
      "_id": "6611d5f0f3f2c1d2e3a4b5c6",
      "username": "admin1",
      "role": "admin"
    }
  }
]
```

#### Get Single Record

- Method: `GET`
- Route: `/api/records/:id`
- Access: Analyst and Admin

Possible errors:

- `404` Record not found

#### Update Record

- Method: `PATCH`
- Route: `/api/records/:id`
- Access: Admin only

Request body:

```json
{
  "amount": 700,
  "type": "expense",
  "category": "food",
  "date": "2026-04-04",
  "notes": "Updated grocery expense"
}
```

Possible errors:

- `404` Record not found

#### Delete Record

- Method: `DELETE`
- Route: `/api/records/:id`
- Access: Admin only

Success response:

```json
{
  "message": "Record deleted"
}
```

Possible errors:

- `404` Record not found

### 3. Dashboard APIs

All dashboard routes require:

- Method: `GET`
- Access: Analyst and Admin
- Header: `Authorization: Bearer <token>`

#### Summary

- Route: `/api/dashboard/summary`

Success response:

```json
{
  "totalIncome": 12000,
  "totalExpense": 4500,
  "netBalance": 7500
}
```

#### Category Totals

- Route: `/api/dashboard/category-totals`

Success response:

```json
[
  {
    "_id": {
      "type": "expense",
      "category": "food"
    },
    "total": 1500
  }
]
```

#### Recent Activity

- Route: `/api/dashboard/recent`

Returns the latest 10 financial records sorted by date in descending order.

#### Trends

- Route: `/api/dashboard/trends`

Optional query parameter:

- `period=month` default
- `period=week`

Example:

```text
/api/dashboard/trends?period=week
```

Success response:

```json
[
  {
    "_id": {
      "year": 2026,
      "month": 4,
      "type": "income"
    },
    "total": 12000
  }
]
```

## Common Error Responses

### Authentication Errors

```json
{
  "message": "No token provided"
}
```

```json
{
  "message": "Invalid token"
}
```

```json
{
  "message": "Invalid user"
}
```

### Authorization Error

```json
{
  "message": "Forbidden: insufficient role"
}
```

### Generic Server Error

```json
{
  "message": "Internal Server Error"
}
```

## Suggested Testing Flow  where you can test


1. Register an admin user
2. Log in to get a JWT token
3. Use the admin token to create records
4. Use the admin token to create or promote another user to analyst
5. Log in as analyst to access records and dashboard analytics

<<<<<<< HEAD
=======

>>>>>>> 3c2d18c82b17203a0ca7d19193f0053f475651a6
## Author

Ayush Kumar
