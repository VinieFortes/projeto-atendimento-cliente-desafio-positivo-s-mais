import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HistoricoController } from './historico.controller';
import { HistoricoService } from './historico.service';
import { Historico, HistoricoSchema } from './schemas/historico.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Historico.name, schema: HistoricoSchema }]),
    ],
    controllers: [HistoricoController],
    providers: [HistoricoService],
    exports: [HistoricoService],
})
export class HistoricoModule {}
