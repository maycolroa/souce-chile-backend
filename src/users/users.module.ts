import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CompanyModule } from '../company/company.module'; // Importa CompanyModule

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    TypeOrmModule.forFeature([User]),
    CompanyModule, // Asegúrate de importar CompanyModule aquí
  ],
  exports: [TypeOrmModule],
})
export class UsersModule {}
