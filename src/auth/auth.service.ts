import { Injectable } from '@nestjs/common';
import { User } from './schema/auth.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SignUpDto } from './dto/signup.dto';


@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name)
  private userModel: Model<User>,
  private jwtService: JwtService){}

  // service to find user
  async findUserByEmail(email: string){
    const user = await this.userModel.findOne({email});
    return user; 
  }
  // checks password
  async matchPassword(password:string, hash:string){
    const passwordMatched = await bcrypt.compare(password, hash);
    if(passwordMatched){
      return true;
    }
    return false;
  }
   // assign token
    assignToken(id:string){
    return this.jwtService.sign({ id }) ;
  }
  // hash password
  async bcryptPassword(password: string){
    return await bcrypt.hash(password, 10);
  }
  // creating new user
  async createUser(signupDto: SignUpDto, password:any){
    const {email, name, username} = signupDto;
    const newUser = await this.userModel.create({email, name, username, password});
    return newUser;
  }
}
