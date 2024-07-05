import { Injectable, NotFoundException, Req } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { instanceToPlain, plainToClass } from 'class-transformer';

@Injectable()
export class ClientService {
    constructor(
        @InjectRepository(Client)
        private readonly clientRepository: Repository<Client>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async create(@Req() req, createClientDto: CreateClientDto) {
        const user = await this.userRepository.findOne({
            where: {
                id: req.user.sub,
            },
        });

        if (!user) {
            throw new NotFoundException('User who create this client not found');
        }

        const newClient = this.clientRepository.create({ ...createClientDto, user: user });
        const saveClient = await this.clientRepository.save(newClient);
        return instanceToPlain(saveClient);
    }

    async findAll() {
        return await this.clientRepository
            .createQueryBuilder('client')
            .leftJoinAndSelect('client.user', 'user')
            .select(['client', 'user'])
            .getMany();
    }

    async findOne(id: number) {
        return await this.clientRepository.findOne({
            where: {
                id: id,
            },
        });
    }

    async update(id: number, updateClientDto: UpdateClientDto) {
        await this.clientRepository.update(id, updateClientDto);
        const updatedClinet = await this.clientRepository.findOne({ where: { id } });
        if (!updatedClinet) {
            throw new NotFoundException(`Client with ID ${id} not found`);
        }
        return updatedClinet;
    }

    remove(id: number) {
        return `This action removes a #${id} client`;
    }
}
