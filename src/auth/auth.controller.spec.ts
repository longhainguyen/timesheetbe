import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
import { UsersService } from 'src/users/users.service';
import { SignInDto } from './dto/sign-in-dto';

describe('AuthController', () => {
    let authController: AuthController;
    let authService: AuthService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                AuthService,
                {
                    provide: JwtService,
                    useValue: {},
                },
                {
                    provide: ConfigService,
                    useValue: {},
                },
                {
                    provide: Reflector,
                    useValue: {},
                },
                {
                    provide: AuthGuard,
                    useValue: {
                        canActivate: jest.fn(() => true),
                    },
                },
                {
                    provide: UsersService,
                    useValue: {},
                },
            ],
        }).compile();

        authController = module.get<AuthController>(AuthController);
        authService = module.get<AuthService>(AuthService);
    });

    it('should be defined', () => {
        expect(authController).toBeDefined();
    });

    describe('signIn', () => {
        it('should call signIn method of AuthService', async () => {
            const signInDto: SignInDto = { userName: 'test', password: 'password' };
            const result = { access_token: 'token' };
            jest.spyOn(authService, 'signIn').mockResolvedValue(result);

            expect(await authController.signIn(signInDto)).toBe(result);
            expect(authService.signIn).toHaveBeenCalledWith(signInDto.userName, signInDto.password);
        });
    });

    describe('getProfile', () => {
        it('should return the user profile', () => {
            const req = { user: { id: 1, userName: 'test' } };
            expect(authController.getProfile(req as any)).toBe(req.user);
        });
    });
});
