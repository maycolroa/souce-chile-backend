import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Law } from './law.entity';

@Entity()
export class LawPDF {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true }) // URL es opcional
  url?: string;

  @ManyToOne(() => Law, (law) => law.pdfs, { onDelete: 'CASCADE' })
  law: Law;
}
