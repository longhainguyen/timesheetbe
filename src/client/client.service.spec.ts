import { Test, TestingModule } from '@nestjs/testing';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';

describe('ClientService', () => {
    let clientService: ClientService;
    let clientControler: ClientController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ClientService],
        }).compile();

        clientService = module.get<ClientService>(ClientService);
    });

    it('should be defined', () => {
        expect(clientService).toBeDefined();
    });
});
