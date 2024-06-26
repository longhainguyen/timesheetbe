import { Exclude } from 'class-transformer';
import { Branch } from 'src/constant/enum/branch.enum';
import { Role } from 'src/constant/enum/role.enum';
import { UserProject } from 'src/user-project/entities/user-project.entity';
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToMany,
    JoinTable,
    OneToMany,
} from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false, unique: true })
    userName: string;

    @Column({ nullable: false, unique: true })
    email: string;

    @Exclude()
    @Column({ nullable: false })
    password: string;

    @Column({ nullable: true, type: 'enum', enum: Role })
    role: string;

    @Column({ nullable: true, type: 'enum', enum: Branch })
    branch: string;

    @Column({ nullable: false, default: true })
    isActive: boolean;

    @CreateDateColumn({ nullable: false, type: 'timestamp' })
    createAt: Date;

    @UpdateDateColumn({ nullable: false, type: 'timestamp' })
    updateAt: Date;

    @OneToMany(() => UserProject, (userProject) => userProject.user)
    userProject: UserProject[];
}
