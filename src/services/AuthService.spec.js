const AuthService = require('./AuthService');
const User = require('../models/User');

jest.mock('../models/User');

describe('AuthService', () => {
  let authService;
  let mockUserModel;

  beforeEach(() => {
    mockUserModel = {
      validatePassword: jest.fn(),
      findByEmail: jest.fn(),
      create: jest.fn(),
      createTable: jest.fn(),
      createDefaultAdmin: jest.fn(),
    };

    User.mockImplementation(() => mockUserModel);
    authService = new AuthService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateUser', () => {
    it('should return user data when credentials are valid', async () => {
      const mockUser = { id: 1, email: 'test@example.com', role: 'user' };
      mockUserModel.validatePassword.mockResolvedValue(mockUser);

      const result = await authService.validateUser('test@example.com', 'password');

      expect(mockUserModel.validatePassword).toHaveBeenCalledWith('test@example.com', 'password');
      expect(result).toEqual(mockUser);
    });

    it('should return null when credentials are invalid', async () => {
      mockUserModel.validatePassword.mockResolvedValue(null);

      const result = await authService.validateUser('test@example.com', 'wrongpassword');

      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return access token and user data', async () => {
      const user = {
        id: 1,
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'user'
      };

      const result = await authService.login(user);

      expect(result).toHaveProperty('access_token');
      expect(result).toHaveProperty('user');
      expect(result.user).toEqual({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      });
    });
  });

  describe('register', () => {
    it('should create new user when email does not exist', async () => {
      const registerDto = {
        email: 'new@example.com',
        password: 'password',
        firstName: 'Jane',
        lastName: 'Doe'
      };

      const mockCreatedUser = { id: 2, email: 'new@example.com', firstName: 'Jane', lastName: 'Doe', role: 'user' };
      mockUserModel.findByEmail.mockResolvedValue(null);
      mockUserModel.create.mockResolvedValue(mockCreatedUser);

      const result = await authService.register(registerDto);

      expect(mockUserModel.findByEmail).toHaveBeenCalledWith(registerDto.email);
      expect(mockUserModel.create).toHaveBeenCalledWith(registerDto);
      expect(result).toEqual(mockCreatedUser);
    });

    it('should throw error when user already exists', async () => {
      const registerDto = {
        email: 'existing@example.com',
        password: 'password',
        firstName: 'Jane',
        lastName: 'Doe'
      };

      mockUserModel.findByEmail.mockResolvedValue({ id: 1, email: 'existing@example.com' });

      await expect(authService.register(registerDto)).rejects.toThrow('User already exists');
    });
  });

  describe('initializeDatabase', () => {
    it('should initialize user table and create default admin', async () => {
      await authService.initializeDatabase();

      expect(mockUserModel.createTable).toHaveBeenCalled();
      expect(mockUserModel.createDefaultAdmin).toHaveBeenCalled();
    });
  });
}); 