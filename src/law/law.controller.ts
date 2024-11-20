import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { LawService } from './law.service';
import { CreateLawDto } from './dto/create-law.dto';

@Controller('law')
export class LawController {
  constructor(private readonly lawService: LawService) {}

  // Crear una nueva ley
  @Post()
  create(@Body() createLawDto: CreateLawDto) {
    return this.lawService.create(createLawDto);
  }

  // Obtener todas las leyes con paginación
  @Get()
  findAll(@Query('page') page = 1, @Query('limit') limit = 50) {
    return this.lawService.findAll(page, limit);
  }

  // Obtener una ley por ID
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.lawService.findOne(id);
  }

  // Buscar leyes por interés
  @Get('interest/:interest')
  findByInterest(@Param('interest') interest: string) {
    return this.lawService.findByInterest(interest);
  }

  // Eliminar una ley por ID
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.lawService.remove(id);
  }
}
