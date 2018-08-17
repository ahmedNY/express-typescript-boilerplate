import {
    Resolver,
    Mutation,
    Arg,
    PubSub,
    Publisher,
    Subscription,
    Root
} from 'type-graphql';

import { NotificationPayload, Notification } from '../models/Notificaiton';

@Resolver()
export class NotificationResolver {
    private autoIncrement = 0;

    @Mutation()
    public sendNotfication(
        @PubSub('NOTIFICATIONS') publish: Publisher<NotificationPayload>,
        @Arg('message', { nullable: true }) message?: string
    ): boolean {
        return publish({ id: ++this.autoIncrement, message });
    }

    @Subscription({ topics: 'NOTIFICATIONS' })
    public watchNotifications(@Root() { id, message }: NotificationPayload): Notification {
        return { id, message, date: new Date() };
    }
}
