import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UserProjectService } from './user-project.service';
import { AddUserToProjectDto } from './dto/add-user-to-project.dto';
import { UserProject } from './entities/user-project.entity';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/users/roles.guard';
import { Role } from 'src/constant/enum/role.enum';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Unique } from 'typeorm';

@ApiTags('project')
@ApiBearerAuth('JWT-auth')
@Controller('user-project')
export class UserProjectController {
    constructor(private readonly userProjectService: UserProjectService) {}

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Post('add-user')
    async addUserToProject(@Body() addUserToProjectDto: AddUserToProjectDto) {
        return await this.userProjectService.addUserToProject(addUserToProjectDto);
    }
}
