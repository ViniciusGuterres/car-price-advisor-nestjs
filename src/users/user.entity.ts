import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    AfterInsert,
    AfterRemove,
    AfterUpdate,
    OneToMany,
} from "typeorm";
import { Exclude } from "class-transformer";
import { Report } from "src/reports/report.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    @Exclude()
    password: string;

    @OneToMany(() => Report, report => report.user)
    reports: Report[];

    @AfterInsert()
    logInsert() {
        console.log(`Created user with id ${this.id}`);
    }

    @AfterRemove()
    logRemove() {
        console.log(`Removed user with id ${this.id}`);
    }

    @AfterUpdate()
    logUpdate() {
        console.log(`Updated user with id ${this.id}`);
    }
}