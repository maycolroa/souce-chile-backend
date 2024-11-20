import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { Company } from './entities/company.entity';
import { Law } from '../law/entities/law.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Company, Law]), // Solo importa los repositorios necesarios
  ],
  controllers: [CompanyController],
  providers: [CompanyService],
  exports: [CompanyService, TypeOrmModule], // Exporta el servicio y TypeOrmModule
})
export class CompanyModule {}
