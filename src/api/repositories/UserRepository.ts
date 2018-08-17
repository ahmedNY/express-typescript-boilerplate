import { EntityRepository, Repository } from 'typeorm';
import { User } from '../models/User';

@EntityRepository(User)
export class UserRepository extends Repository<User>  {
    /**
     * Find by email is used for login.
     */
    public findByEmail(email: string): Promise<User> {
        return this.createQueryBuilder('user')
            .select().addSelect('user.password')
            .where("email = '" + email.toLocaleLowerCase() + "'")
            .getOne();
    }
}
