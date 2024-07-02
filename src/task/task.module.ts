import { Module, forwardRef } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { ProjectModule } from 'src/project/project.module';

@Module({
    imports: [TypeOrmModule.forFeature([Task]), forwardRef(() => ProjectModule)],
    controllers: [TaskController],
    providers: [TaskService],
    exports: [TypeOrmModule],
})
export class TaskModule {}
