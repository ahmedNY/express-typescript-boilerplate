import * as bcrypt from 'bcrypt-nodejs';
import { EntitySubscriberInterface, InsertEvent, EventSubscriber, UpdateEvent } from 'typeorm';
import { User } from '../models/User';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {

    /**
     * Indicates that this subscriber only listen to Post events.
     */
    public listenTo(): any {
        return User;
    }

    public async beforeInsert(event: InsertEvent<User>): Promise<any> {
        return this.hashPassword(event);
    }

    public async beforeUpdate(event: UpdateEvent<User>): Promise<any> {
        return this.hashPassword(event);
    }

    /**
     * Hash user password
     */
    private async hashPassword(event: InsertEvent<User> | UpdateEvent<User>): Promise<any> {
        console.log(`BEFORE POST INSERTED: `, event.entity);
        // before hashing we shold make sure we should not hash the hashed password
        // this is also called  @beforeUpdate
        if (event.entity.password && event.entity.password.length > 15) {
            return Promise.resolve();
        }
        const user = event.entity;
        event.entity.password = await new Promise<string>((resolve, reject) => {
            bcrypt.genSalt(10, (err, salt) => {
                if (err) { reject(err); }
                bcrypt.hash(user.password, salt, undefined, (error: Error, hash) => {
                    if (error) { reject(error); }
                    resolve(hash);
                });
            });
        });
    }
}
