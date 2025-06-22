const Patient = require('../models/Patient');

class PatientService {
  constructor() {
    this.patientModel = new Patient();
  }

  async findAll() {
    return await this.patientModel.findAll();
  }

  async findOne(id) {
    const patient = await this.patientModel.findById(id);
    if (!patient) {
      throw new Error('Patient not found');
    }
    return patient;
  }

  async create(createPatientDto) {
    return await this.patientModel.create(createPatientDto);
  }

  async update(id, updatePatientDto) {
    const existingPatient = await this.patientModel.findById(id);
    if (!existingPatient) {
      throw new Error('Patient not found');
    }
    return await this.patientModel.update(id, updatePatientDto);
  }

  async remove(id) {
    const existingPatient = await this.patientModel.findById(id);
    if (!existingPatient) {
      throw new Error('Patient not found');
    }
    await this.patientModel.delete(id);
    return { id };
  }

  async initializeDatabase() {
    await this.patientModel.createTable();
  }
}

module.exports = PatientService; 