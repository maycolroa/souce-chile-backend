import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateActivityDto } from './dto/create-activity.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Activity } from './entities/activity.entity';

@Injectable()
export class ActivityService {
  //log para manejar lo errores y verlos desde consola
  private readonly logger = new Logger('ActivityService');
  constructor(
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,
  ) {}
  // metodo para crear actividad de empresa
  // ya funciona y se guarda
  async create(createActivityDto: CreateActivityDto) {
    try {
      const activity = this.activityRepository.create(createActivityDto);
      await this.activityRepository.save(activity);
      return activity;
    } catch (error) {
      this.handleException(error);
    }
  }
  //metodo para manejar errores
  private handleException(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    this.logger.error(error); // Corrección aquí
    throw new InternalServerErrorException('Error al crear la actividad');
  }
}
