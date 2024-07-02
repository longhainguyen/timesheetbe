import { Module, forwardRef } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { Project } from './entities/project.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskModule } from 'src/task/task.module';

@Module({
    imports: [TypeOrmModule.forFeature([Project]), forwardRef(() => TaskModule)],
    controllers: [ProjectController],
    providers: [ProjectService],
    exports: [TypeOrmModule],
})
export class ProjectModule {}
