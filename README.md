# 🚀 Instakilo - Backend API & Real-Time Socket Server

A robust, production-ready RESTful API and WebSocket engine powering **Instakilo**, built with Node.js, Express, MongoDB (Mongoose), and Socket.io.

---

## 🛠️ Technology Stack

- **Runtime Environment**: Node.js (ES Modules `type: "module"`)
- **Web Framework**: Express v5
- **Database**: MongoDB & Mongoose ORM v9
- **Real-time Communication**: Socket.io v4
- **Authentication**: JSON Web Tokens (JWT) & bcryptjs
- **File & Media Storage**: ImageKit SDK & Multer
- **Middlewares**: CORS, Cookie-Parser, Express-Validator

---

## 📁 Architecture & File Structure

```
backend/
├── index.js                     # HTTP Server & Socket.io initialization entry point
├── package.json                 # Dependency manifest & start scripts
└── src/
    ├── app.js                   # Express application setup & middleware pipeline
    ├── socket.js                # WebSocket handlers, online presence & messaging
    ├── config/
    │   └── config.js            # Environment variable configuration wrapper
    ├── db/
    │   └── db.js                # MongoDB connection handler
    ├── middlewares/
    │   ├── auth.middleware.js   # JWT authentication & user context injection
    │   └── upload.js            # Multer memory storage configuration
    ├── models/
    │   ├── user.model.js        # User schema (profile, followers, following, blocked)
    │   ├── post.model.js        # Post schema (caption, image, likes, comments, saved)
    │   ├── comment.model.js     # Comment schema
    │   ├── story.model.js       # Story schema (media, expiration)
    │   ├── notification.model.js# Notification schema (types: like, comment, follow, post, story, message)
    │   └── message.model.js     # Chat Message schema (sender, receiver, text, isSeen)
    ├── routes/
    │   ├── auth.routes.js       # Auth endpoints (/login, /signup, /logout)
    │   ├── user.routes.js       # User profile, follow, block/unblock, suggestions
    │   ├── post.routes.js       # Feed, explore, create, like, save, edit, delete
    │   ├── comment.routes.js    # Comment creation & deletion
    │   ├── story.routes.js      # Story creation, feed & view tracking
    │   ├── notification.routes.js# User notifications & read status
    │   └── message.routes.js    # Chat history & fallback REST message sending
    └── controllers/             # Modular request controllers grouped by domain
```

---

## 🔑 Environment Variables (`.env`)

Create a `.env` file in the root of the `backend/` directory:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/instakilo
JWT_SECRET=your_super_secret_jwt_key
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_endpoint_id
```

---

## ⚡ Socket.io Real-Time Events

| Event Name | Direction | Payload | Description |
| :--- | :--- | :--- | :--- |
| `getOnlineUsers` | Server ➔ Client | `string[]` (userIds) | Emitted to all clients whenever user presence updates. |
| `sendMessage` | Client ➔ Server | `{ senderId, receiverId, text }` | Sent by user to deliver a real-time message. Creates Message & Notification in DB. |
| `newMessage` | Server ➔ Client | `Message` object | Delivered to recipient if they are currently online. |
| `messageSent` | Server ➔ Sender | `Message` object | Emitted back to sender as delivery confirmation. |
| `markMessagesSeen`| Client ➔ Server | `{ senderId, receiverId }` | Emitted when recipient views a chat window. Updates `isSeen: true`. |
| `messagesSeen` | Server ➔ Sender | `{ senderId, receiverId }` | Notifies sender in real time so checkmark ticks turn blue. |

---

## 📡 REST API Reference Guide

### 1. Authentication (`/api/v1/auth`)
- `POST /register` - Register a new account
- `POST /login` - Log in and obtain JWT token
- `POST /logout` - Log out current user

### 2. User Profiles & Social (`/api/v1/users`)
- `GET /me` - Get current authenticated user profile
- `GET /:username` - Get public profile of any user by username
- `PATCH /profile` - Update profile details & profile picture
- `POST /:username/follow` - Follow a user
- `POST /:username/unfollow` - Unfollow a user
- `GET /:username/followers` - Get followers list
- `GET /:username/following` - Get following list
- `GET /:username/suggestions` - Get suggested accounts to follow
- `POST /:username/block` - Block a user
- `POST /:username/unblock` - Unblock a user
- `GET /blocked` - Get list of blocked users

### 3. Posts & Feed (`/api/v1/posts`)
- `GET /feed` - Get personalized feed of posts from followed users
- `GET /explore` - Get trending posts sorted by likes
- `GET /` - Get all posts
- `POST /` - Create a new post with image upload
- `GET /user/:usernameOrId` - Get posts by specific user
- `POST /:id/like` - Like a post
- `POST /:id/unlike` - Unlike a post
- `POST /:id/save` - Bookmark/save a post
- `POST /:id/unsave` - Remove saved post
- `GET /saved` - Get all saved posts for current user
- `PATCH /:id` - Edit post caption
- `DELETE /:id` - Delete a post

### 4. Comments (`/api/v1/posts/:id/comments` & `/api/v1/comments`)
- `POST /api/v1/posts/:id/comments` - Add a comment to a post
- `GET /api/v1/posts/:id/comments` - Get comments for a post
- `DELETE /api/v1/comments/:id` - Delete a comment

### 5. Stories (`/api/v1/stories`)
- `GET /feed` - Get active 24h stories grouped by user
- `POST /` - Upload a new story
- `POST /:id/view` - Mark story as viewed

### 6. Notifications (`/api/v1/notifications`)
- `GET /` - Get user notifications (likes, comments, follows, stories, messages)
- `PATCH /read` - Mark all notifications as read

### 7. Direct Messages (`/api/v1/messages`)
- `GET /:otherUserId` - Get message history between current user and target user
- `POST /:otherUserId` - HTTP fallback endpoint to send a message

---

## 🚀 Running locally

```bash
# Install dependencies
npm install

# Run dev server with nodemon
npm run dev

# Run production server
npm start
```
