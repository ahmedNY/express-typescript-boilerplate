import { Resolver, Query, Authorized } from 'type-graphql';

import { PetService } from '../services/PetService';
import { Pet } from '../models/Pet';

@Resolver(of => Pet)
export class PetResolver {
    constructor(
        private petService: PetService
    ) { }

    @Authorized()
    @Query(returns => [Pet])
    public async getPets(): Promise<Pet[]> {
        return this.petService.find();
    }
}
