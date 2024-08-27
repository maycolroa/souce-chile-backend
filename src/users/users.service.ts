import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  // metodo para crear usuarios
  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;
      const user = this.userRepository.create({
        ...userData,
        password: await bcrypt.hashSync(password, 10),
      });
      await this.userRepository.save(user);
      delete user.password;
      delete user.isActive;
      return user;
    } catch (error) {
      this.handleDBError(error);
    }
  }
  async loginUser(loginUserDto: LoginUserDto) {
    try {
      const { email, password } = loginUserDto;
      const user = await this.userRepository.findOne({
        where: { email },
        select: { password: true, email: true },
      });
      // verificar si el usuario existe
      if (!user) throw new UnauthorizedException('Usuario no encontrado');
      // verificar si la contraseña es correcta
      if (!bcrypt.compareSync(password, user.password))
        throw new UnauthorizedException('contraseña incorrecta');
      return user;
    } catch (error) {
      this.handleDBError(error);
    }
  }
  // metodo para manejar errorres de la base de datos
  private handleDBError(error: any): never {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    console.log(error);
    throw new InternalServerErrorException('Error en la base de datos');
  }
}
