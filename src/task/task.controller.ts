import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    ParseEnumPipe,
    HttpException,
    HttpStatus,
    Query,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/users/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/constant/enum/role.enum';
import { ParseDataToIntPipe } from 'src/pipe/parse-int.pipe';
import { Task } from './entities/task.entity';
import { TypeTask } from 'src/constant/enum/task.enum';

@ApiBearerAuth('JWT-auth')
@ApiTags('task')
@Controller('task')
export class TaskController {
    constructor(private readonly taskService: TaskService) {}

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Post()
    async create(@Body() createTaskDto: CreateTaskDto) {
        return await this.taskService.create(createTaskDto);
    }

    @Get()
    async findAll() {
        return await this.taskService.findAll();
    }

    @Get('/type')
    async getTaskByType(@Query('type', new ParseEnumPipe(TypeTask)) type: TypeTask): Promise<Task[]> {
        try {
            return await this.taskService.getTaskByType(type);
        } catch (error) {
            throw new HttpException('Failed to retrieve tasks by type', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return await this.taskService.findOne(+id);
    }

    @Patch(':id')
    async update(
        @Param('id', new ParseDataToIntPipe()) id: number,
        @Body() updateTaskDto: UpdateTaskDto,
    ): Promise<Task> {
        try {
            return await this.taskService.update(id, updateTaskDto);
        } catch (error) {
            throw new HttpException('Failed to update task', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Delete(':id')
    async remove(@Param('id', new ParseDataToIntPipe()) id: string) {
        return await this.taskService.remove(+id);
    }
}
