import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Historico, HistoricoDocument } from './schemas/historico.schema';
import { CreateHistoricoDto } from './dto/create-historico.dto';

@Injectable()
export class HistoricoService {
    constructor(
        @InjectModel(Historico.name) private readonly historicoModel: Model<HistoricoDocument>,
    ) {}

    async create(createHistoricoDto: CreateHistoricoDto): Promise<Historico> {
        const createdHistorico = new this.historicoModel(createHistoricoDto);
        return createdHistorico.save();
    }

    async findAll(): Promise<Historico[]> {
        return this.historicoModel.find().populate('userId clienteId', 'nome username').exec();
    }
}
