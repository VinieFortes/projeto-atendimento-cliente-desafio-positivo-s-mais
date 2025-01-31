import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Put,
    Delete,
    UseGuards,
    Query,
    ParseIntPipe,
    DefaultValuePipe
} from '@nestjs/common';
import { ContatosService } from './contatos.service';
import { Contato } from './schemas/contato.schema';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';


@UseGuards(JwtAuthGuard)
@Controller('contatos')
export class ContatosController {
    constructor(private readonly contatosService: ContatosService) {}

    @Put(':id/finalizar')
    async finalizarAtendimento(@Param('id') id: string) {
        return this.contatosService.finalizarAtendimento(id);
    }

    @Post()
    async create(@Body() contato: Contato) {
        return this.contatosService.create(contato);
    }

    @Get()
    async findAll(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
    ) {
        return this.contatosService.findAll(page, limit);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.contatosService.findOne(id);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() contato: Partial<Contato>) {
        return this.contatosService.update(id, contato);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.contatosService.remove(id);
    }
}
