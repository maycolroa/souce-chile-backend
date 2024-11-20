import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Law } from '../../law/entities/law.entity';

@Entity('company')
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  actividad_economica: string;

  @Column()
  nit: string;

  @ManyToMany(() => Law, (law) => law.companies, { eager: true })
  @JoinTable()
  laws: Law[];
}
