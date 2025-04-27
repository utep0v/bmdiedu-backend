import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  password: string;

  @Column({ type: 'varchar', length: 50, default: 'manager' })
  role: string;

  @Column({ type: 'boolean', default: false })
  isActivated: boolean;

  @Column({ type: 'uuid', nullable: true })
  activationToken: string;

  @Column({ nullable: true })
  resetToken: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  refreshToken: string;
}
