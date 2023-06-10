import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class AuthCredentialsDto {
  @IsString()
  @MinLength(4)
  @MaxLength(32)
  username: string;

  @IsString()
  @MinLength(8)
  @MaxLength(64)
  // Password will contain at least upper case letter
  // Password will contain at least lower case letter
  // Password will contain at lest number or special character
  // In this regex is not lenght validation (defined upper)
  @Matches(/((?=.*\d)|(?=.*\W))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, 
  {message: 'Password must contains at least 1 upper case, 1 lowercase and 1 number or special character'})
  password: string;
}