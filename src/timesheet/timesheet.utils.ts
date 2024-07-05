import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from 'src/project/entities/project.entity';
import { Task } from 'src/task/entities/task.entity';
import { User } from 'src/users/entities/user.entity';
import { UserProject } from 'src/user-project/entities/user-project.entity';

@Injectable()
export class TimesheetValidatorService {
    constructor(
        @InjectRepository(Project)
        private readonly projectRepository: Repository<Project>,

        @InjectRepository(Task)
        private readonly taskRepository: Repository<Task>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        @InjectRepository(UserProject)
        private readonly userProjectRepository: Repository<UserProject>,
    ) {}

    async validateProjectAndTask(projectId: number, taskId: number) {
        const project = await this.projectRepository.findOne({
            where: { id: projectId },
            relations: ['tasks'],
        });

        if (!project) {
            throw new NotFoundException(`Project with ID ${projectId} not found`);
        }

        const task = await this.taskRepository.findOne({ where: { id: taskId } });

        if (!task) {
            throw new NotFoundException(`Task with ID ${taskId} not found`);
        }

        const isTaskInProject = project.tasks.some((t) => {
            return t.id + '' === taskId + '';
        });

        if (!isTaskInProject) {
            throw new BadRequestException('The specified project and task combination does not exist');
        }
    }

    async validateProjectAndUser(projectId: number, userId: number) {
        const project = await this.projectRepository.findOne({
            where: { id: projectId },
        });

        if (!project) {
            throw new NotFoundException(`Project with ID ${projectId} not found`);
        }

        const user = await this.userRepository.findOne({ where: { id: userId } });

        if (!user) {
            throw new NotFoundException(`User with ID ${userId} not found`);
        }

        const userProject = await this.userProjectRepository.findOne({
            where: { project: { id: projectId }, user: { id: userId } },
        });

        if (!userProject) {
            throw new BadRequestException('The specified project and user combination does not exist');
        }
    }
}
