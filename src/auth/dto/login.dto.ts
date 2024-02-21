import {
    IsString,
    IsEmail,
    IsNotEmpty,
    Matches,
    MinLength,
    MaxLength,
  } from 'class-validator';
  
  
  export class LoginDto {

    @IsNotEmpty({ message: 'Email must not be empty!' })
    @IsEmail({}, { message: 'Email is not valid!' })
    email: string;
  
    @IsNotEmpty({ message: 'Password can not be empty!' })
    @IsString({ message: 'Password is not a string!' })
    @Matches(/^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d@$!%*?&]*$/, {
      message:
        'Password must be a mixture of letters and numbers, and symbols(optional)',
    })
    @MinLength(6)
    @MaxLength(20)
    password: string;
  
  }
  