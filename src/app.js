require('dotenv').config({ path: './env.local' });
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const AuthController = require('./controllers/AuthController');
const PatientController = require('./controllers/PatientController');
const { JwtMiddleware } = require('./middleware/jwt.middleware');
const AuthService = require('./services/AuthService');
const PatientService = require('./services/PatientService');

class App {
  constructor() {
    this.app = express();
    this.authController = new AuthController();
    this.patientController = new PatientController();
    this.jwtMiddleware = new JwtMiddleware();
    this.authService = new AuthService();
    this.patientService = new PatientService();
  }

  async initialize() {
    await this.setupMiddleware();
    await this.setupRoutes();
    await this.initializeDatabase();
  }

  setupMiddleware() {
    this.app.use(cors({
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    }));

    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
  }

  setupRoutes() {
    this.app.post('/auth/login', async (req, res) => {
      return await this.authController.login(req, res);
    });

    this.app.post('/auth/register', async (req, res) => {
      return await this.authController.register(req, res);
    });

    this.app.post('/auth/logout', async (req, res) => {
      return await this.authController.logout(req, res);
    });

    this.app.get('/patients', (req, res, next) => {
      this.jwtMiddleware.authenticate(req, res, next);
    }, async (req, res) => {
      return await this.patientController.findAll(req, res);
    });

    this.app.get('/patients/:id', (req, res, next) => {
      this.jwtMiddleware.authenticate(req, res, next);
    }, async (req, res) => {
      return await this.patientController.findOne(req, res);
    });

    this.app.post('/patients', (req, res, next) => {
      this.jwtMiddleware.authenticate(req, res, next);
    }, async (req, res) => {
      return await this.patientController.create(req, res);
    });

    this.app.patch('/patients/:id', (req, res, next) => {
      this.jwtMiddleware.authenticate(req, res, next);
    }, async (req, res) => {
      return await this.patientController.update(req, res);
    });

    this.app.delete('/patients/:id', (req, res, next) => {
      this.jwtMiddleware.authenticate(req, res, next);
    }, async (req, res) => {
      return await this.patientController.remove(req, res);
    });
  }

  async initializeDatabase() {
    await this.authService.initializeDatabase();
    await this.patientService.initializeDatabase();
    console.log('Database initialized successfully');
  }

  start() {
    const port = process.env.PORT || 3001;
    this.app.listen(port, () => {
      console.log(`Application is running on: http://localhost:${port}`);
    });
  }
}

module.exports = App; 