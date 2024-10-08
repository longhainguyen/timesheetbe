import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateRoleUserDto, UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { plainToClass } from 'class-transformer';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,

        private readonly mailerService: MailerService,
    ) {}

    async create(createUserDto: CreateUserDto): Promise<User> {
        const { password, ...rest } = createUserDto;
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = this.usersRepository.create({
            ...rest,
            password: hashedPassword,
        });
        try {
            const savedUser = await this.usersRepository.save(newUser);
            // const { password, ...userWithoutPassword } = savedUser;
            // return userWithoutPassword;
            return plainToClass(User, savedUser);
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

    async findAllByRole(role: string): Promise<User[]> {
        return this.usersRepository.find({ where: { role } });
    }

    async findOneByID(id: number): Promise<Omit<User, 'password'>> {
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

    async assignRole(id: number, updateRoleUserDto: UpdateRoleUserDto): Promise<User> {
        await this.usersRepository.update(id, updateRoleUserDto);
        const updatedUser = await this.usersRepository.findOne({ where: { id } });
        if (!updatedUser) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return updatedUser;
    }

    async sendWeeklyNotification(): Promise<void> {
        const users = await this.usersRepository.find();

        for (const user of users) {
            await this.mailerService.sendMail({
                to: user.email,
                subject: 'Weekly Notification',
                template: './weekly-notification',
                context: {
                    name: user.userName,
                },
            });
        }
    }
}
