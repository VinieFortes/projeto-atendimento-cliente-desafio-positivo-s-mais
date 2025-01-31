import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MensagemDocument = Mensagem & Document;

@Schema({ timestamps: true })
export class Mensagem {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    atendente: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Contato', required: true })
    clienteId: Types.ObjectId;

    @Prop({ required: true })
    mensagem: string;

    @Prop({ required: true, enum: ['enviada', 'recebida'] })
    tipo: 'enviada' | 'recebida';
}

export const MensagemSchema = SchemaFactory.createForClass(Mensagem);
