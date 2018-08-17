import { IsNotEmpty } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ID, ObjectType } from 'type-graphql';

import { User } from './User';

@ObjectType()
@Entity()
export class Pet {

    @Field(type => ID)
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @Field()
    @IsNotEmpty()
    @Column()
    public name: string;

    @Field()
    @IsNotEmpty()
    @Column()
    public age: number;

    @Field({ nullable: true })
    @Column({
        name: 'user_id',
        nullable: true,
    })
    public userId: number;

    // @Field(type => User)
    @ManyToOne(type => User, user => user.pets)
    @JoinColumn({ name: 'user_id' })
    public user: User;

    public toString(): string {
        return `${this.name}`;
    }

}
