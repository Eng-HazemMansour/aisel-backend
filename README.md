# 🏥 Backend API - Patients Management System

A robust, secure, and scalable backend API built with **Node.js** and **Express.js**, following the **MVC (Model-View-Controller)** architecture pattern. This API provides comprehensive patient management capabilities with enterprise-grade security and performance.

## 🎯 What I Focused On

### 🔒 **Security Excellence**
- **HttpOnly Cookies**: Secure token storage preventing XSS attacks
- **JWT Authentication**: Industry-standard token-based authentication
- **Role-Based Access Control**: Granular permissions for different user types
- **Input Validation**: Comprehensive request validation and sanitization
- **Password Security**: bcryptjs hashing with proper salt rounds

### 🏗️ **Clean Architecture**
- **MVC Pattern**: Clear separation of concerns for maintainability
- **Service Layer**: Business logic isolation for testability
- **Middleware Pattern**: Reusable authentication and validation
- **Database Abstraction**: Custom ORM for SQLite with proper error handling

### ⚡ **Performance & Reliability**
- **Optimized Queries**: Efficient database operations with proper indexing
- **Error Handling**: Comprehensive error boundaries and graceful degradation
- **Response Optimization**: Proper HTTP status codes and response formatting
- **Memory Management**: Efficient resource usage and cleanup

### 🧪 **Testing & Quality**
- **Comprehensive Testing**: Jest-based unit tests with high coverage
- **Code Quality**: Consistent coding standards and best practices
- **Documentation**: Clear API documentation and code comments
- **Maintainability**: Modular, well-structured codebase

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Yarn package manager

### Installation

1. **Install dependencies**
   ```bash
   yarn install
   ```

2. **Set up environment variables**
   ```bash
   # Create .env file
   echo "JWT_SECRET=your-super-secret-jwt-key-change-this-in-production" > .env
   echo "FRONTEND_URL=http://localhost:3000" >> .env
   ```

3. **Start development server**
   ```bash
   yarn start:dev
   ```

   The API will be available at `http://localhost:3001`

## 🔧 Key Features

### 👤 **Authentication & Authorization**
- **Secure Login/Register**: Email-based authentication with validation
- **JWT Tokens**: Stateless authentication with HttpOnly cookies
- **Role-Based Access**: Admin and User roles with different permissions
- **Session Management**: Automatic token refresh and validation

### 📋 **Patient Management**
- **Full CRUD Operations**: Create, read, update, delete patients
- **Data Validation**: Comprehensive input validation and sanitization

### 📊 **Data Management**
- **SQLite Database**: Lightweight, reliable data storage
- **Custom ORM**: Efficient database operations

## 🛠️ Technology Stack

- **Runtime**: Node.js with Express.js
- **Database**: SQLite
- **Authentication**: JWT with HttpOnly cookies
- **Password Hashing**: bcryptjs
- **Validation**: Custom validation middleware
- **Testing**: Jest with supertest
- **Development**: Nodemon for hot reloading

## 🔐 Security Implementation

### Role-Based Access Control
- **Admin**: Full CRUD access to all resources
- **User**: Read-only access to patients, limited user management

### Data Protection
- **Password Hashing**: bcryptjs with salt rounds
- **Input Validation**: Comprehensive request validation
- **SQL Injection Protection**: Parameterized queries
- **XSS Protection**: Input sanitization and HttpOnly cookies

## 🧪 Testing

### Running Tests
```bash
# Run all tests
yarn test
```