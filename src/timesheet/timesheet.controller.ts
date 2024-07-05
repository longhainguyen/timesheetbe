import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Request, UseGuards } from '@nestjs/common';
import { TimesheetService } from './timesheet.service';
import { CreateTimesheetDto } from './dto/create-timesheet.dto';
import { UpdateTimesheetDto } from './dto/update-timesheet.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DateRangeDto } from './dto/date-range.dto';
import { FindByDateDto } from './dto/day.dto';
import { HttpExceptionFilter } from 'src/filter/http-exception.filter';
import { ParseDataToIntPipe } from 'src/pipe/parse-int.pipe';
import { TimesheetOwnerGuard } from './timesheet.guard';
import { ApproveOrRejectDto } from './dto/approve-or-reject.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/users/roles.guard';
import { Role } from 'src/constant/enum/role.enum';

@ApiTags('timesheet')
@ApiBearerAuth('JWT-auth')
@Controller('timesheet')
// @UseFilters(new HttpExceptionFilter())
export class TimesheetController {
    constructor(private readonly timesheetService: TimesheetService) {}

    @Post()
    async create(@Request() req, @Body() createTimesheetDto: CreateTimesheetDto) {
        return await this.timesheetService.create(req, createTimesheetDto);
    }

    @Get('date-range')
    async findByDateRange(@Query() dateRangeDto: DateRangeDto) {
        return await this.timesheetService.findByDateRange(dateRangeDto);
    }

    @Get('by-date')
    async findByDate(@Query() findByDateDto: FindByDateDto) {
        return await this.timesheetService.findByDay(findByDateDto);
    }

    @UseGuards(TimesheetOwnerGuard)
    @Patch(':id')
    async update(@Request() req, @Param('id') id: string, @Body() updateTimesheetDto: UpdateTimesheetDto) {
        return await this.timesheetService.update(req, +id, updateTimesheetDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.timesheetService.remove(+id);
    }

    @UseGuards(TimesheetOwnerGuard)
    @Patch('submit/:id')
    async summitTimesheet(@Param('id', ParseDataToIntPipe) id: string) {
        return await this.timesheetService.summitTimesheet(+id);
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN, Role.MANAGER)
    @Patch('timesheet-review/:id')
    async approveOrReject(@Param('id', ParseDataToIntPipe) id: string, @Body() approveOrRejectDto: ApproveOrRejectDto) {
        return await this.timesheetService.approveOrReject(+id, approveOrRejectDto);
    }
}
