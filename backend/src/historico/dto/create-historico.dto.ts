import { IsNotEmpty, IsOptional, IsString, IsNumber, IsDate } from 'class-validator';
import { Types } from 'mongoose';

export class CreateHistoricoDto {
    @IsNotEmpty()
    analistaId: Types.ObjectId;

    @IsNotEmpty()
    clienteId: Types.ObjectId;

    @IsDate()
    inicio: Date;

    @IsDate()
    fim: Date;

    @IsString()
    status: string;

    @IsOptional()
    @IsNumber()
    nota?: number;
}
