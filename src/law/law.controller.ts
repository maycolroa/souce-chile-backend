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
  async create(@Body() createLawDto: CreateLawDto) {
    const newLaw = await this.lawService.create(createLawDto);

    return {
      message: 'Ley creada exitosamente',
      law: {
        ...newLaw,
        createdAt: newLaw.createdAt,
        updatedAt: newLaw.updatedAt,
      },
    };
  }

  // Obtener todas las leyes con paginación
  @Get()
  async findAll(@Query('page') page = 1, @Query('limit') limit = 50) {
    const { laws, total } = await this.lawService.findAll(page, limit);

    // Mapear las leyes para incluir todos los nuevos atributos y un ID único en los intereses
    const mappedLaws = laws.map((law) => ({
      ...law,
      tipo_norma: law.tipo_norma,
      numero: law.numero,
      año: law.año,
      descripcion_corta: law.descripcion_corta,
      ente: law.ente,
      sistema: law.sistema,
      derogada: law.derogada,
      createdAt: law.createdAt,
      updatedAt: law.updatedAt,
      interests: law.interests.map((interest, index) => ({
        id: `${law.id}-${index}`, // Generar un ID único para cada interés
        name: interest.name,
        summary: interest.summary,
      })),
    }));

    return {
      total,
      laws: mappedLaws,
    };
  }

  // Obtener una ley por ID
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const law = await this.lawService.findOne(id);

    return {
      ...law,
      tipo_norma: law.tipo_norma,
      numero: law.numero,
      año: law.año,
      descripcion_corta: law.descripcion_corta,
      ente: law.ente,
      sistema: law.sistema,
      derogada: law.derogada,
      createdAt: law.createdAt,
      updatedAt: law.updatedAt,
    };
  }

  // Buscar leyes por interés
  @Get('interest/:interest')
  async findByInterest(@Param('interest') interest: string) {
    const laws = await this.lawService.findByInterest(interest);

    // Mapear las leyes para incluir los nuevos atributos
    return laws.map((law) => ({
      ...law,
      tipo_norma: law.tipo_norma,
      numero: law.numero,
      año: law.año,
      descripcion_corta: law.descripcion_corta,
      ente: law.ente,
      sistema: law.sistema,
      derogada: law.derogada,
      createdAt: law.createdAt,
      updatedAt: law.updatedAt,
      interests: law.interests.map((interest, index) => ({
        id: `${law.id}-${index}`,
        name: interest.name,
        summary: interest.summary,
      })),
    }));
  }

  // Eliminar una ley por ID
  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.lawService.remove(id);
    return { message: 'Ley eliminada exitosamente' };
  }
}
