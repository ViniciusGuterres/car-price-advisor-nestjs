import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {

    constructor(@InjectRepository(User) private repo: Repository<User>) {}

    create(email: string, password: string) {
        const user = this.repo.create({ email, password });
        return this.repo.save(user);
    }

    async findOne(id: number) {
        const myUser = await this.repo.findOneBy({ id });

        if (!myUser) {
            throw new NotFoundException(`User with id ${id} not found`);
        }

        return myUser;
    }

    find(email: string) {
        return this.repo.find({ where: { email } });
    }

    async update(id: number, userNewAttributes: Partial<User>) {
        const myUser = await this.findOne(id);

        if (!myUser) {
            throw new NotFoundException(`User with id ${id} not found`);
        }

        Object.assign(myUser, userNewAttributes);
        return this.repo.save(myUser);
    }

    async remove(id: number) {
        const myUser = await this.findOne(id);

        if (!myUser) {
            throw new NotFoundException(`User with id ${id} not found`);
        }

        return this.repo.remove(myUser);
    }
}