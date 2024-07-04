import { IsDateString, IsNotEmpty } from 'class-validator';

export class FindByDateDto {
    @IsNotEmpty({ message: 'The date is required' })
    @IsDateString()
    date: string;
}
