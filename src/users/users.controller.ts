import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Método para registrar usuarios
  @Post('register')
  async registerUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.createUser(createUserDto);
  }

  // Método para iniciar sesión
  @Post('login')
  async loginUser(@Body() loginUserDto: LoginUserDto) {
    const user = await this.usersService.loginUser(loginUserDto);
    return {
      ok: true,
      user, // Incluye el ID, nombre completo y email del usuario
    };
  }
}
