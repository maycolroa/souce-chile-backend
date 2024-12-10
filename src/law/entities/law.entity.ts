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

  @Column({ nullable: true }) // Tipo de norma, como Decreto, Ley, etc.
  tipo_norma?: string;

  @Column({ nullable: true }) // Número de la norma
  numero?: number;

  @Column({ nullable: true }) // Año de publicación
  año?: number;

  @Column({ nullable: true }) // Descripción corta de la norma
  descripcion_corta?: string;

  @Column({ nullable: true }) // Ente que publica la norma
  ente?: string;

  @Column({ nullable: true }) // Sistema al que pertenece la norma
  sistema?: string;

  @Column({ default: false }) // Indicador de si la norma está derogada
  derogada: boolean;

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
