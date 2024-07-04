import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserProjectDto } from './dto/create-user-project.dto';
import { UpdateUserProjectDto } from './dto/update-user-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserProject } from './entities/user-project.entity';
import { User } from 'src/users/entities/user.entity';
import { Project } from 'src/project/entities/project.entity';
import { AddUserToProjectDto } from './dto/add-user-to-project.dto';
import { classToPlain, plainToClass } from 'class-transformer';

@Injectable()
export class UserProjectService {
    constructor(
        @InjectRepository(UserProject)
        private readonly userProjectRepository: Repository<UserProject>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Project)
        private readonly projectRepository: Repository<Project>,
    ) {}

    async addUserToProject(addUserToProjectDto: AddUserToProjectDto) {
        const user = await this.userRepository.findOne({ where: { id: addUserToProjectDto.userId } });
        if (!user) {
            throw new NotFoundException(`User with ID ${addUserToProjectDto.userId} not found`);
        }

        const project = await this.projectRepository.findOne({ where: { id: addUserToProjectDto.projectId } });
        if (!project) {
            throw new NotFoundException(`Project with ID ${addUserToProjectDto.projectId} not found`);
        }

        const existingUserProject = await this.userProjectRepository.findOne({
            where: {
                user: { id: addUserToProjectDto.userId },
                project: { id: addUserToProjectDto.projectId },
            },
        });

        if (existingUserProject) {
            throw new BadRequestException('User is already assigned to this project');
        }

        const userProject = this.userProjectRepository.create({
            project: project,
            user: user,
        });

        const savedUserProject = await this.userProjectRepository.save(userProject);

        return plainToClass(UserProject, savedUserProject);
    }
}
