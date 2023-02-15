import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Auth, AuthSchema } from './schema/auth.schema';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports:[
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService:ConfigService) => ({
          secret: configService.get('JWT_SECRET')
      }),
      inject: [ConfigService]
    }),
    MongooseModule.forFeature([
      {name:Auth.name, schema:AuthSchema}
    ]),
  ]
})
export class AuthModule {}
