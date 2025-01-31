import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Contato } from './schemas/contato.schema';
import { Model } from 'mongoose';

@Injectable()
export class ContatosService {
    constructor(@InjectModel(Contato.name) private contatoModel: Model<Contato>) {}


    async create(contato: Contato): Promise<Contato> {
        const newContato = new this.contatoModel(contato);
        return newContato.save();
    }

    async findAll(page: number = 1, limit: number = 10): Promise<{ data: Contato[]; total: number; page: number; limit: number }> {
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.contatoModel.find().skip(skip).limit(limit).exec(),
            this.contatoModel.countDocuments().exec(),
        ]);

        return {
            data,
            total,
            page,
            limit,
        };
    }

    async findOne(id: string): Promise<Contato> {
        const contato = await this.contatoModel.findById(id).exec();
        if (!contato) {
            throw new NotFoundException('Contato não encontrado');
        }
        return contato;
    }

    async update(id: string, contato: Partial<Contato>): Promise<Contato> {
        const updatedContato = await this.contatoModel.findByIdAndUpdate(id, contato, { new: true }).exec();
        if (!updatedContato) {
            throw new NotFoundException('Contato não encontrado');
        }
        return updatedContato;
    }

    async remove(id: string): Promise<Contato> {
        const deletedContato = await this.contatoModel.findByIdAndDelete(id).exec();
        if (!deletedContato) {
            throw new NotFoundException('Contato não encontrado');
        }
        return deletedContato;
    }

    async finalizarAtendimento(id: string): Promise<Contato> {
        const updatedContato = await this.contatoModel
            .findByIdAndUpdate(id, { status: 'finalizado' }, { new: true })
            .exec();

        if (!updatedContato) {
            throw new NotFoundException('Contato não encontrado');
        }
        return updatedContato;
    }
}
