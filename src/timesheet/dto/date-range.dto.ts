import { IsDateString, IsNotEmpty } from 'class-validator';

export class DateRangeDto {
    @IsNotEmpty({ message: 'The startDate is required' })
    // @IsDateString()
    startDate: string;

    @IsNotEmpty({ message: 'The startDate is required' })
    // @IsDateString()
    endDate: string;
}
