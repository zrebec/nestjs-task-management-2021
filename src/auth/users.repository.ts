import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { User } from './user.entity';
import { DataSource, Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Injectable()
export class UsersRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async createUser(authCredetialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredetialsDto;

    const user = this.create({ username, password });
    try {
      await this.save(user);
    } catch (error) {
      // Duplicate username
      if (error.code === '23505') {
        console.log(error);
        throw new ConflictException(`Username "${username}" already exists`);
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}