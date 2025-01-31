import {
    Controller,
    Post,
    Body,
    Get,
    UseGuards,
    Request,
    Param,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService) {}

    @UseGuards(JwtAuthGuard)
    @Post('send')
    async sendMessage(
        @Request() req,
        @Body() body: { clienteId: string; mensagem: string },
    ) {
        const atendenteId = req.user.userId;
        const { clienteId, mensagem } = body;

        // Enviar mensagem do atendente
        const sentMessage = await this.chatService.sendMessage(
            atendenteId,
            clienteId,
            mensagem,
            'enviada',
        );

        // Simular resposta do cliente
        const respostaCliente = `Resposta simulada para: ${mensagem}`;
        const receivedMessage = await this.chatService.sendMessage(
            atendenteId,
            clienteId,
            respostaCliente,
            'recebida',
        );

        return {
            sentMessage,
            receivedMessage,
        };
    }

    @UseGuards(JwtAuthGuard)
    @Get('messages/:clienteId')
    async getMessages(@Param('clienteId') clienteId: string) {
        return this.chatService.getMessages(clienteId);
    }
}
