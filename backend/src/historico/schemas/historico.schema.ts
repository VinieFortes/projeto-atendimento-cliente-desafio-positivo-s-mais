import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Historico {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    userId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Contato', required: true })
    clienteId: Types.ObjectId;

    @Prop({ required: true })
    inicio: Date;

    @Prop({ required: true })
    fim: Date;

    @Prop({ required: true })
    status: string;

    @Prop()
    nota?: number;
}

export type HistoricoDocument = Historico & Document;
export const HistoricoSchema = SchemaFactory.createForClass(Historico);
