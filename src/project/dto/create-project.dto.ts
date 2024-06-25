import { IsBoolean, IsDate, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateProjectDto {
    @IsNotEmpty({ message: 'The projectName is required' })
    @Length(3, 255)
    @IsString()
    projectName: string;

    @IsNotEmpty({ message: 'The description is required' })
    @Length(3, 255)
    @IsString()
    description: string;
    inActive: boolean;
}
