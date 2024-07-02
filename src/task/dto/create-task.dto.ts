import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsIn, IsNotEmpty, IsOptional } from 'class-validator';
import { TypeTask } from 'src/constant/enum/task.enum';

export class CreateTaskDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'The type is required' })
    @IsIn([TypeTask.COMMON, TypeTask.OTHER], { message: 'Invalid Task' })
    type: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'The name is required' })
    name: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'The description is required' })
    description: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @Transform(({ value }) => JSON.parse(value), { toClassOnly: true })
    projectIds?: number[];
}
