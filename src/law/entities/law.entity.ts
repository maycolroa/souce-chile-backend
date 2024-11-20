import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { LawPDF } from './law-pdfs.entity';
import { Company } from '../../company/entities/company.entity';

@Entity()
export class Law {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ nullable: true }) // Nueva propiedad para "tema"
  tema?: string;

  @Column('jsonb', { nullable: true })
  interests?: Array<{ name: string; summary: string }>;

  @Column('jsonb', { nullable: true })
  articles?: Array<{ article: number; summary: string }>;

  @OneToMany(() => LawPDF, (pdf) => pdf.law, { cascade: true })
  pdfs: LawPDF[];

  @ManyToMany(() => Company, (company) => company.laws)
  @JoinTable()
  companies: Company[];
}
