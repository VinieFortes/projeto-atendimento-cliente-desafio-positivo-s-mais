import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Contato, ContatoDocument } from '../contatos/schemas/contato.schema';
import {Mensagem, MensagemDocument} from "../chat/schemas/mensagem.schema";

@Injectable()
export class DashboardService {
    constructor(
        @InjectModel(Contato.name) private readonly contatoModel: Model<ContatoDocument>,
        @InjectModel(Mensagem.name) private readonly mensagemModel: Model<MensagemDocument>,
    ) {}

    async getDashboardStats() {
        const totalContatosPromise = this.contatoModel.countDocuments().exec();

        const abertosPromise = this.contatoModel.countDocuments({ status: { $ne: 'finalizado' } }).exec();

        const respondidosPromise = this.mensagemModel.distinct('clienteId', { tipo: 'enviada' }).exec();

        const finalizadosPromise = this.contatoModel.countDocuments({ status: 'finalizado' }).exec();

        const mediaFeedbackPromise = this.contatoModel.aggregate([
            { $match: { feedback: { $exists: true, $ne: null } } },
            { $group: { _id: null, avgFeedback: { $avg: '$feedback' } } },
        ]).exec();

        const [
            totalContatos,
            abertos,
            respondidosClienteIds,
            finalizados,
            mediaFeedbackResult,
        ] = await Promise.all([
            totalContatosPromise,
            abertosPromise,
            respondidosPromise,
            finalizadosPromise,
            mediaFeedbackPromise,
        ]);

        const respondidos = respondidosClienteIds.length;

        const mediaFeedback = mediaFeedbackResult.length > 0 ? mediaFeedbackResult[0].avgFeedback : 0;

        return {
            totalContatos,
            abertos,
            respondidos,
            finalizados,
            mediaFeedback: parseFloat(mediaFeedback.toFixed(2)),
        };
    }
}
