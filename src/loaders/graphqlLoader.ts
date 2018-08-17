import { GraphQLServer } from 'graphql-yoga';
import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework-w3tec';
import * as TypeGraphQL from 'type-graphql';

import { env } from '../env';
// tslint:disable-next-line:no-var-requires
const requireDir = require('require-dir');
import { AuthChecker } from 'type-graphql';

import Container from 'typedi';
import { AuthService } from '../auth/AuthService';
import { TokenInfoInterface } from '../auth/TokenInfoInterface';

export const graphqlLoader: MicroframeworkLoader = async (settings: MicroframeworkSettings | undefined) => {
    if (settings) {

        interface Context {
            token?: TokenInfoInterface;
        }

        const customAuthChecker: AuthChecker<Context> =
            ({ root, args, context, info }, roles) => {
                // here you can read user from context
                // and check his permission in db against `roles` argument
                // that comes from `@Authorized`, eg. ["ADMIN", "MODERATOR"]

                // make sure token dos exist
                if (!context.token) {
                    return false;
                }

                // if role is defined and non of it match the role in the token return false
                if (roles.length && roles.indexOf(context.token.role) < 0) {
                    return false;
                }

                // if everything gos will return true
                return true;
            };

        const schema = await TypeGraphQL.buildSchema({
            resolvers: Object.values(requireDir('../api/resolvers')),
            authChecker: customAuthChecker,
        });

        async function getTokenInfo(ctx: any): Promise<any> {
            const authService = Container.get<AuthService>(AuthService);
            try {
                const token = authService.parseTokenFromRequest(ctx.request);
                if (!token) {
                    return undefined;
                }
                const tokenInfo = await authService.getTokenInfo(token);
                return tokenInfo;
            } catch (error) {
                return undefined;
            }
        }

        const grqphqlServer = new GraphQLServer({
            schema,
            context: async req => ({
                ...req,
                token: await getTokenInfo(req),
            }),
        } as any);

        const expressApp = grqphqlServer.express;

        // Run application to listen on given port
        if (!env.isTest) {
            // const server = expressApp.listen(env.app.port);
            const server = await grqphqlServer.start({
                port: env.app.port,
                endpoint: env.graphql.route,
                playground: env.graphql.editor ? '/playground' : false,
            } as any);
            settings.setData('express_server', server);
            console.log('graph ql is up and running');
        }

        // Here we can set the data for other loaders
        settings.setData('express_app', expressApp);
    }
};
