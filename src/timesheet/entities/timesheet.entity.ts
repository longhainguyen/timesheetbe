import { StatusTimeSheet } from 'src/constant/enum/status.enum';
import { Project } from 'src/project/entities/project.entity';
import { Task } from 'src/task/entities/task.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Timesheet {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    workingTime: number;

    @Column({ nullable: false, type: 'enum', enum: StatusTimeSheet })
    status: string;

    @ManyToOne(() => Project, (project) => project.timesheet)
    project: Project;

    @ManyToOne(() => User, (user) => user.timesheet)
    user: User;

    @ManyToOne(() => Task, (task) => task.timesheet)
    task: Task;

    @CreateDateColumn({ type: 'timestamp', nullable: false })
    createAt: Date;

    @UpdateDateColumn({ type: 'timestamp', nullable: false })
    updateAt: Date;
}
