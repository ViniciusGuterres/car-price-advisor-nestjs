import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UsersService } from "./users.service";
import { User } from "./user.entity";
import { BadRequestException } from '@nestjs/common';

describe('AuthService', () => {
    let service: AuthService;
    let fakeUsersService: Partial<UsersService>;

    beforeEach(async () => {
        // Creating a fake copy of users service
        fakeUsersService = {
            find: () => Promise.resolve([]),
            create: (email: string, password: string) =>
                Promise.resolve({ id: 1, email, password } as User),
        }

        const module = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    // If anyone ask for "UsersService" inside the AuthService, give them the "fakeUserService" object
                    provide: UsersService,
                    useValue: fakeUsersService
                },
            ],
        }).compile();

        service = module.get(AuthService);
    });

    it('can create an instance of auth service', async () => {
        expect(service).toBeDefined();
    });

    it('creates a new user with a salted and hashed password', async () => {
        const user = await service.signUp('test@gmail.com', 'password1239');

        expect(user.password).not.toEqual('password1239');

        const [salt, hash] = user.password.split('.');
        expect(salt).toBeDefined();
        expect(hash).toBeDefined();
    });

    it('throws an error if user signs up with an email already in use', async () => {
        fakeUsersService.find = () =>
            Promise.resolve([{ id: 1, email: 'test1223@gmail.com', password: 'pass123' } as User]);

        await expect(service.signUp('test1223@gmail.com', 'test123')).rejects.toThrow(BadRequestException);
    });

    it('throws an error if signIn is called with an unused email', async (done) => {
        fakeUsersService.find = () =>
            Promise.resolve([
                { email: 'asdf@asdf.com', password: 'laskdjf' } as User,
            ]);
        await expect(
            service.signIn('laskdjf@alskdfj.com', 'passowrd'),
        ).rejects.toThrow(BadRequestException);
    });
});