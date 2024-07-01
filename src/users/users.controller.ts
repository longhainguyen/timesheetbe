import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    ParseIntPipe,
    UseGuards,
    UseInterceptors,
    ClassSerializerInterceptor,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateRoleUserDto, UpdateUserDto } from './dto/update-user.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/constant/enum/role.enum';
import { ParseDataToIntPipe } from 'src/pipe/parse-int.pipe';
import { RoleValidationPipe } from 'src/pipe/role-validation.pipe';
import { Public } from 'src/decorators/public.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from './roles.guard';
import { LoggingInterceptor } from 'src/interceptors/logging.interceptor';
import { ApiBasicAuth, ApiBearerAuth, ApiQuery, ApiSecurity, ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiBearerAuth('JWT-auth')
@ApiTags('users')
@UseInterceptors(LoggingInterceptor)
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    // @Public()
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @ApiQuery({ name: 'role', enum: Role })
    @Post()
    create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Patch('assign-role/:id')
    assignRole(@Param('id', new ParseDataToIntPipe()) id: string, @Body() updateRoleUserDto: UpdateRoleUserDto) {
        return this.usersService.assignRole(+id, updateRoleUserDto);
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Get()
    findAll() {
        console.log('Second');

        return this.usersService.findAll();
    }

    @UseGuards(RolesGuard)
    @Get('/role/:role')
    findAllByRole(@Param('role', new RoleValidationPipe()) role: string) {
        return this.usersService.findAllByRole(role);
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: string) {
        return this.usersService.findOneByID(+id);
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Patch(':id')
    update(@Param('id', new ParseDataToIntPipe()) id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.update(+id, updateUserDto);
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: string) {
        return this.usersService.remove(+id);
    }
}
