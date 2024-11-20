import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Company } from './entities/company.entity';
import { Law } from '../law/entities/law.entity';
import { CreateCompanyDto } from './dto/create-company.dto';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    @InjectRepository(Law)
    private readonly lawRepository: Repository<Law>,
  ) {}

  // Crear una nueva empresa
  async create(createCompanyDto: CreateCompanyDto): Promise<Company> {
    const newCompany = this.companyRepository.create({
      name: createCompanyDto.name,
      actividad_economica: createCompanyDto.actividad_economica,
      nit: createCompanyDto.nit,
    });
    return this.companyRepository.save(newCompany);
  }

  // Obtener todas las empresas con sus leyes asignadas
  async findCompanyWithLaws(companyId: string): Promise<Company> {
    return this.companyRepository.findOne({
      where: { id: companyId },
      relations: ['laws'],
    });
  }

  // Asignar una lista específica de leyes a una empresa
  async assignLawsToCompany(
    empresaId: string,
    lawIds: string[],
  ): Promise<Company> {
    const empresa = await this.companyRepository.findOne({
      where: { id: empresaId },
      relations: ['laws'],
    });

    if (!empresa) {
      throw new NotFoundException(`Empresa con ID ${empresaId} no encontrada`);
    }

    const laws = await this.lawRepository.find({
      where: { id: In(lawIds) },
    });

    empresa.laws = laws;
    return this.companyRepository.save(empresa);
  }
}
