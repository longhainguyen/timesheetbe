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
        try {
            const commonTasks = await this.taskRepository.find({
                where: { type: TypeTask.COMMON },
            });
            newProject.tasks = commonTasks;
            return await this.projectsRepository.save(newProject);
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY' || error.code === '23505') {
                throw new HttpException('Project with this name already exists', HttpStatus.CONFLICT);
            }
            throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getProjectById(id: number): Promise<Project> {
        try {
            const project = await this.projectsRepository.findOne({
                where: { id },
                relations: ['tasks'],
            });

            if (!project) {
                throw new NotFoundException(`Project with ID ${id} not found`);
            }

            return project;
        } catch (error) {
            throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
