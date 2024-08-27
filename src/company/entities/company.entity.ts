import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column('text', { unique: true })
  name: string;
  @Column('text')
  description: string;
  @Column('text', { unique: true })
  nit: string;
}
