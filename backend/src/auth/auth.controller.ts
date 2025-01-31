import {
    Controller,
    Post,
    Body,
    UnauthorizedException,
    Get,
    UseGuards,
    Request as NestRequest
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthenticatedRequest } from './interfaces/authenticated-request.interface'; // Caminho correto

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    // Rota para login
    @Post('login')
    async login(@Body() body: { username: string; password: string }) {
        const user = await this.authService.validateUser(body.username, body.password);
        if (!user) {
            throw new UnauthorizedException('Credenciais inválidas');
        }
        return this.authService.login(user);
    }

    // Rota para registro
    @Post('register')
    async register(@Body() body: { username: string; password: string; role: string }) {
        return this.authService.register(body.username, body.password, body.role);
    }

    // Rota protegida para obter o perfil do usuário
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async getProfile(@NestRequest() req: AuthenticatedRequest) {
        return {
            username: req.user.username,
            role: req.user.role,
        };
    }
}
