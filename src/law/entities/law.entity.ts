import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Law {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column('text', { unique: true })
  name: string;
  @Column('text')
  description: string;
  @Column()
  abstract: string;
}
