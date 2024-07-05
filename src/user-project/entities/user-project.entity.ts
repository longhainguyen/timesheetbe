import { Project } from 'src/project/entities/project.entity';
import { User } from 'src/users/entities/user.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    Unique,
    UpdateDateColumn,
} from 'typeorm';

@Entity()
@Unique(['user', 'project'])
export class UserProject {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({ nullable: false, type: 'timestamp' })
    createAt: Date;

    @UpdateDateColumn({ nullable: false, type: 'timestamp' })
    updateAt: Date;

    @ManyToOne(() => User, (user) => user.userProject)
    @JoinColumn({ name: 'userId' })
    user: User;

    @ManyToOne(() => Project, (project) => project.userProject)
    @JoinColumn({ name: 'projectId' })
    project: Project;
}
