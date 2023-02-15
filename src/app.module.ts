import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './guard/jwt.strategy';
import {ProductModule} from './product/product.module'

@Module({
  imports: [
    AuthModule, 
    ProductModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService:ConfigService) => ({
          secret: configService.get('JWT_SECRET')
      }),
      inject: [ConfigService]
    }),
    MongooseModule.forRootAsync({
      imports:[ConfigModule],
      inject:[ConfigService],
      useFactory: async (config:ConfigService) => ({
        uri:config.get<string>('DB_URL')
      })
    }),
    ConfigModule.forRoot(
      {
        envFilePath:'.env',
        isGlobal:true
      }
      ),
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategy],
})
export class AppModule {}
