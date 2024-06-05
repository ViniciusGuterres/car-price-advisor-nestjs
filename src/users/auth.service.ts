import { BadRequestException, Injectable } from "@nestjs/common";
import { UsersService } from "./users.service";
import { randomBytes, scrypt as _script } from "crypto";
import { promisify } from "util";

const scrypt = promisify(_script);

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) {}

    async signUp(email: string, password: string) {
        // Check if email is in use
        const users = await this.usersService.find(email);
        
        if (users?.length) {
            throw new BadRequestException('Email already in use');
        }

        // Hash the user's password
        // Generate a salt (random string of numbers and letters)
        const salt = randomBytes(8).toString('hex');

        // Hash the salt and the password together
        const hash = (await scrypt(password, salt, 32)) as Buffer;

        // Join the hashed result and the salt together
        const hashPassword = `${salt}.${hash.toString('hex')}`;

        // Create a new user and save it
        const newUser = await this.usersService.create(email, hashPassword);

        return newUser;
    }

    signIn() {

    }
}