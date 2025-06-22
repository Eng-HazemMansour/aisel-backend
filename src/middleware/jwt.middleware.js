const jwt = require('jsonwebtoken');

class JwtMiddleware {
  constructor() {
    this.jwtSecret = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
  }

  extractTokenFromCookie(req) {
    const token = req.cookies?.token;
    if (!token) {
      return null;
    }

    try {
      const payload = jwt.verify(token, this.jwtSecret);
      return payload;
    } catch (error) {
      return null;
    }
  }

  authenticate(req, res, next) {
    const payload = this.extractTokenFromCookie(req);
    
    if (!payload) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    req.user = payload;
    next();
  }
}

module.exports = { JwtMiddleware }; 