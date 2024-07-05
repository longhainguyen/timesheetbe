import { Module } from '@nestjs/common';
import { TimesheetService } from './timesheet.service';
import { TimesheetController } from './timesheet.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Timesheet } from './entities/timesheet.entity';
import { UsersModule } from 'src/users/users.module';
import { ProjectModule } from 'src/project/project.module';
import { TaskModule } from 'src/task/task.module';
import { TimesheetValidatorService } from './timesheet.utils';
import { UserProjectModule } from 'src/user-project/user-project.module';

@Module({
    imports: [TypeOrmModule.forFeature([Timesheet]), UsersModule, ProjectModule, TaskModule, UserProjectModule],
    controllers: [TimesheetController],
    providers: [TimesheetService, TimesheetValidatorService],
    exports: [TimesheetService, TypeOrmModule],
})
export class TimesheetModule {}
