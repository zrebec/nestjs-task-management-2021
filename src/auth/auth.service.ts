import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Injectable()
export class AuthService {
  constructor (
    @InjectRepository(UsersRepository)
    private readonly usersRepository: UsersRepository
  ) {}

  async signUp(authCredetialsDto: AuthCredentialsDto): Promise<void> {
    return this.usersRepository.createUser(authCredetialsDto);
  }
}
