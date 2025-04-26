import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true })
  authorId: string;

  @Column({ type: 'varchar', length: 500 })
  title: string;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'varchar', length: 500, nullable: true })
  coverUrl: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  postType: string;
}
