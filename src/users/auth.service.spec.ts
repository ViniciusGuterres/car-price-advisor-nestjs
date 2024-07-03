import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UsersService } from "./users.service";
import { User } from "./user.entity";

describe('AuthService', () => {
    let service: AuthService;

    beforeEach(async () => {
        // Creating a fake copy of users service
        const fakeUsersService: Partial<UsersService> = {
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
});