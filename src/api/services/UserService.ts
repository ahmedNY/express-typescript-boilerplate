import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import * as bcrypt from 'bcrypt-nodejs';
import { EventDispatcher, EventDispatcherInterface } from '../../decorators/EventDispatcher';
import { Logger, LoggerInterface } from '../../decorators/Logger';
import { User } from '../models/User';
import { UserRepository } from '../repositories/UserRepository';
import { events } from '../subscribers/events';

@Service()
export class UserService {

    constructor(
        @OrmRepository() private userRepository: UserRepository,
        @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
        @Logger(__filename) private log: LoggerInterface
    ) { }

    public find(): Promise<User[]> {
        this.log.info('Find all users');
        return this.userRepository.find({ relations: ['pets'] });
    }

    public findOne(id: string): Promise<User | undefined> {
        this.log.info('Find all users');
        return this.userRepository.findOne({ id });
    }

    public async create(user: User): Promise<User> {
        this.log.info('Create a new user => ', user.toString());
        const newUser = await this.userRepository.save(user);
        this.eventDispatcher.dispatch(events.user.created, newUser);
        return newUser;
    }

    public update(id: string, user: User): Promise<User> {
        this.log.info('Update a user');
        user.id = id;
        return this.userRepository.save(user);
    }

    public async delete(id: string): Promise<void> {
        this.log.info('Delete a user');
        await this.userRepository.delete(id);
        return;
    }

    public comparePassword(user: User, candidatePassword: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            bcrypt.compare(candidatePassword, user.password, (err: Error, isMatch: boolean) => {
                if (err) {
                    return reject(err);
                }
                return resolve(isMatch);
            });
        });
    }

    public async checkUser(email: string, password: string): Promise<User> {
        // search for user by email
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            // user not found
            return undefined;
        }
        // check password
        const passwordMatched = await this.comparePassword(user, password);
        if (passwordMatched) {
            // passwored matched
            return user;
        }
        // password not matched
        return undefined;
    }

}
