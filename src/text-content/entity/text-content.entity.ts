import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class TextContent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  content: string;
}