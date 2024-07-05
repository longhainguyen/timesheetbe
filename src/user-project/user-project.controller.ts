import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    UseInterceptors,
    ClassSerializerInterceptor,
} from '@nestjs/common';
import { UserProjectService } from './user-project.service';
import { AddUserToProjectDto } from './dto/add-user-to-project.dto';
import { UserProject } from './entities/user-project.entity';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/users/roles.guard';
import { Role } from 'src/constant/enum/role.enum';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Unique } from 'typeorm';
import { ParseDataToIntPipe } from 'src/pipe/parse-int.pipe';

@ApiTags('project')
@ApiBearerAuth('JWT-auth')
@Controller('user-project')
@UseInterceptors(ClassSerializerInterceptor)
export class UserProjectController {
    constructor(private readonly userProjectService: UserProjectService) {}

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Post('add-user')
    async addUserToProject(@Body() addUserToProjectDto: AddUserToProjectDto) {
        return await this.userProjectService.addUserToProject(addUserToProjectDto);
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Get('user-in-project/:id')
    async getUserInProject(@Param('id', new ParseDataToIntPipe()) id: string) {
        return await this.userProjectService.getPeopleInProject(+id);
    }
}
