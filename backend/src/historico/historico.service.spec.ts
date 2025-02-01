import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { HistoricoService } from './historico.service';
import { Historico } from './schemas/historico.schema';
import { CreateHistoricoDto } from './dto/create-historico.dto';

describe('HistoricoService', () => {
    let service: HistoricoService;

    let saveMock: jest.Mock;
    let historicoModelMock: jest.Mock & { find: jest.Mock };

    beforeEach(async () => {
        saveMock = jest.fn();

        historicoModelMock = jest.fn().mockImplementation((doc) => ({
            ...doc,
            save: saveMock,
        })) as any;

        historicoModelMock.find = jest.fn();

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                HistoricoService,
                {
                    provide: getModelToken(Historico.name),
                    useValue: historicoModelMock,
                },
            ],
        }).compile();

        service = module.get<HistoricoService>(HistoricoService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('deve criar um histórico e retornar o resultado salvo', async () => {
            const createHistoricoDto: CreateHistoricoDto = {
                userId: 'user123',
                clienteId: 'cliente456',
                descricao: 'Histórico de teste',
            } as any;

            const historicoSalvo = {
                ...createHistoricoDto,
                _id: 'algum-id',
            };

            saveMock.mockResolvedValue(historicoSalvo);

            const result = await service.create(createHistoricoDto);

            expect(historicoModelMock).toHaveBeenCalledWith(createHistoricoDto);
            expect(saveMock).toHaveBeenCalled();
            expect(result).toEqual(historicoSalvo);
        });
    });

    describe('findAll', () => {
        it('deve retornar um array de históricos', async () => {
            const historicosEsperados = [
                { _id: '1', userId: 'user1', clienteId: 'cliente1', descricao: 'Histórico 1' },
                { _id: '2', userId: 'user2', clienteId: 'cliente2', descricao: 'Histórico 2' },
            ];

            const execMock = jest.fn().mockResolvedValue(historicosEsperados);
            const populateMock = jest.fn().mockReturnValue({ exec: execMock });

            historicoModelMock.find.mockReturnValue({ populate: populateMock });

            const result = await service.findAll();

            expect(historicoModelMock.find).toHaveBeenCalled();
            expect(populateMock).toHaveBeenCalledWith('userId clienteId', 'nome username');
            expect(execMock).toHaveBeenCalled();
            expect(result).toEqual(historicosEsperados);
        });
    });
});
