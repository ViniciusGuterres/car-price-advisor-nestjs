import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UsersService } from "./users.service";

it('can create an instance of auth service', async () => {
    // Creating a fake copy of users service
    const fakeUsersService = {
        find: () => Promise.resolve([]),
        create: (email: string, password: string) => Promise.resolve({ id: 1, email, password }),
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

    const service = module.get(AuthService);

    expect(service).toBeDefined();
});