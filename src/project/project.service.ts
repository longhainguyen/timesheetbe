import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { Repository } from 'typeorm';
import { Task } from 'src/task/entities/task.entity';
import { TypeTask } from 'src/constant/enum/task.enum';

@Injectable()
export class ProjectService {
    constructor(
        @InjectRepository(Project)
        private readonly projectsRepository: Repository<Project>,

        @InjectRepository(Task)
        private readonly taskRepository: Repository<Task>,
    ) {}

    async create(createProjectDto: CreateProjectDto): Promise<Project> {
        const newProject = this.projectsRepository.create(createProjectDto);

        const commonTasks = await this.taskRepository.find({
            where: { type: TypeTask.COMMON },
        });
        newProject.tasks = commonTasks;
        return await this.projectsRepository.save(newProject);
    }

    async getProjectById(id: number): Promise<Project> {
        const project = await this.projectsRepository.findOne({
            where: { id },
            relations: ['tasks'],
        });

        if (!project) {
            throw new NotFoundException(`Project with ID ${id} not found`);
        }

        return project;
    }
}
