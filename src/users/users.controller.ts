import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public } from 'src/decorators/public.decorator';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/constant/enum/role.enum';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Roles([Role.ADMIN, Role.MANAGER])
    @Post()
    create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }

    @Public()
    @Get()
    findAll() {
        return this.usersService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: string) {
        return this.usersService.findOneByID(+id);
    }

    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.update(+id, updateUserDto);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: string) {
        return this.usersService.remove(+id);
    }
}
