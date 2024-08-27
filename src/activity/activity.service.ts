import { Injectable } from '@nestjs/common';
import { CreateActivityDto } from './dto/create-activity.dto';

@Injectable()
export class ActivityService {
  create(createActivityDto: CreateActivityDto) {
    return 'This action adds a new activity';
  }
}
