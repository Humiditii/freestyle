import { HttpException, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SignInAuthDto, SignupAuthDto } from './dto/auth.dto';
// import { UpdateAuthDto } from './dto/update-auth.dto';
import { Auth, AuthDocument } from './schema/auth.schema';
import {Err} from '../common/interfaces/interfaces';
import {hashSync,genSaltSync,compareSync} from 'bcrypt';
import { JwtService } from "@nestjs/jwt";
import { JwtPayload } from 'src/guard/gaurd.interface';
import { Role } from 'src/guard/interface/role.enum';


@Injectable()
export class AuthService {

  constructor(
    @InjectModel(Auth.name) private authModel:Model<AuthDocument>,
    private jwtService: JwtService
  ){}

  private readonly ISE: string = 'Internal server error';

  async signup(signupDto:SignupAuthDto):Promise<{user:Partial<Auth>, token:string}>{
    try {
      const user = await this.authModel.findOne({email:signupDto.email})
      if(user && user.verified === true ){
        const err:Err = {
          message: 'Please proceed to login, account already exist',
          status: 400
        }

        throw new HttpException(err.message, err.status)
      }
      if(user && user.verified === false ){
        const err:Err = {
          message: 'Please request for account verification!',
          status: 400
        }

        throw new HttpException(err.message, err.status)
      }

      signupDto.password = hashSync(signupDto.password, genSaltSync())
      const newUser = await this.authModel.create(signupDto)

      // generate jwt token
      const payload:JwtPayload = {
        userId:newUser._id,
        role: newUser.role
      }

      return {
        user: newUser,
        token: this.jwtService.sign(payload)
      }

    } catch (error) {
      throw new HttpException(error?.message ? error.message : this.ISE,
        error?.status ? error.status : 500)
    }
  }

  async signin(signinDto:SignInAuthDto):Promise<object>{
    try {
      const user = await this.authModel.findOne({email:signinDto.email}).lean()

      if(!user){
        const err:Err = {message:'Invalid Email chief!',status:400}
        throw new HttpException(err.message, err.status) 
      }

      if(!compareSync(signinDto.password,user.password)){
        const err:Err = {message:'Invalid Password supplied!',status:400}
        throw new HttpException(err.message, err.status)
      }

      // generate jwt token
      const payload:JwtPayload = {
        userId:user._id,
        role: user.role
      }

      // token
      return {
        token:this.jwtService.sign(payload),
        user:{
          firstname:user?.firstname ?? '',
          lastname: user?.lastname ?? ''
        }
      }

    } catch (error) {
      throw new HttpException(error?.message ? error.message : this.ISE,
        error?.status ? error.status : 500)
    }
  }

  async checkIfVerified(userId:string):Promise<boolean>{
    try {
      const {verified} = await this.authModel.findById(userId)
      return verified
    } catch (error) {
      throw new HttpException(error?.message ? error.message : this.ISE,
        error?.status ? error.status : 500)
    }
  }

  async checkProfile():Promise<any>{}

  async deleteProfile():Promise<any>{}

  async resetPassword():Promise<any>{
    try {
      
    } catch (error) {
      throw new HttpException(error?.message ? error.message : this.ISE,
        error?.status ? error.status : 500)
    }
  }

}
