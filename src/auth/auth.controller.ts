import { Controller, Post, Body, ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  // sign up
  @Post('/register')
  async signup(@Body() signupDto: SignUpDto) { 
    const { email, password } = signupDto;
    // invoking find user service
    const userExists = await this.authService.findUserByEmail(email);
    if (userExists) {
      throw new ConflictException(
        'This email is already in use, try different one.',
      );
    }
    const hash = await this.authService.bcryptPassword(password);
    const createdUser = await this.authService.createUser(signupDto, hash);
    return {message: "user created", success: true, user: createdUser};
  }
  // login
  @Post('/login')
  async login(@Body() loginDto: LoginDto) {
    const {email} = loginDto;
    const userExists = await this.authService.findUserByEmail(email);
    if(!userExists){
      throw new NotFoundException("User not found. Please signup first!");
    }
    const {password} = loginDto;
    const passwordMatched = await this.authService.matchPassword(password, userExists.password);
    if(passwordMatched){
      const token = this.authService.assignToken(userExists._id);
      return {token, user: {name: userExists.name, id: userExists._id}};
    }else{
      throw new UnauthorizedException("You have entered invalid email or password!")
    }
  }
}
