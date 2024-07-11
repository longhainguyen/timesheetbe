import { Test, TestingModule } from '@nestjs/testing';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

describe('ClientService', () => {
    let clientService: ClientService;
    let clientRepository: Repository<Client>;
    let userRepository: Repository<User>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ClientService,
                {
                    provide: getRepositoryToken(Client),
                    useValue: {},
                },
                {
                    provide: getRepositoryToken(User),
                    useValue: {},
                },
            ],
        }).compile();

        clientService = module.get<ClientService>(ClientService);
        clientRepository = module.get(getRepositoryToken(Client));
        userRepository = module.get(getRepositoryToken(User));
    });

    it('should be defined', () => {
        expect(clientService).toBeDefined();
    });
});
