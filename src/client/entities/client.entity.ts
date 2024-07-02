import { User } from 'src/users/entities/user.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Client {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    clientName: string;

    @Column({ nullable: false })
    contactInfo: string;

    @CreateDateColumn({ type: 'timestamp', nullable: false })
    createAt: Date;

    @UpdateDateColumn({ type: 'timestamp', nullable: false })
    updateAt: Date;

    @ManyToOne(() => User, (user) => user.client)
    user: User;
}
