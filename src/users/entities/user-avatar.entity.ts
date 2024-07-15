import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserImage {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    path: string;
}
