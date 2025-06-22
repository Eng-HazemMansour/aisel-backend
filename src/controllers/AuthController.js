const AuthService = require('../services/AuthService');

class AuthController {
  constructor() {
    this.authService = new AuthService();
  }

  async login(req, res) {
    try {
      const loginDto = req.body;
      console.log('Login DTO:', loginDto);
      const user = await this.authService.validateUser(loginDto.email, loginDto.password);
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      const result = await this.authService.login(user);
      
      res.cookie('token', result.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000,
        path: '/'
      });
      
      return res.json({
        user: result.user
      });
    } catch (error) {
      console.log('Login error:', error);
      return res.status(500).json({ message: error.message });
    }
  }

  async register(req, res) {
    try {
      const registerDto = req.body;
      console.log('Register DTO:', registerDto);
      const user = await this.authService.register(registerDto);
      const result = await this.authService.login(user);
      
      res.cookie('token', result.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000,
        path: '/'
      });
      
      return res.json({
        user: result.user
      });
    } catch (error) {
      console.log('Register error:', error);
      return res.status(500).json({ message: error.message });
    }
  }

  async logout(req, res) {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/'
    });
    
    return res.json({ message: 'Logged out successfully' });
  }
}

module.exports = AuthController; 