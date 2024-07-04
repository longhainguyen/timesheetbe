import { BadRequestException, Injectable, NotFoundException, Req, UnauthorizedException } from '@nestjs/common';
import { CreateTimesheetDto } from './dto/create-timesheet.dto';
import { UpdateTimesheetDto } from './dto/update-timesheet.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Timesheet } from './entities/timesheet.entity';
import { Project } from 'src/project/entities/project.entity';
import { Between, Repository } from 'typeorm';
import { Task } from 'src/task/entities/task.entity';
import { User } from 'src/users/entities/user.entity';
import { StatusTimeSheet } from 'src/constant/enum/status.enum';
import { classToPlain, instanceToPlain } from 'class-transformer';
import { DateRangeDto } from './dto/date-range.dto';
import { FindByDateDto } from './dto/day.dto';
import { ProjectTaskValidatorService } from './timesheet.utils';
import { Request } from 'express';
import { ApproveOrRejectDto } from './dto/approve-or-reject.dto';

@Injectable()
export class TimesheetService {
    constructor(
        @InjectRepository(Timesheet)
        private readonly timesheetRepository: Repository<Timesheet>,

        @InjectRepository(Project)
        private readonly projectRepository: Repository<Project>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        @InjectRepository(Task)
        private readonly taskRepository: Repository<Task>,

        private readonly projectTaskValidatorService: ProjectTaskValidatorService,
    ) {}

    async create(@Req() request, createTimesheetDto: CreateTimesheetDto) {
        const project = await this.projectRepository.findOne({
            where: { id: createTimesheetDto.projectId },
        });

        const task = await this.taskRepository.findOne({ where: { id: createTimesheetDto.taskId } });

        await this.projectTaskValidatorService.validateProjectAndTask(
            createTimesheetDto.projectId,
            createTimesheetDto.taskId,
        );

        if (!request.user) {
            throw new UnauthorizedException();
        }

        const user = await this.userRepository.findOne({
            where: {
                id: request.user.sub,
            },
        });

        if (!project || !task || !user) {
            throw new NotFoundException('Project, User, or Task not found');
        }

        const timesheet = this.timesheetRepository.create({
            ...createTimesheetDto,
            status: StatusTimeSheet.NOTSUBMITTED,
            user,
            project,
            task,
        });

        const savedTimesheet = await this.timesheetRepository.save(timesheet);
        return instanceToPlain(savedTimesheet);
    }

    async findByDateRange(dateRangeDto: DateRangeDto) {
        const { startDate, endDate } = dateRangeDto;

        const timesheets = await this.timesheetRepository.find({
            where: {
                createAt: Between(new Date(startDate), new Date(endDate)),
            },
            relations: ['project', 'user', 'task'],
        });

        return timesheets.map((timesheet) => instanceToPlain(timesheet));
    }

    async findByDay(findByDateDto: FindByDateDto) {
        try {
            const { date } = findByDateDto;

            const startOfDay = new Date(date);
            startOfDay.setUTCHours(0, 0, 0, 0);

            const endOfDay = new Date(date);
            endOfDay.setUTCHours(23, 59, 59, 999);

            const timesheets = await this.timesheetRepository.find({
                where: {
                    createAt: Between(startOfDay, endOfDay),
                },
                relations: ['project', 'user', 'task'],
            });

            return timesheets.map((timesheet) => instanceToPlain(timesheet));
        } catch (error) {
            console.log(error);
        }
    }

    async update(id: number, updateTimesheetDto: UpdateTimesheetDto): Promise<any> {
        const timesheet = await this.timesheetRepository.findOne({
            where: {
                id: id,
            },

            relations: ['project', 'user', 'task'],
        });
        if (!timesheet) {
            throw new NotFoundException(`Timesheet with ID ${id} not found`);
        }

        if (updateTimesheetDto.projectId && !updateTimesheetDto.taskId) {
            await this.projectTaskValidatorService.validateProjectAndTask(
                updateTimesheetDto.projectId,
                timesheet.task.id,
            );
            timesheet.project = await this.updateProjectInTimesheet(updateTimesheetDto.projectId);
        }

        if (updateTimesheetDto.taskId && !updateTimesheetDto.projectId) {
            await this.projectTaskValidatorService.validateProjectAndTask(
                timesheet.project.id,
                updateTimesheetDto.taskId,
            );
            timesheet.task = await this.updateTaskInTimesheet(updateTimesheetDto.taskId);
        }

        if (updateTimesheetDto.taskId && updateTimesheetDto.projectId) {
            await this.projectTaskValidatorService.validateProjectAndTask(
                updateTimesheetDto.projectId,
                updateTimesheetDto.taskId,
            );
            timesheet.task = await this.updateTaskInTimesheet(updateTimesheetDto.taskId);
            timesheet.project = await this.updateProjectInTimesheet(updateTimesheetDto.projectId);
        }

        Object.assign(timesheet, updateTimesheetDto);
        const updatedTimesheet = await this.timesheetRepository.save(timesheet);

        return instanceToPlain(updatedTimesheet);
    }

    async updateProjectInTimesheet(projectId: number) {
        const project = await this.projectRepository.findOne({
            where: {
                id: projectId,
            },
        });

        if (!project) {
            throw new NotFoundException(`Project with ID ${projectId} not found`);
        }

        return project;
    }

    async updateTaskInTimesheet(taskId: number) {
        const task = await this.taskRepository.findOne({
            where: {
                id: taskId,
            },
        });

        if (!task) {
            throw new NotFoundException(`Task with ID ${taskId} not found`);
        }
        return task;
    }

    remove(id: number) {
        return `This action removes a #${id} timesheet`;
    }

    async summitTimesheet(id: number) {
        const timesheet = await this.timesheetRepository.findOne({ where: { id } });

        if (!timesheet) {
            throw new NotFoundException('Timesheet not found');
        }

        timesheet.status = StatusTimeSheet.PENDING;

        const updatedTimesheet = await this.timesheetRepository.save(timesheet);
        return instanceToPlain(updatedTimesheet);
    }

    async approveOrReject(id: number, approveOrRejectDto: ApproveOrRejectDto) {
        const timesheet = await this.timesheetRepository.findOne({ where: { id: id } });

        if (!timesheet) {
            throw new NotFoundException('Timesheet not found');
        }

        timesheet.status = approveOrRejectDto.status;

        const updatedTimesheet = await this.timesheetRepository.save(timesheet);
        return instanceToPlain(updatedTimesheet);
    }
}
