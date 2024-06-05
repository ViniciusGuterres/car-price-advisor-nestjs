import { Body, Controller, Post, Get, Patch, Param, Query, Delete, NotFoundException, UseInterceptors } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import { SerializeInterceptor } from 'src/interceptors/serialize.interceptor';
import { AuthService } from './auth.service';

@Controller('auth')
export class UsersController {
    constructor(
        private usersService: UsersService,
        private authService: AuthService,
    ) { }

    @Get('/:id')
    // @UseInterceptors(SerializeInterceptor)
    async findUser(@Param('id') id: string) {
        const myUser = await this.usersService.findOne(parseInt(id));

        if (!myUser) {
            throw new NotFoundException(`User with id ${id} not found`);
        }

        return myUser;
    }

    @Get()
    // @UseInterceptors(SerializeInterceptor)
    async findAllUsers(@Query('email') email: string) {
        const myUser = await this.usersService.find(email);

        if (!myUser) {
            throw new NotFoundException(`User with email ${email} not found`);
        }

        return myUser;
    }

    @Post('/signup')
    async createUser(@Body() { email, password }: CreateUserDto) {
        return await this.authService.signUp(email, password);
    }

    @Delete('/:id')
    async removeUser(@Param('id') id: string) {
        const myUser = await this.usersService.remove(parseInt(id));

        if (!myUser) {
            throw new NotFoundException(`User with id ${id} not found`);
        }

        return myUser;
    }

    @Patch('/:id')
    async updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
        const myUser = await this.usersService.update(parseInt(id), body); 

        if (!myUser) {
            throw new NotFoundException(`User with id ${id} not found`);
        }

        return myUser;
    }
}