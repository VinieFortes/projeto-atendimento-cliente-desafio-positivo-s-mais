import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: Partial<UsersService>;
  let jwtService: Partial<JwtService>;

  beforeEach(async () => {
    const usersServiceMock = {
      findOne: jest.fn(),
      create: jest.fn(),
    };

    const jwtServiceMock = {
      sign: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersServiceMock },
        { provide: JwtService, useValue: jwtServiceMock },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateUser', () => {
    it('deve retornar os dados do usuário sem a senha se as credenciais forem válidas', async () => {
      const fakeUser = {
        _id: 'user123',
        username: 'john',
        password: 'hashedpassword',
        role: 'admin',
        toObject() {
          return {
            _id: this._id,
            username: this.username,
            password: this.password,
            role: this.role,
          };
        },
      };

      (usersService.findOne as jest.Mock).mockResolvedValue(fakeUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      const result = await authService.validateUser('john', 'plainpassword');

      expect(usersService.findOne).toHaveBeenCalledWith('john');
      expect(bcrypt.compare).toHaveBeenCalledWith('plainpassword', 'hashedpassword');
      expect(result).toEqual({ _id: 'user123', username: 'john', role: 'admin' });
    });

    it('deve retornar null se o usuário não for encontrado', async () => {
      (usersService.findOne as jest.Mock).mockResolvedValue(null);

      const result = await authService.validateUser('john', 'plainpassword');

      expect(result).toBeNull();
    });

    it('deve retornar null se a senha estiver incorreta', async () => {
      const fakeUser = {
        _id: 'user123',
        username: 'john',
        password: 'hashedpassword',
        role: 'admin',
        toObject() {
          return {
            _id: this._id,
            username: this.username,
            password: this.password,
            role: this.role,
          };
        },
      };
      (usersService.findOne as jest.Mock).mockResolvedValue(fakeUser);

      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      const result = await authService.validateUser('john', 'wrongpassword');

      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('deve retornar um access_token e a role do usuário', async () => {
      const user = { _id: 'user123', username: 'john', role: 'admin' };
      (jwtService.sign as jest.Mock).mockReturnValue('fakeToken');

      const result = await authService.login(user);

      expect(jwtService.sign).toHaveBeenCalledWith({ username: 'john', sub: 'user123', role: 'admin' });
      expect(result).toEqual({ access_token: 'fakeToken', role: 'admin' });
    });
  });

  describe('register', () => {
    it('deve registrar um novo usuário e retornar os dados sem a senha', async () => {
      const newUser = {
        _id: 'user123',
        username: 'john',
        password: 'hashedpassword',
        role: 'user',
        toObject() {
          return {
            _id: this._id,
            username: this.username,
            password: this.password,
            role: this.role,
          };
        },
      };

      (usersService.create as jest.Mock).mockResolvedValue(newUser);

      const result = await authService.register('john', 'plainpassword', 'user');

      expect(usersService.create).toHaveBeenCalledWith('john', 'plainpassword', 'user');
      expect(result).toEqual({ _id: 'user123', username: 'john', role: 'user' });
    });
  });
});
