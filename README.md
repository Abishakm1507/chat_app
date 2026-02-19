# Real-Time Chat Application

A full-stack real-time chat application built using React.js, Node.js, Express.js, PostgreSQL, and Socket.IO.
This application enables users to register, log in, chat in real-time, manage profiles, and receive message notifications.

---

## 🚀 Features

- JWT-based Authentication (Signup / Login)
- Real-time messaging using Socket.IO
- User profile management (bio, image, email, username)
- Search messages by text
- Message seen/unseen notification system
- Delete conversations
- Clean UI with React Bootstrap
- Protected backend routes using middleware
- PostgreSQL relational database integration

---

## 🛠 Tech Stack

### Frontend
- React.js
- React Bootstrap
- Axios
- Socket.IO Client
- UUID

### Backend
- Node.js
- Express.js
- PostgreSQL
- pg (node-postgres)
- Socket.IO
- JWT (jsonwebtoken)
- bcrypt
- dotenv
- CORS

---

# ⚙️ Backend Setup

## Prerequisites

- Node.js (v16+)
- PostgreSQL
- pgAdmin (optional)
- Postman (optional)

---

## Install Dependencies

cd backend
npm install
npm install -g nodemon

---

## Database Setup
```
CREATE DATABASE chatApp;
```
Users Table:
```
CREATE TABLE users (
    userid VARCHAR(255) NOT NULL,
    username VARCHAR(255),
    email VARCHAR(255),
    passwords VARCHAR(255),
    bio VARCHAR(255),
    image VARCHAR(255),
    role VARCHAR(20),
    PRIMARY KEY (userid)
);
```
Chat Table:
```
CREATE TABLE chat (
    msgid INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY(INCREMENT 1 START 1),
    sender VARCHAR(255),
    receiver VARCHAR(255),
    sendername VARCHAR(255),
    text VARCHAR(1000),
    image BYTEA,
    seen BOOLEAN DEFAULT false,
    timestamp VARCHAR(255),
    PRIMARY KEY (msgid),
    FOREIGN KEY (sender) REFERENCES users(userid)
);
```
---

## Environment Variables (backend/.env)
```
PORT=8080
HOST=localhost
USER=your_db_user
DBPORT=5432
PASSWORD=your_db_password
DATABASE=chatApp
JWT_SECRET=your_secret_key
```
---

## Run Backend
```
npm start
```
Server runs on:
http://localhost:8080

---

# 🌐 Frontend Setup
```
cd frontend
npm install
npm install react-bootstrap bootstrap
npm install axios
npm install socket.io-client
npm install uuid
```
---

## Environment Variables (frontend/.env)
```
REACT_APP_PREFIX=http://localhost:8080
```
---

## Run Frontend
```
npm start
```
App runs on:
http://localhost:3000

---

# 🔌 API Overview

## User API
```
POST    /user                Create new user
GET     /user                Get all users
GET     /user/:id            Get users ordered by last message
GET     /user/:id/:query     Search messages
PUT     /user/:id            Update user
```
## Message API
```
POST    /message                         Send message
GET     /message/:sender/:receiver       Get conversation
GET     /message/:query                  Search messages
DELETE  /message/:sender/:receiver       Delete conversation
```

## Notification API
```
POST    /notify    Set message unseen
GET     /notify    Get notifications
PUT     /notify    Mark as seen
```
---

# ⚡ Real-Time Communication

Socket.IO is used to:
- Establish client-server connection
- Broadcast messages instantly
- Notify users of new messages
- Handle user disconnect events

---

# 🖥 Application Routes
```
/               Landing Page
/login          Login Page
/signup         Signup Page
/home           Chat Dashboard
/profile        Edit Profile
/settings       Account Settings
/userprofile    View Other User Profile
```
---

# 🔐 Authentication Flow

1. User registers → password hashed using bcrypt
2. Login → JWT token generated
3. Protected routes verified via middleware
4. Token stored and attached to API requests

---

# 📦 Future Improvements

- Group chat support
- File sharing
- Typing indicators
- Online/offline status
- Message reactions
- Docker deployment


