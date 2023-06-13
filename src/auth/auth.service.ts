import { UsersRepository } from './users.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor (
    @InjectRepository(UsersRepository)
    private readonly usersRepository: UsersRepository
  ) {}

  async signUp(authCredetialsDto: AuthCredentialsDto): Promise<void> {
      await this.usersRepository.createUser(authCredetialsDto);
  }
}
