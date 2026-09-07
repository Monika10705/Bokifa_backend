# Bokifa

Bokifa is a full-stack web application built with a strong focus on backend development, authentication, database management, API development, and third-party service integration.

The project follows a structured MVC architecture and uses MongoDB for data management. It includes secure authentication, email and OTP verification, password recovery, payment gateway integration, and an admin dashboard with data visualization.

## 🚀 Features

### 🔐 Authentication & User Management
- User registration and login
- Secure password hashing
- JWT-based authentication
- Email verification using OTP
- OTP expiration and validation
- Forgot password functionality
- Reset password functionality
- Confirm password validation
- User profile management
- Profile photo handling

### 📧 Email Integration
- Email service integration
- OTP generation and email delivery
- Email verification
- Password reset emails

### 💳 Payment Integration
- Payment gateway integration
- Payment processing
- Payment-related transaction handling
- Backend payment verification and management

### 🗄️ Backend & Database
- Node.js and Express.js backend
- MongoDB database integration
- MVC architecture
- RESTful APIs
- CRUD operations
- Structured controllers, models, and routes
- Middleware-based request handling
- Environment variable configuration

### 📊 Admin Dashboard
- Admin-specific functionality
- Dashboard analytics
- Data visualization using Recharts
- Interactive charts for displaying application statistics and insights

### 🎨 Frontend
- React-based frontend
- API integration with the backend
- Admin dashboard
- Recharts library for advanced data visualization

## 🛠️ Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- Nodemailer
- Payment Gateway API

### Frontend
- React.js
- Recharts
- HTML
- CSS
- JavaScript

## 🏗️ Architecture

The application follows an MVC-based architecture:

```text
Frontend
   ↓
API Routes
   ↓
Controllers
   ↓
Models
   ↓
MongoDB
