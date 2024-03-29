import { UsersRepository } from './users.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor (
    @InjectRepository(UsersRepository)
    private readonly usersRepository: UsersRepository,
  ) {}

  async signUp(authCredetialsDto: AuthCredentialsDto): Promise<void> {
      await this.usersRepository.signUp(authCredetialsDto);
  }

  async signIn(authCredetialsDto: AuthCredentialsDto): Promise<{ accessToken: string }> {
    return await this.usersRepository.signIn(authCredetialsDto);
  }
}
