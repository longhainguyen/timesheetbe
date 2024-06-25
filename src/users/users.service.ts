import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
    ) {}

    async create(createUserDto: CreateUserDto): Promise<User> {
        const newUser = this.usersRepository.create(createUserDto);
        try {
            return await this.usersRepository.save(newUser);
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY' || error.code === '23505') {
                throw new HttpException('User with this username or email already exists', HttpStatus.CONFLICT);
            }
            throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async findAll(): Promise<User[]> {
        return this.usersRepository.find();
    }

    async findOneByID(id: number): Promise<User> {
        const user = await this.usersRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }

    async findOneByName(userName: string): Promise<User> {
        const user = await this.usersRepository.findOne({ where: { userName } });
        if (!user) {
            throw new NotFoundException(`User with name ${userName} not found`);
        }
        return user;
    }

    async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
        await this.usersRepository.update(id, updateUserDto);
        const updatedUser = await this.usersRepository.findOne({ where: { id } });
        if (!updatedUser) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return updatedUser;
    }

    async remove(id: number): Promise<void> {
        const result = await this.usersRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
    }
}
