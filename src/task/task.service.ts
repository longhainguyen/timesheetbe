import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';
import { TypeTask } from 'src/constant/enum/task.enum';
import { Project } from 'src/project/entities/project.entity';

@Injectable()
export class TaskService {
    constructor(
        @InjectRepository(Task)
        private readonly taskRepository: Repository<Task>,

        @InjectRepository(Project)
        private readonly projectsRepository: Repository<Project>,
    ) {}

    async create(createTaskDto: CreateTaskDto): Promise<Task> {
        const newTask = this.taskRepository.create(createTaskDto);
        try {
            if (newTask.type === TypeTask.COMMON) {
                const projects = await this.projectsRepository.find();
                newTask.projects = projects;
            } else if (newTask.type === TypeTask.OTHER) {
                const projectIds = createTaskDto.projectIds || [];

                if (projectIds.length > 0) {
                    const projects = await this.projectsRepository.find({
                        where: projectIds.map((id) => ({ id })),
                    });

                    newTask.projects = projects;
                }
            }

            const savedTask = await this.taskRepository.save(newTask);
            return savedTask;
        } catch (error) {
            throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async findAll(): Promise<Task[]> {
        try {
            const tasks = await this.taskRepository.find({
                relations: ['projects'],
            });

            return tasks;
        } catch (error) {
            throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    findOne(id: number) {
        return `This action returns a #${id} task`;
    }

    async update(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
        const task = await this.taskRepository.preload({
            id,
            ...updateTaskDto,
        });

        if (!task) {
            throw new NotFoundException(`Task with ID ${id} not found`);
        }

        try {
            if (updateTaskDto.type === TypeTask.COMMON) {
                const projects = await this.projectsRepository.find();
                task.projects = projects;
            } else if (updateTaskDto.type === TypeTask.OTHER) {
                const projectIds = updateTaskDto.projectIds || [];
                if (projectIds.length > 0) {
                    const projects = await this.projectsRepository.find({
                        where: projectIds.map((id) => ({ id })),
                    });

                    task.projects = projects;
                }
            }
            return await this.taskRepository.save(task);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async remove(id: number): Promise<void> {
        const result = await this.taskRepository.delete(id);

        if (result.affected === 0) {
            throw new NotFoundException(`Task with ID ${id} not found`);
        }
    }

    async getTaskByType(type: TypeTask): Promise<Task[]> {
        try {
            const tasks = await this.taskRepository.find({
                where: { type },
                relations: ['projects'],
            });

            if (tasks.length === 0) {
                throw new NotFoundException(`No tasks found for type ${type}`);
            }

            return tasks;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
