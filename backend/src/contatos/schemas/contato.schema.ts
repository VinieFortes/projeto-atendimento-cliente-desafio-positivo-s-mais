import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Contato {
    @Prop({ required: true })
    nome: string;

    @Prop({ required: true })
    email: string;

    @Prop({ required: true })
    telefone: string;

    @Prop({ required: true })
    canal: string; // Ex: Web Chat, WhatsApp, Telegram

    @Prop({ default: 'aberto' })
    status: string;
    @Prop()
    feedback?: number;
}

export type ContatoDocument = Contato & Document;

export const ContatoSchema = SchemaFactory.createForClass(Contato);
