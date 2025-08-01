# E-Learning Platform

A full-stack web application for online learning, built with Node.js, Express, React, and MongoDB. This platform provides a comprehensive solution for course management, user authentication, and interactive learning experiences.

## 🚀 Features

- **User Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (Student, Instructor, Admin)
  - Google OAuth integration
  - Secure password hashing with bcrypt

- **Course Management**
  - Create, edit, and delete courses
  - Course categorization
  - Rich course content with lectures
  - File upload support for course materials

- **User Management**
  - Student enrollment system
  - Instructor profiles
  - User profile management
  - Progress tracking

- **Interactive Learning**
  - Video lectures
  - Course materials download
  - Progress tracking
  - Enrollment management

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database with Mongoose ODM
- **Passport.js** - Authentication middleware
- **JWT** - JSON Web Tokens for authentication
- **Multer** - File upload handling
- **bcryptjs** - Password hashing

### Frontend
- **React.js** - UI library
- **Redux** - State management
- **React Router** - Client-side routing
- **Bootstrap** - CSS framework
- **Sass** - CSS preprocessor
- **Axios** - HTTP client

### Development Tools
- **ESLint** - Code linting
- **Nodemon** - Development server
- **Concurrently** - Run multiple commands

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (local or MongoDB Atlas)

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd e-learning
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Environment Setup**
   
   Create a `.env` file in the root directory:
   ```env
   NODE_ENV=development
   PORT=5001
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```

5. **Start the development servers**

   **Option 1: Run both frontend and backend concurrently**
   ```bash
   npm run dev
   ```

   **Option 2: Run separately**
   ```bash
   # Terminal 1 - Backend
   npm run server
   
   # Terminal 2 - Frontend
   npm run client
   ```

## 📁 Project Structure

```
e-learning/
├── client/                 # React frontend
│   ├── public/            # Static files
│   ├── src/               # React source code
│   └── package.json       # Frontend dependencies
├── config/                # Configuration files
├── models/                # MongoDB models
├── routes/                # API routes
│   └── api/              # API endpoints
├── validation/            # Input validation
├── uploads/               # File uploads
├── server.js             # Express server
├── startup.js            # Production startup
└── package.json          # Backend dependencies
```

## 🔌 API Endpoints

### Authentication
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `GET /api/users/current` - Get current user

### Courses
- `GET /api/courses` - Get all courses
- `POST /api/course` - Create new course
- `GET /api/course/:id` - Get course by ID
- `PUT /api/course/:id` - Update course
- `DELETE /api/course/:id` - Delete course

### Categories
- `GET /api/category` - Get all categories
- `POST /api/category` - Create new category

### Enrollments
- `POST /api/enrollment` - Enroll in course
- `GET /api/enrollment/:userId` - Get user enrollments

### Lectures
- `GET /api/lecture/:courseId` - Get course lectures
- `POST /api/lecture` - Create new lecture
- `PUT /api/lecture/:id` - Update lecture

### Profiles
- `GET /api/profile/:userId` - Get user profile
- `PUT /api/profile/:userId` - Update user profile

## 🚀 Deployment

This application is configured for deployment on Azure App Service. See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Production Build

```bash
# Build the React frontend
cd client
npm run build
cd ..

# Start production server
npm start
```

## 🔧 Available Scripts

- `npm start` - Start production server
- `npm run server` - Start development server with nodemon
- `npm run client` - Start React development server
- `npm run dev` - Run both frontend and backend concurrently
- `npm run build` - Build React app for production
- `npm test` - Run tests

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Ashmita Kayastha**

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment troubleshooting
2. Review the application logs
3. Verify your environment variables are correctly set
4. Ensure MongoDB connection is working

## 🔒 Security

- JWT tokens for secure authentication
- Password hashing with bcrypt
- CORS configuration for allowed origins
- Input validation and sanitization
- File upload size limits

---

**Note**: Make sure to replace placeholder values (like MongoDB connection strings, JWT secrets, etc.) with your actual configuration values before running the application.
