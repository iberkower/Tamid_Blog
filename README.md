# College Blog Application

A full-stack blog application built with Node.js, Express, MongoDB, and React.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture Overview](#architecture-overview)
- [Getting Started](#getting-started)
- [Development Process](#development-process)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Contributing](#contributing)


## Features

### Core Features
- **User Authentication**
  - Secure signup and login using JWT tokens
  - Protected routes for authenticated users
  - Session management with local storage
- **Blog Post Management**
  - Create, read, update, and delete (CRUD) operations
  - Rich text editing with TinyMCE
  - Support for public and private posts
  - Tag-based organization system
- **Search and Filtering**
  - Real-time search by title
  - Filter by author or tags
  - Responsive search interface
- **User Experience**
  - Responsive design for all devices
  - Modern UI with Bootstrap 5
  - Loading states and error handling
  - Intuitive navigation

## Tech Stack

### Backend
- **Node.js & Express**
  - RESTful API architecture
  - Middleware for authentication and validation
  - Error handling middleware
- **MongoDB with Mongoose**
  - Schema-based data modeling
  - Indexing for performance
  - Data validation
- **JWT Authentication**
  - Secure token-based authentication
  - Token refresh mechanism
  - Protected route middleware


### Frontend
- **React (Create React App)**
  - Functional components with hooks
  - Context API for state management
  - Custom hooks for reusable logic
- **Routing & Navigation**
  - React Router v6
  - Protected route components
  - Dynamic routing
- **UI/UX**
  - Bootstrap 5 for responsive design
  - Custom CSS for styling
  - Loading spinners and animations
- **API Integration**
  - Axios for HTTP requests
  - Request/response interceptors
  - Error handling

## Architecture Overview

### Backend Architecture
```
backend/
├── src/
│   ├── models/         # Mongoose schemas
│   ├── routes/         # API endpoints
│   ├── middleware/     # Custom middleware
│   ├── services/       # Business logic
│   └── utils/          # Helper functions
└── config/            # Configuration files
```

### Frontend Architecture
```
frontend/
├── src/
│   ├── components/     # Reusable components
│   ├── pages/         # Page components
│   ├── services/      # API services
│   ├── hooks/         # Custom hooks
│   └── utils/         # Helper functions
├── public/            # Static assets
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas connection)
- Git
- Basic understanding of JavaScript and React

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/college-blog.git
cd college-blog
```

2. Set up the backend:
```bash
cd backend
cp .env.example .env  # Update with your MongoDB URI and JWT secret
npm install
npm start
```

3. Set up the frontend:
```bash
cd ../frontend
cp .env.example .env  # Update with your backend API URL
npm install
npm start
```

4. Open your browser and navigate to `http://localhost:3000`

### Environment Variables

#### Backend (.env)
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/blog
JWT_SECRET=your_jwt_secret_here
NODE_ENV=development
```

#### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000
```

## Development Process

### Challenges Faced

1. **Authentication Flow**
   - Challenge: Implementing secure JWT authentication with proper token refresh
   - Solution: Created a robust auth middleware and token refresh mechanism
   - Learning: Better understanding of JWT security best practices

2. **State Management**
   - Challenge: Managing complex state across components
   - Solution: Implemented custom hooks and context API
   - Learning: Better understanding of React's state management patterns

3. **Deployment**
   - Challenge: Deploying both frontend and backend in sync
   - Solution: Implemented Docker
   - Learning: Better understanding of using Docker to deploy frontend and backend in sync on Render


### Future Improvements

1. **Enhanced Features**
   - Comment system for blog posts
   - User profiles with avatars
   - Social sharing capabilities
   - Email notifications
   - Markdown support

2. **Technical Improvements**
   - Implement WebSocket for real-time updates
   - Add Redis caching for better performance
   - Add image upload functionality
   - Nicer looking posts

3. **User Experience**
   - Dark mode support
   - Advanced search filters
   - Post analytics
   - User dashboard
   - Mobile app version

## API Documentation

### Authentication Endpoints
- `POST /auth/signup` - Create new user account
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout

### Post Endpoints
- `GET /posts` - Get all posts (with filters)
- `POST /posts` - Create new post
- `GET /posts/:id` - Get single post
- `PUT /posts/:id` - Update post
- `DELETE /posts/:id` - Delete post

For detailed API documentation, see [docs/api_spec.md](docs/api_spec.md).

## Deployment

The application is deployed using Render.com for both frontend and backend services. The deployment is configured using a `render.yaml` file in the root directory.

### Deployment Architecture
- **Backend Service**
  - Node.js application running on Render.com
  - Environment: Node.js
  - Region: Oregon
  - Auto-deploy enabled
  - Health check endpoint at `/health`
  - Environment variables managed through Render dashboard

- **Frontend Service**
  - Static React application hosted on Render.com
  - Environment: Static
  - Region: Oregon
  - Auto-deploy enabled
  - Build command: `npm install && npm run build`
  - Environment variables managed through Render dashboard

### Environment Variables

#### Backend Environment Variables
```
NODE_ENV=production
MONGO_URI=<your_mongodb_uri>
JWT_SECRET=<your_jwt_secret>
CORS_ORIGIN=https://tamid-blog-frontend.onrender.com
PORT=10000
```

#### Frontend Environment Variables
```
REACT_APP_API_URL=https://tamid-blog-backend.onrender.com
```

### Deployment Process
1. Push changes to the main branch
2. Render automatically detects changes and triggers deployment
3. Backend service is built and deployed first
4. Frontend service is built and deployed after backend is ready
5. Health checks ensure services are running correctly

### Live Demo
- Frontend: [https://tamid-blog-frontend.onrender.com](https://tamid-blog-frontend.onrender.com)
- Backend: [https://tamid-blog-backend.onrender.com](https://tamid-blog-backend.onrender.com)

### Video Demo
[https://www.youtube.com/watch?v=7NwgkDZHYF0](https://www.youtube.com/watch?v=7NwgkDZHYF0) A video demonstration of the application will be available here, showcasing:
- User registration and authentication
- Creating and managing blog posts
- Search and filtering functionality
- Responsive design across different devices

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style
- Update documentation as needed
- Use meaningful commit messages
