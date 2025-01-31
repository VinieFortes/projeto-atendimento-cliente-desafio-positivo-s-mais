import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import {Contato, ContatoSchema} from '../contatos/schemas/contato.schema';
import {Mensagem, MensagemSchema} from "../chat/schemas/mensagem.schema";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Contato.name, schema: ContatoSchema },
            { name: Mensagem.name, schema: MensagemSchema },
        ]),
    ],
    providers: [DashboardService],
    controllers: [DashboardController],
})
export class DashboardModule {}