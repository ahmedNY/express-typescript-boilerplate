import * as express from 'express';
import { Service } from 'typedi';
import * as jwt from 'jsonwebtoken';

import { Logger, LoggerInterface } from '../decorators/Logger';
import { env } from '../env';
import { TokenInfoInterface } from './TokenInfoInterface';
import { UserService } from '../api/services/UserService';
import { UserNotFoundError } from '../api/errors/UserNotFoundError';
import { User } from '../api/models/User';

@Service()
export class AuthService {

    constructor(
        private userService: UserService,
        @Logger(__filename) private log: LoggerInterface
    ) {
    }

    public parseTokenFromRequest(req: express.Request): string | undefined {
        const authorization = req.header('authorization');

        // Retrieve the token form the Authorization header
        if (authorization && authorization.split(' ')[0] === 'Bearer') {
            this.log.info('Token provided by the client');
            return authorization.split(' ')[1];
        }

        this.log.info('No Token provided by the client');
        return undefined;
    }

    public getTokenInfo(token: string): Promise<TokenInfoInterface> {
        return new Promise((resolve, reject) => {
            jwt.verify(token, env.jwt.secret, (error: any, authData: any) => {
                // Verify if the requests was successful and append user
                // information to our extended express request object
                if (!error) {
                    return resolve(authData);
                }
                return reject(error);
            });
        });
    }

    public createJwtToken(user: User): string {
        const tokenInfo: TokenInfoInterface = {
            userId: user.id,
            role: user.role,
        };
        return 'Bearer ' + jwt.sign(tokenInfo, env.jwt.secret, { expiresIn: '15 days' });
    }

    public async login(email: string, password: string): Promise<string> {
        // validate loginInfo
        if (!email || !password) {
            throw new Error('email or password is missing');
        }

        // check users info
        const user = await this.userService.checkUser(email, password);
        if (!user) {
            throw new UserNotFoundError();
        }

        // sucessfull login :)
        // generate new token
        const token = this.createJwtToken(user);
        // return token to user
        return token ;
    }
}
