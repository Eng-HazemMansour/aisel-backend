const PatientService = require('./PatientService');
const Patient = require('../models/Patient');

jest.mock('../models/Patient');

describe('PatientService', () => {
  let patientService;
  let mockPatientModel;

  beforeEach(() => {
    mockPatientModel = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      createTable: jest.fn(),
    };

    Patient.mockImplementation(() => mockPatientModel);
    patientService = new PatientService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all patients', async () => {
      const mockPatients = [
        { id: 1, firstName: 'John', lastName: 'Doe' },
        { id: 2, firstName: 'Jane', lastName: 'Smith' }
      ];
      mockPatientModel.findAll.mockResolvedValue(mockPatients);

      const result = await patientService.findAll();

      expect(mockPatientModel.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockPatients);
    });
  });

  describe('findOne', () => {
    it('should return patient when found', async () => {
      const mockPatient = { id: 1, firstName: 'John', lastName: 'Doe' };
      mockPatientModel.findById.mockResolvedValue(mockPatient);

      const result = await patientService.findOne(1);

      expect(mockPatientModel.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockPatient);
    });

    it('should throw error when patient not found', async () => {
      mockPatientModel.findById.mockResolvedValue(null);

      await expect(patientService.findOne(999)).rejects.toThrow('Patient not found');
    });
  });

  describe('create', () => {
    it('should create new patient', async () => {
      const patientData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phoneNumber: '1234567890',
        dob: '1990-01-01'
      };

      const mockCreatedPatient = { id: 1, ...patientData };
      mockPatientModel.create.mockResolvedValue(mockCreatedPatient);

      const result = await patientService.create(patientData);

      expect(mockPatientModel.create).toHaveBeenCalledWith(patientData);
      expect(result).toEqual(mockCreatedPatient);
    });
  });

  describe('update', () => {
    it('should update existing patient', async () => {
      const patientData = {
        firstName: 'John Updated',
        lastName: 'Doe',
        email: 'john@example.com',
        phoneNumber: '1234567890',
        dob: '1990-01-01'
      };

      const mockUpdatedPatient = { id: 1, ...patientData };
      mockPatientModel.findById.mockResolvedValue({ id: 1 });
      mockPatientModel.update.mockResolvedValue(mockUpdatedPatient);

      const result = await patientService.update(1, patientData);

      expect(mockPatientModel.findById).toHaveBeenCalledWith(1);
      expect(mockPatientModel.update).toHaveBeenCalledWith(1, patientData);
      expect(result).toEqual(mockUpdatedPatient);
    });

    it('should throw error when patient not found', async () => {
      mockPatientModel.findById.mockResolvedValue(null);

      await expect(patientService.update(999, {})).rejects.toThrow('Patient not found');
    });
  });

  describe('remove', () => {
    it('should delete existing patient', async () => {
      mockPatientModel.findById.mockResolvedValue({ id: 1 });
      mockPatientModel.delete.mockResolvedValue({ changes: 1 });

      const result = await patientService.remove(1);

      expect(mockPatientModel.findById).toHaveBeenCalledWith(1);
      expect(mockPatientModel.delete).toHaveBeenCalledWith(1);
      expect(result).toEqual({ id: 1 });
    });

    it('should throw error when patient not found', async () => {
      mockPatientModel.findById.mockResolvedValue(null);

      await expect(patientService.remove(999)).rejects.toThrow('Patient not found');
    });
  });

  describe('initializeDatabase', () => {
    it('should initialize patient table', async () => {
      await patientService.initializeDatabase();

      expect(mockPatientModel.createTable).toHaveBeenCalled();
    });
  });
}); 