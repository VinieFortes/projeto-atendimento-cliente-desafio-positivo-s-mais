import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './configuration';
import * as Joi from 'joi';
import { ContatosModule } from './contatos/contatos.module';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import {DashboardModule} from "./dashboard/dashboard.module";
import {HistoricoModule} from "./historico/historico.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().uri().required(),
        JWT_SECRET: Joi.string().min(8).required(),
      }),
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('mongodb.uri'),
      }),
    }),
    ContatosModule,
    AuthModule,
    ChatModule,
    DashboardModule,
    HistoricoModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
