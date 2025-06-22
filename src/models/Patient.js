const { open } = require('sqlite');
const sqlite3 = require('sqlite3');

class Patient {
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
      CREATE TABLE IF NOT EXISTS patients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        firstName TEXT NOT NULL,
        lastName TEXT NOT NULL,
        email TEXT NOT NULL,
        phoneNumber TEXT NOT NULL,
        dob TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }

  async findAll() {
    await this.init();
    return await this.db.all('SELECT * FROM patients ORDER BY createdAt DESC');
  }

  async findById(id) {
    await this.init();
    return await this.db.get('SELECT * FROM patients WHERE id = ?', [id]);
  }

  async create(patientData) {
    await this.init();
    const result = await this.db.run(
      'INSERT INTO patients (firstName, lastName, email, phoneNumber, dob) VALUES (?, ?, ?, ?, ?)',
      [patientData.firstName, patientData.lastName, patientData.email, patientData.phoneNumber, patientData.dob]
    );
    
    return await this.db.get('SELECT * FROM patients WHERE id = ?', [result.lastID]);
  }

  async update(id, patientData) {
    await this.init();
    await this.db.run(
      'UPDATE patients SET firstName = ?, lastName = ?, email = ?, phoneNumber = ?, dob = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
      [patientData.firstName, patientData.lastName, patientData.email, patientData.phoneNumber, patientData.dob, id]
    );
    
    return await this.db.get('SELECT * FROM patients WHERE id = ?', [id]);
  }

  async delete(id) {
    await this.init();
    return await this.db.run('DELETE FROM patients WHERE id = ?', [id]);
  }
}

module.exports = Patient; 