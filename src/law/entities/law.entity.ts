import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
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

  @Column({ nullable: true }) // Propiedad para almacenar el tema
  tema?: string;

  @Column('jsonb', { nullable: true }) // Lista de intereses con nombre y resumen
  interests?: Array<{ name: string; summary: string }>;

  @Column('jsonb', { nullable: true }) // Lista de artículos con número y resumen
  articles?: Array<{ article: number; summary: string }>;

  @OneToMany(() => LawPDF, (pdf) => pdf.law, { cascade: true })
  pdfs: LawPDF[];

  @ManyToMany(() => Company, (company) => company.laws)
  @JoinTable() // Tabla intermedia para la relación many-to-many con empresas
  companies: Company[];

  @CreateDateColumn({ type: 'timestamp' }) // Fecha de creación, manejada automáticamente
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' }) // Fecha de última actualización, manejada automáticamente
  updatedAt: Date;
}
