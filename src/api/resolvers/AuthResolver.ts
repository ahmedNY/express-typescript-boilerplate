import { Resolver, Mutation, Arg } from 'type-graphql';

import { AuthService } from '../../auth/AuthService';
import { User } from '../models/User';

@Resolver(of => User)
export class AuthResolver {
    constructor(
        private authService: AuthService
    ) { }

    @Mutation(returns => String)
    public async login(
        @Arg('email') email: string,
        @Arg('password') password: string
    ): Promise<string> {
        return this.authService.login(email, password);
    }
}
