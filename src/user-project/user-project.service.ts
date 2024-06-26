import { Injectable, NotFoundException } from '@nestjs/common';
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

    async addUserToProject(addUserToProjectDto: AddUserToProjectDto): Promise<UserProject> {
        const { userId, projectId } = addUserToProjectDto;

        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException(`User with ID ${userId} not found`);
        }

        const project = await this.projectRepository.findOne({ where: { id: projectId } });
        if (!project) {
            throw new NotFoundException(`Project with ID ${projectId} not found`);
        }

        const userProject = new UserProject();
        userProject.user = user;
        userProject.project = project;
        userProject.createAt = new Date();
        userProject.updateAt = new Date();

        const savedUserProject = await this.userProjectRepository.save(userProject);

        return plainToClass(UserProject, savedUserProject);
    }
}
