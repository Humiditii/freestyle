import { Controller, Get, Post, Body, Patch, Param, Delete, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/guard/jwt.guard';
import { AuthService } from './auth.service';
import { SignInAuthDto, SignupAuthDto } from './dto/auth.dto';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async signupUser(
    @Body() signupUserDto:SignupAuthDto,
    @Res() res:Response
  ):Promise<Response>{
    const data = await this.authService.signup(signupUserDto)
    return res.status(200).json({
      message:'New user created',
      data: data
    })
  }

  @Post('/signin')
  async signin(
    @Body() signinDto:SignInAuthDto,
    @Res() res:Response
  ):Promise<Response>{
    const data = await this.authService.signin(signinDto)
    return res.status(200).json({
      message:'User logged in!',
      data: data
    })
  }

  @Get('/check-verify/:userId')
  @UseGuards(JwtAuthGuard)
  async checkVerify(
    @Param('userId') userId:string,
    @Res() res:Response
  ):Promise<Response>{
    const verification = await this.authService.checkIfVerified(userId)
    return res.status(200).json({
      message:'Done',
      data: {verification}
    })
  }


}
