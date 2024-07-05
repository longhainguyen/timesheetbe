import { IsNotEmpty } from 'class-validator';

export class CreateClientDto {
    @IsNotEmpty({ message: 'The clientName is required' })
    clientName: string;

    @IsNotEmpty({ message: 'The contactInfo is required' })
    contactInfo: string;
}
