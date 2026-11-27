
# Secure Connect and Communication Platform
 
## Student Details

- **Name:** Swastik dhal
- **Course:** BCA
- **Semester:** 3rd
- **Section:** B
- **Roll No:** 2501060044
- **Subject:** - Backend Web Development
- **Assignment:** Lab 4

## Introduction

Secure Connect is a backend-based communication platform developed using Node.js, Express.js and MongoDB. The application allows users to register, log in, manage personal notes and communicate with other users in real time.

The main objective of this project is to understand backend security, authentication, authorization and event-driven communication.

## Features

- User signup and login
- Password hashing using bcrypt
- JWT authentication
- Protected API routes
- Role-Based Access Control (RBAC)
- Personal Notes CRUD operations
- Real-time chat using Socket.IO
- Event handling using EventEmitter
- Database connectivity using MongoDB
- Environment variable management using dotenv

## Technologies Used

| Technology | Purpose |
|---|---|
| Node.js | Backend runtime |
| Express.js | Server and API development |
| MongoDB | Database |
| JavaScript | Programming language |
| HTML | Chat interface |
| bcrypt | Password hashing |
| JWT | User authentication |
| Socket.IO | Real-time communication |
| EventEmitter | Event handling |
| dotenv | Environment variables |

## Project Structure

```text
Secure-Connect/
├── server.js
├── auth.js
├── chat.html
├── package.json
├── package-lock.json
├── .env.example
├── .gitignore
└── README.md
```

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/signup | Register a new user |
| POST | /api/auth/login | Login and generate JWT |
| GET | /api/profile | Access user profile |
| GET | /api/admin | Admin-only access |
| POST | /api/notes | Create a note |
| GET | /api/notes | View personal notes |
| PUT | /api/notes/:id | Update a note |
| DELETE | /api/notes/:id | Delete a note |
| GET | /chat | Real-time chat interface |

## Installation and Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file using `.env.example` as a reference.

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017
JWT_SECRET=your_secret_key
```

Replace the example secret with a secure random value.

### 3. Start MongoDB

Make sure the MongoDB server is installed and running.

### 4. Run the Application

```bash
node server.js
```

### 5. Open the Application

Server:

http://localhost:5000

Real-time chat:

http://localhost:5000/chat

## Security Features

- Passwords are hashed before storing them in MongoDB.
- JWT tokens are used to authenticate users.
- Protected routes reject unauthorized requests.
- Users can only access and modify their own notes.
- Admin routes are restricted to admin users.
- Chat connections require a valid JWT.
- Sensitive environment variables are excluded from GitHub.

## Testing

The application was tested using Windows PowerShell, MongoDB Compass and a web browser.

The following functionalities were tested:

- User registration and login
- JWT token generation and verification
- Protected API access
- Admin and user permissions
- Notes CRUD operations
- Note ownership verification
- Real-time messaging between two users
- Signup and login event handling

## Learning Outcomes

Through this assignment, I learned how to develop backend APIs, connect a MongoDB database, implement authentication and authorization, perform CRUD operations and build real-time communication using Socket.IO.

## Conclusion

The Secure Connect and Communication Platform demonstrates the fundamental concepts of backend development, security and real-time communication using Node.js.

This project was developed as part of the Backend Web Development Lab 4 assignment.

## Developed By

Swastik dhal

BCA (AI & DS) - 3rd Semester, Section B

K.R. Mangalam University
#� �b�a�c�k�-�e�n�d�-�a�s�s�i�g�n�m�e�n�t�-�4�
�
�
