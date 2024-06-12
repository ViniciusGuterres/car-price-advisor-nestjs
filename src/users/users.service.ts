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
        if (!id) return null;

        let myUser = await this.repo.findOneBy({ id });

        if (!myUser)  myUser = null;
        
        return myUser;
    }

    async find(email: string): Promise<Array<User>> {        
        return await this.repo.find({ where: { email } });
    }

    async update(id: number, userNewAttributes: Partial<User>) {
        const myUser = await this.findOne(id);

        if (!myUser) {
            return null;
        }

        Object.assign(myUser, userNewAttributes);
        return this.repo.save(myUser);
    }

    async remove(id: number) {
        let myUser = await this.findOne(id);

        if (!myUser) {
            return null;
        }

        return this.repo.remove(myUser);
    }
}