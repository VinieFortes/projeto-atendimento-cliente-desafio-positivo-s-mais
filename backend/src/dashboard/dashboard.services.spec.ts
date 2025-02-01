// dashboard.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { DashboardService } from './dashboard.service';
import { Contato } from '../contatos/schemas/contato.schema';
import { Mensagem } from '../chat/schemas/mensagem.schema';

describe('DashboardService', () => {
    let service: DashboardService;
    let contatoModelMock: any;
    let mensagemModelMock: any;

    beforeEach(async () => {
        contatoModelMock = {
            countDocuments: jest.fn(),
            aggregate: jest.fn(),
        };

        mensagemModelMock = {
            distinct: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                DashboardService,
                {
                    provide: getModelToken(Contato.name),
                    useValue: contatoModelMock,
                },
                {
                    provide: getModelToken(Mensagem.name),
                    useValue: mensagemModelMock,
                },
            ],
        }).compile();

        service = module.get<DashboardService>(DashboardService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getDashboardStats', () => {
        it('deve retornar as estatísticas do dashboard corretamente', async () => {
            const totalContatosValue = 100;
            const abertosValue = 20;
            const finalizadosValue = 80;
            const respondidosClienteIds = ['client1', 'client2', 'client3'];
            const mediaFeedbackValue = 4.56789;
            const mediaFeedbackResult = [{ avgFeedback: mediaFeedbackValue }];

            contatoModelMock.countDocuments.mockImplementation((filter?: any) => {
                if (!filter) {
                    return { exec: jest.fn().mockResolvedValue(totalContatosValue) };
                }
                if (filter.status && filter.status.$ne === 'finalizado') {
                    return { exec: jest.fn().mockResolvedValue(abertosValue) };
                }
                if (filter.status === 'finalizado') {
                    return { exec: jest.fn().mockResolvedValue(finalizadosValue) };
                }
            });

            mensagemModelMock.distinct.mockReturnValue({
                exec: jest.fn().mockResolvedValue(respondidosClienteIds),
            });

            contatoModelMock.aggregate.mockReturnValue({
                exec: jest.fn().mockResolvedValue(mediaFeedbackResult),
            });

            const result = await service.getDashboardStats();

            const expectedResult = {
                totalContatos: totalContatosValue,
                abertos: abertosValue,
                respondidos: respondidosClienteIds.length,
                finalizados: finalizadosValue,
                mediaFeedback: parseFloat(mediaFeedbackValue.toFixed(2)),
            };

            expect(contatoModelMock.countDocuments).toHaveBeenCalledTimes(3);
            expect(mensagemModelMock.distinct).toHaveBeenCalledWith('clienteId', { tipo: 'enviada' });
            expect(contatoModelMock.aggregate).toHaveBeenCalledWith([
                { $match: { feedback: { $exists: true, $ne: null } } },
                { $group: { _id: null, avgFeedback: { $avg: '$feedback' } } },
            ]);

            expect(result).toEqual(expectedResult);
        });
    });
});
