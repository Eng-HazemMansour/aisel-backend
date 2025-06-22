const PatientService = require('../services/PatientService');

class PatientController {
  constructor() {
    this.patientService = new PatientService();
  }

  async create(req, res) {
    try {
      const createPatientDto = req.body;
      const result = await this.patientService.create(createPatientDto);
      return res.json(result);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async findAll(req, res) {
    try {
      const result = await this.patientService.findAll();
      return res.json(result);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async findOne(req, res) {
    try {
      const id = parseInt(req.params.id);
      const result = await this.patientService.findOne(id);
      return res.json(result);
    } catch (error) {
      if (error.message === 'Patient not found') {
        return res.status(404).json({ message: error.message });
      }
      return res.status(500).json({ message: error.message });
    }
  }

  async update(req, res) {
    try {
      const id = parseInt(req.params.id);
      const updatePatientDto = req.body;
      const result = await this.patientService.update(id, updatePatientDto);
      return res.json(result);
    } catch (error) {
      if (error.message === 'Patient not found') {
        return res.status(404).json({ message: error.message });
      }
      return res.status(500).json({ message: error.message });
    }
  }

  async remove(req, res) {
    try {
      const id = parseInt(req.params.id);
      const result = await this.patientService.remove(id);
      return res.json(result);
    } catch (error) {
      if (error.message === 'Patient not found') {
        return res.status(404).json({ message: error.message });
      }
      return res.status(500).json({ message: error.message });
    }
  }
}

module.exports = PatientController; 