import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

class Mensagem {
    remetente: string; // por exemplo: "cliente" | "analista"
    texto: string;
    createdAt: Date;
}

@Schema({ timestamps: true }) // timestamps cria automaticamente createdAt e updatedAt
export class Atendimento {
    /**
     * Campo que referencia o cliente.
     */
    @Prop({ type: Types.ObjectId, ref: 'Contato', required: true })
    clienteId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'User' }) // Exemplo: referenciando a tabela de usuários
    atendenteId?: Types.ObjectId;

    /**
     * Status do atendimento.
     */
    @Prop({ default: 'aberto' })
    status: string;

    @Prop()
    feedback?: number;

    @Prop({
        type: [
            {
                remetente: { type: String, required: true },
                texto: { type: String, required: true },
                createdAt: { type: Date, default: Date.now },
            },
        ],
        default: [],
    })
    mensagens: Mensagem[];
}

export type AtendimentoDocument = Atendimento & Document;

export const AtendimentoSchema = SchemaFactory.createForClass(Atendimento);
