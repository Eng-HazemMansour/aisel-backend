const jwt = require('jsonwebtoken');
const User = require('../models/User');

class AuthService {
  constructor() {
    this.userModel = new User();
    this.jwtSecret = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
  }

  async validateUser(email, password) {
    return await this.userModel.validatePassword(email, password);
  }

  async login(user) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: jwt.sign(payload, this.jwtSecret, { expiresIn: '24h' }),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }

  async register(registerDto) {
    const existingUser = await this.userModel.findByEmail(registerDto.email);
    
    if (existingUser) {
      throw new Error('User already exists');
    }

    const user = await this.userModel.create(registerDto);
    const { password, ...result } = user;
    return result;
  }

  async initializeDatabase() {
    await this.userModel.createTable();
    await this.userModel.createDefaultAdmin();
  }
}

module.exports = AuthService; 