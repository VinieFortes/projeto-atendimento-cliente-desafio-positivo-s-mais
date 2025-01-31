import {Controller, ForbiddenException, Get, Req, UseGuards} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DashboardService } from './dashboard.service';

@UseGuards(JwtAuthGuard) // se você quiser proteger com JWT
@Controller('dashboard')
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) {}

    @Get()
    async getStats(@Req() req) {
        if (req.user.role !== 'gestor') {
            throw new ForbiddenException('Acesso negado. Apenas gestores podem acessar o dashboard.');
        }
        return this.dashboardService.getDashboardStats();
    }
}
