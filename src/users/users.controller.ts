import {
    Body,
    Controller,
    Post,
    Get,
    Patch,
    Param,
    Query,
    Delete,
    NotFoundException,
    BadRequestException,
    Session,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { SerializeInterceptor } from 'src/interceptors/serialize.interceptor';
import { User } from './user.entity';

@Controller('auth')
export class UsersController {
    constructor(
        private usersService: UsersService,
        private authService: AuthService,
    ) { }

    @Get('/whoami')
    whoAmI(@CurrentUser() user: User): User {
        return user;
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

    @Get('/:id')
    // @UseInterceptors(SerializeInterceptor)
    async findUser(@Param('id') id: string) {
        const idParseInt = parseInt(id);

        if (Number.isNaN(idParseInt)) {
            throw new BadRequestException('The id is not a number');
        }

        const myUser = await this.usersService.findOne(idParseInt);

        if (!myUser) {
            throw new NotFoundException(`User with id ${id} not found`);
        }

        return myUser;
    }


    @Post('/signup')
    async signUp(@Body() { email, password }: CreateUserDto, @Session() session: any) {
        const user = await this.authService.signUp(email, password);

        // Added user id to the session
        session.userId = user.id;

        return user;
    }

    @Post('/signin')
    async signIn(@Body() { email, password }: CreateUserDto, @Session() session: any) {
        const user = await this.authService.signIn(email, password);

        // Added user id to the session
        session.userId = user.id;

        return user;
    }

    @Post('/signout')
    signOut(@Session() session: any) {
        session.userId = null;
    }

    @Delete('/:id')
    async removeUser(@Param('id') id: string) {
        const idParseInt = parseInt(id);

        if (Number.isNaN(idParseInt)) {
            throw new BadRequestException('The id is not a number');
        }

        const myUser = await this.usersService.remove(idParseInt);

        if (!myUser) {
            throw new NotFoundException(`User with id ${id} not found`);
        }

        return myUser;
    }

    @Patch('/:id')
    async updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
        const idParseInt = parseInt(id);

        if (Number.isNaN(idParseInt)) {
            throw new BadRequestException('The id is not a number');
        }

        const myUser = await this.usersService.update(idParseInt, body);

        if (!myUser) {
            throw new NotFoundException(`User with id ${id} not found`);
        }

        return myUser;
    }
}