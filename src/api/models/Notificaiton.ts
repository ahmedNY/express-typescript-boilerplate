import { ObjectType, Field, ID } from 'type-graphql';

@ObjectType()
export class Notification {
    @Field(type => ID)
    public id: number;

    @Field({ nullable: true })
    public message?: string;

    @Field(type => Date)
    public date: Date;
}

export interface NotificationPayload {
    id: number;
    message?: string;
}
