const { open } = require('sqlite');
const sqlite3 = require('sqlite3');
const bcrypt = require('bcryptjs');

class User {
  constructor() {
    this.db = null;
  }

  async init() {
    if (!this.db) {
      this.db = await open({
        filename: 'database.sqlite',
        driver: sqlite3.Database
      });
    }
    return this.db;
  }

  async createTable() {
    await this.init();
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        firstName TEXT NOT NULL,
        lastName TEXT NOT NULL,
        role TEXT DEFAULT 'user',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }

  async findByEmail(email) {
    await this.init();
    return await this.db.get('SELECT * FROM users WHERE email = ?', [email]);
  }

  async findById(id) {
    await this.init();
    return await this.db.get('SELECT * FROM users WHERE id = ?', [id]);
  }

  async create(userData) {
    await this.init();
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    const result = await this.db.run(
      'INSERT INTO users (email, password, firstName, lastName, role) VALUES (?, ?, ?, ?, ?)',
      [userData.email, hashedPassword, userData.firstName, userData.lastName, userData.role || 'user']
    );
    
    return await this.db.get('SELECT * FROM users WHERE id = ?', [result.lastID]);
  }

  async validatePassword(email, password) {
    const user = await this.findByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      const { password: _, ...result } = user;
      return result;
    }
    return null;
  }

  async createDefaultAdmin() {
    await this.init();
    const adminExists = await this.db.get('SELECT * FROM users WHERE role = ?', ['admin']);
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('11111111', 10);
      await this.db.run(
        'INSERT INTO users (email, password, firstName, lastName, role) VALUES (?, ?, ?, ?, ?)',
        ['admin@aisel.io', hashedPassword, 'Admin', 'Aisel', 'admin']
      );
      console.log('Default admin account created: admin@aisel.io / 11111111');
    }
  }
}

module.exports = User; 