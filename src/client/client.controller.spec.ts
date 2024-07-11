import { Test, TestingModule } from '@nestjs/testing';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';
import { Client } from './entities/client.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

describe('ClientController', () => {
    let controller: ClientController;
    let clientService: ClientService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ClientController],
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

        controller = module.get<ClientController>(ClientController);
        clientService = module.get<ClientService>(ClientService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create client', () => {
        it('should create a new client', async () => {
            const createClientDto: CreateClientDto = {
                clientName: 'name',
                contactInfo: 'contact',
            };

            const result = { id: 1, ...createClientDto } as Client;
            jest.spyOn(clientService, 'create').mockResolvedValue(result);

            expect(await controller.create({ user: {} }, createClientDto)).toBe(result);
            expect(clientService.create).toHaveBeenCalledWith({ user: {} }, createClientDto);
        });
    });

    describe('update', () => {
        it('should update a client', async () => {
            const id = 1;
            const updateClientDto: UpdateClientDto = { clientName: 'Updated Client' };
            const result: Client = { id, ...updateClientDto } as Client;
            jest.spyOn(clientService, 'update').mockResolvedValue(result);

            expect(await controller.update(id + '', updateClientDto)).toBe(result);
            expect(clientService.update).toHaveBeenCalledWith(id, updateClientDto);
        });
    });

    describe('findOne', () => {
        it('should return a client by id', async () => {
            const id = 1;
            const result: Client = {
                id,
                clientName: 'Test Client',
                contactInfo: 'contact',
            } as Client;
            jest.spyOn(clientService, 'findOne').mockResolvedValue(result);

            expect(await controller.findOne(id + '')).toBe(result);
            expect(clientService.findOne).toHaveBeenCalledWith(id);
        });
    });
});
