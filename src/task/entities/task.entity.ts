import { TypeTask } from 'src/constant/enum/task.enum';
import { Timesheet } from 'src/timesheet/entities/timesheet.entity';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Task {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false, type: 'enum', enum: TypeTask })
    type: string;

    @Column({ nullable: false })
    name: string;

    @Column({ nullable: false })
    description: string;

    @CreateDateColumn({ nullable: false, type: 'timestamp' })
    createAt: Date;

    @UpdateDateColumn({ nullable: false, type: 'timestamp' })
    updateAt: Date;

    @OneToMany(() => Timesheet, (timesheet) => timesheet.task)
    timesheet: Timesheet[];
}
