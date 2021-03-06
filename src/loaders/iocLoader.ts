import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework-w3tec';
import { useContainer as routingUseContainer } from 'routing-controllers';
import { Container } from 'typedi';
import { useContainer as ormUseContainer } from 'typeorm';
import { useContainer as typeGraphQlUseContainer } from 'type-graphql';
import { useContainer as classValidatorUseContainer } from 'class-validator';

export const iocLoader: MicroframeworkLoader = (settings: MicroframeworkSettings | undefined) => {

    /**
     * Setup routing-controllers to use typedi container.
     */
    routingUseContainer(Container);
    typeGraphQlUseContainer(Container);
    ormUseContainer(Container);
    classValidatorUseContainer(Container);
};
