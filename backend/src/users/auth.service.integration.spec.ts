// auth.service.integration.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { User } from './schemas/user.schema';
import { FakeUserModel } from './fake-user.model';
import {AuthService} from "../auth/auth.service";

describe('AuthService Integration', () => {
    let authService: AuthService;
    let usersService: UsersService;
    let jwtService: JwtService;

    beforeEach(async () => {
        FakeUserModel.reset();

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                UsersService,
                {
                    provide: JwtService,
                    useValue: {
                        sign: jest.fn().mockImplementation((payload) => `token-${payload.username}`),
                    },
                },
                {
                    provide: getModelToken(User.name),
                    useValue: FakeUserModel,
                },
            ],
        }).compile();

        authService = module.get<AuthService>(AuthService);
        usersService = module.get<UsersService>(UsersService);
        jwtService = module.get<JwtService>(JwtService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('register', () => {
        it('deve registrar um novo usuário e retornar os dados sem a senha', async () => {
            const username = 'john';
            const password = 'secret';
            const role = 'analista';

            const registeredUser = await authService.register(username, password, role);
            expect(registeredUser).toHaveProperty('_id');
            expect(registeredUser).toHaveProperty('username', username);
            expect(registeredUser).toHaveProperty('role', role);
            expect(registeredUser).not.toHaveProperty('password');
        });
    });

    describe('validateUser', () => {
        it('deve validar as credenciais corretas', async () => {
            const username = 'john';
            const password = 'secret';
            const role = 'analista';

            await authService.register(username, password, role);

            jest.spyOn(bcrypt, 'compare').mockImplementation(async (plain: string, hash: any) => {
                return plain === 'secret';
            });

            const validatedUser = await authService.validateUser(username, password);

            expect(validatedUser).not.toBeNull();

            if (validatedUser) {
                expect(validatedUser.username).toBe(username);
                expect(validatedUser).not.toHaveProperty('password');
            }
        });

        it('deve retornar null para senha incorreta', async () => {
            const username = 'john';
            const password = 'secret';
            const role = 'analista';

            await authService.register(username, password, role);
            jest.spyOn(bcrypt, 'compare').mockImplementation(async (plain: string, hash: any) => {
                return plain === 'secret';
            });

            const validatedUser = await authService.validateUser(username, 'wrongpassword');
            expect(validatedUser).toBeNull();
        });
    });


    describe('login', () => {
        it('deve retornar um access_token e a role do usuário', async () => {
            const username = 'john';
            const password = 'secret';
            const role = 'analista';

            const registeredUser = await authService.register(username, password, role);

            const loginResult = await authService.login(registeredUser);

            expect(loginResult).toHaveProperty('access_token');
            expect(loginResult).toHaveProperty('role', role);

            expect(jwtService.sign).toHaveBeenCalledWith({
                username,
                sub: registeredUser._id,
                role,
            });
        });
    });
});
