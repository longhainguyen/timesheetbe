import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsIn, IsNotEmpty } from 'class-validator';
import { StatusTimeSheet } from 'src/constant/enum/status.enum';

export class ApproveOrRejectDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'The status is required' })
    @IsIn([StatusTimeSheet.APPROVED, StatusTimeSheet.REJECTED], {
        message: 'Status must be either Approved or Rejected',
    })
    status: string;
}
