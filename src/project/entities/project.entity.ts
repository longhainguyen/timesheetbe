import { Task } from 'src/task/entities/task.entity';
import { Timesheet } from 'src/timesheet/entities/timesheet.entity';
import { UserProject } from 'src/user-project/entities/user-project.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Project {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    projectName: string;

    @Column({ nullable: false })
    description: string;

    @Column({ nullable: false, default: true })
    inActive: boolean;

    @CreateDateColumn({ type: 'timestamp', nullable: false })
    createAt: Date;

    @UpdateDateColumn({ type: 'timestamp', nullable: false })
    updateAt: Date;

    @OneToMany(() => UserProject, (userProject) => userProject.project)
    userProject: UserProject[];

    @OneToMany(() => Timesheet, (timesheet) => timesheet.project)
    timesheet: Timesheet[];

    @ManyToMany(() => Task, (task) => task.projects)
    tasks: Task[];
}
