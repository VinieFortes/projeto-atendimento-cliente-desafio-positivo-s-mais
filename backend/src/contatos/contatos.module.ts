import { Module } from '@nestjs/common';
import { ContatosService } from './contatos.service';
import { ContatosController } from './contatos.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Contato, ContatoSchema } from './schemas/contato.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Contato.name, schema: ContatoSchema }]),
    AuthModule,
  ],
  controllers: [ContatosController],
  providers: [ContatosService],
  exports: [ContatosService],
})
export class ContatosModule {}
