💬 Real-Time Chat Application
A full-stack real-time chat application built using React.js, Node.js, Express, Socket.IO, and PostgreSQL. This app enables seamless user authentication, live messaging, profile management, and chat history with real-time updates.

🚀 Tech Stack
🖥️ Frontend

React.js – Component-based UI development.
React Bootstrap – Responsive and styled UI components.
Axios – Promise-based HTTP requests.
Socket.IO Client – Real-time communication with the server.
UUID – Generating unique IDs for users/chats.

🛠️ Backend

Node.js – JavaScript runtime environment.
Express.js – Lightweight web framework.
Socket.IO – Real-time bidirectional communication.
PostgreSQL – Relational database for storing users and messages.
pg (node-postgres) – PostgreSQL client for Node.js.
dotenv – Loads environment variables securely.
CORS – Cross-Origin Resource Sharing support.


📁 Project Structure
Backend
backend/
├── server.js           # Entry point with Express, Socket.IO, DB connection
└── .env                # environment variables

Frontend
frontend/
├── src/
│   ├── components/    # Reusable UI components (Navbar, Chat, UserList)
│   ├── pages/        # Screens (Login, Signup, Home, Profile, etc.)
│   ├── App.js        # Root component & routing
│   ├── index.js      # React app entry point
│   └── App.css       # Global styles


⚙️ Setup Instructions
📌 Prerequisites

Node.js (v16 or above)
PostgreSQL
pgAdmin4 (for DB management)
Postman (for API testing)


🔧 Backend Setup

Navigate to backend directory:
cd backend


Install dependencies:
npm install
npm install -g nodemon


Create .env file:
PORT=8080
HOST=localhost
USER=your_db_user
DBPORT=5432
PASSWORD=your_db_password
DATABASE=chatApp


Set up PostgreSQL database:
CREATE DATABASE chatApp;

-- Users table
CREATE TABLE users (
    userid VARCHAR(255) PRIMARY KEY,
    username VARCHAR(255),
    email VARCHAR(255),
    passwords VARCHAR(255),
    bio VARCHAR(255),
    image VARCHAR(255)
);

-- Chat messages table
CREATE TABLE chat (
    msgid SERIAL PRIMARY KEY,
    sender VARCHAR(255),
    receiver VARCHAR(255), 
    sendername VARCHAR(255),
    text VARCHAR(1000),
    image BYTEA,
    seen BOOLEAN DEFAULT false,
    timestamp VARCHAR(255),
    FOREIGN KEY (sender) REFERENCES users(userid)
);


Run the backend:
npm start



💻 Frontend Setup

Navigate to frontend directory:
cd frontend


Install dependencies:
npm install
npm install react-bootstrap bootstrap
npm install axios socket.io-client uuid


Run the frontend:
npm start




🌐 Application Routes
✨ Frontend Pages



Route
Description



/
Landing page


/login
User login


/signup
User registration


/onboarding
Complete profile after signup


/home
Main dashboard with chat and user list


/profile
Edit/view your profile


/userprofile
View another user's profile


/settings
Account settings and logout options


📡 Backend API Endpoints
/user



Method
Route
Description



POST
/user
Create new user


GET
/user
Get all users


GET
/user/:id
Get users ordered by last message


GET
/user/:id/:query
Search messages


PUT
/user/:id
Update user


/message



Method
Route
Description



POST
/message
Send a new message


GET
/message/:sender/:receiver
Get conversation between 2 users


GET
/message/:query
Search messages


DELETE
/message/:sender/:receiver
Delete conversation


/notify



Method
Route
Description



POST
/notify
Set message as unseen


GET
/notify
Get all notification flags


PUT
/notify
Mark messages as seen



🔄 WebSocket Functionality (Socket.IO)

Connect: Establishes a socket session for each user
Message Event: Emits messages to target users in real-time
Disconnect: Logs socket disconnects


✨ App Features

✅ User Authentication (Signup/Login)
✅ Real-time Messaging (via Socket.IO)
✅ Profile Management
✅ Live Message Notifications
✅ Message Search and Filtering
✅ Seen/Unseen Status
✅ Responsive UI with Bootstrap


📸 Screenshots (optional)
You can add screenshots of:

Landing page
Chat interface
Profile page
Settings page
