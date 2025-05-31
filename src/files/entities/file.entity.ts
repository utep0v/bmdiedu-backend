import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('files')
export class FileEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  filename: string;

  @Column({ nullable: true })
  path: string;

  @CreateDateColumn()
  createdAt: Date;
}
