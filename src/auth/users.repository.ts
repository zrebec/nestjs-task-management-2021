import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { User } from './user.entity';
import { DataSource, Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt';

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

  async loginUser(authCredetialsDto: AuthCredentialsDto): Promise<string> {
    const { username, password } = authCredetialsDto;
    const user = await this.findOneBy({username});

    if(user && (await bcrypt.compare(password, user.password))) {
      return 'success';
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }

    
  }
}