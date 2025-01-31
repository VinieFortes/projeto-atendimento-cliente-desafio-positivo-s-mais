import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { HistoricoService } from './historico.service';
import { CreateHistoricoDto } from './dto/create-historico.dto';

@UseGuards(JwtAuthGuard)
@Controller('historico-atendimentos')
export class HistoricoController {
    constructor(private readonly historicoService: HistoricoService) {}

    @Post()
    async create(@Body() createHistoricoDto: CreateHistoricoDto) {
        return this.historicoService.create(createHistoricoDto);
    }

    @Get()
    async findAll() {
        return this.historicoService.findAll();
    }
}
