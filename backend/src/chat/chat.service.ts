import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Mensagem, MensagemDocument } from './schemas/mensagem.schema';
import { Model } from 'mongoose';

@Injectable()
export class ChatService {
    constructor(
        @InjectModel(Mensagem.name) private mensagemModel: Model<MensagemDocument>,
    ) {}

    async sendMessage(
        atendenteId: string,
        clienteId: string,
        mensagem: string,
        tipo: 'enviada' | 'recebida',
    ): Promise<Mensagem> {
        const novaMensagem = new this.mensagemModel({
            atendente: atendenteId,
            clienteId,
            mensagem,
            tipo,
        });
        return novaMensagem.save();
    }

    async getMessages(clienteId: string): Promise<Mensagem[]> {
        return this.mensagemModel.find({ clienteId }).sort({ createdAt: 1 }).exec();
    }
}
