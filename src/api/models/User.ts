import { IsNotEmpty } from 'class-validator';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Pet } from './Pet';
import { ObjectType, Field } from 'type-graphql';

@ObjectType()
@Entity()
export class User {

    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @Field()
    @IsNotEmpty()
    @Column({ name: 'first_name' })
    public firstName: string;

    @IsNotEmpty()
    @Column({ name: 'last_name' })
    public lastName: string;

    @IsNotEmpty()
    @Column()
    public email: string;

    @Field()
    @IsNotEmpty()
    @Column()
    public password: string;

    @IsNotEmpty()
    @Column()
    public role: string;

    @OneToMany(type => Pet, pet => pet.user)
    public pets: Pet[];

    public toString(): string {
        return `${this.firstName} ${this.lastName} (${this.email})`;
    }

}
