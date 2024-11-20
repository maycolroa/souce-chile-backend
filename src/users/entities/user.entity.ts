import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Company } from '../../company/entities/company.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Column('text', { select: false })
  password: string;

  @Column('bool', { default: true })
  isActive: boolean;

  @Column('text', { array: true, default: ['user'] })
  roles: string[];

  @ManyToOne(() => Company, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'companyId' })
  company: Company | null;
}
