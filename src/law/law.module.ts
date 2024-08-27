import { Module } from '@nestjs/common';
import { LawService } from './law.service';
import { LawController } from './law.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Law } from './entities/law.entity';

@Module({
  controllers: [LawController],
  providers: [LawService],
  imports: [TypeOrmModule.forFeature([Law])],
})
export class LawModule {}
