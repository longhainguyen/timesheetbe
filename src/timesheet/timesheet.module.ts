import { Module } from '@nestjs/common';
import { TimesheetService } from './timesheet.service';
import { TimesheetController } from './timesheet.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Timesheet } from './entities/timesheet.entity';
import { UsersModule } from 'src/users/users.module';
import { ProjectModule } from 'src/project/project.module';
import { TaskModule } from 'src/task/task.module';
import { ProjectTaskValidatorService } from './timesheet.utils';

@Module({
    imports: [TypeOrmModule.forFeature([Timesheet]), UsersModule, ProjectModule, TaskModule],
    controllers: [TimesheetController],
    providers: [TimesheetService, ProjectTaskValidatorService],
    exports: [TimesheetService, TypeOrmModule],
})
export class TimesheetModule {}
