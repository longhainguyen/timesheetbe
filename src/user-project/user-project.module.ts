import { Module } from '@nestjs/common';
import { UserProjectService } from './user-project.service';
import { UserProjectController } from './user-project.controller';
import { UsersModule } from 'src/users/users.module';
import { ProjectModule } from 'src/project/project.module';
import { UserProject } from './entities/user-project.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([UserProject]), UsersModule, ProjectModule],
    controllers: [UserProjectController],
    providers: [UserProjectService],
    exports: [UserProjectModule],
})
export class UserProjectModule {}
