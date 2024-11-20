import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LawService } from './law.service';
import { LawController } from './law.controller';
import { Law } from './entities/law.entity';
import { LawPDF } from './entities/law-pdfs.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Law, LawPDF])],
  controllers: [LawController],
  providers: [LawService],
  exports: [TypeOrmModule], // Exporta para que otros módulos puedan acceder a LawRepository
})
export class LawModule {}
