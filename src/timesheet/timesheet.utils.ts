import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from 'src/project/entities/project.entity';
import { Task } from 'src/task/entities/task.entity';

@Injectable()
export class ProjectTaskValidatorService {
    constructor(
        @InjectRepository(Project)
        private readonly projectRepository: Repository<Project>,
        @InjectRepository(Task)
        private readonly taskRepository: Repository<Task>,
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
}
