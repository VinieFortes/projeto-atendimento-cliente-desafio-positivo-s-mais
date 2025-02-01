import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import {User, UserRole} from './schemas/user.schema';

describe('UsersService', () => {
  let service: UsersService;
  let saveMock: jest.Mock;
  let userModelMock: jest.Mock;

  beforeEach(async () => {
    saveMock = jest.fn();
    userModelMock = jest.fn().mockImplementation((userData) => ({
      ...userData,
      save: saveMock,
    }));

    (userModelMock as any).findOne = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: userModelMock,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('deve hash a senha e salvar o usuário', async () => {
      const username = 'testuser';
      const password = 'password123';
      const role = UserRole.ANALISTA;
      const hashedPassword = 'hashed_password';

      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword);
      saveMock.mockResolvedValue({ username, password: hashedPassword, role });

      const result = await service.create(username, password, role);

      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
      expect(userModelMock).toHaveBeenCalledWith({ username, password: hashedPassword, role });
      expect(saveMock).toHaveBeenCalled();
      expect(result).toEqual({ username, password: hashedPassword, role });
    });
  });

  describe('findOne', () => {
    it('deve retornar o usuário se encontrado', async () => {
      const username = 'testuser';
      const user = { username, password: 'hashed_password', role: 'USER' };

      const execMock = jest.fn().mockResolvedValue(user);
      (userModelMock as any).findOne.mockReturnValue({ exec: execMock });

      const result = await service.findOne(username);

      expect((userModelMock as any).findOne).toHaveBeenCalledWith({ username });
      expect(execMock).toHaveBeenCalled();
      expect(result).toEqual(user);
    });

    it('deve retornar null se o usuário não for encontrado', async () => {

      const username = 'nonexistent';
      const execMock = jest.fn().mockResolvedValue(null);
      (userModelMock as any).findOne.mockReturnValue({ exec: execMock });

      const result = await service.findOne(username);

      expect((userModelMock as any).findOne).toHaveBeenCalledWith({ username });
      expect(execMock).toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });
});
