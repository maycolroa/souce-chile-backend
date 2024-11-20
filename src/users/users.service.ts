import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto';
import { Company } from 'src/company/entities/company.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  // Método para crear usuarios
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { fullName, email, password, companyId } = createUserDto;

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User();
    user.fullName = fullName;
    user.email = email;
    user.password = hashedPassword;

    // Si companyId está presente, busca la empresa y asóciala al usuario
    if (companyId) {
      const company = await this.companyRepository.findOne({
        where: { id: companyId },
      });
      if (!company) {
        throw new NotFoundException('Company not found');
      }
      user.company = company;
    }

    return this.userRepository.save(user);
  }

  // Método para iniciar sesión
  async loginUser(loginUserDto: LoginUserDto) {
    try {
      const { email, password } = loginUserDto;
      const user = await this.userRepository.findOne({
        where: { email },
        select: { id: true, fullName: true, email: true, password: true }, // Incluye fullName en la consulta
      });

      // Verificar si el usuario existe
      if (!user) throw new UnauthorizedException('Usuario no encontrado');

      // Verificar si la contraseña es correcta
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Contraseña incorrecta');
      }

      // Retornar solo los datos necesarios
      return {
        id: user.id,
        name: user.fullName,
        email: user.email,
      };
    } catch (error) {
      this.handleDBError(error);
    }
  }

  // Método para manejar errores de la base de datos
  private handleDBError(error: any): never {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    console.log(error);
    throw new InternalServerErrorException('Error en la base de datos');
  }
}
