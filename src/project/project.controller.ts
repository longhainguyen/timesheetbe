import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/constant/enum/role.enum';
import { RolesGuard } from 'src/users/roles.guard';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { ParseDataToIntPipe } from 'src/pipe/parse-int.pipe';

@ApiTags('project')
@ApiBearerAuth('JWT-auth')
@Controller('project')
export class ProjectController {
    constructor(private readonly projectService: ProjectService) {}

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Post()
    @ApiBody({ type: CreateProjectDto })
    create(@Body() createProjectDto: CreateProjectDto) {
        return this.projectService.create(createProjectDto);
    }

    @Get(':id')
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    getProjectById(@Param('id', new ParseDataToIntPipe()) id: string) {
        return this.projectService.getProjectById(+id);
    }
}
