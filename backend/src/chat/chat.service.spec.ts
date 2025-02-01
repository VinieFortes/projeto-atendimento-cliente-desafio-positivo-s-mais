import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ChatService } from './chat.service';
import { Mensagem } from './schemas/mensagem.schema';

describe('ChatService', () => {
  let service: ChatService;
  let mensagemModelMock: any;

  beforeEach(async () => {
    mensagemModelMock = jest.fn().mockImplementation((doc) => ({
      ...doc,
      save: jest.fn(),
    }));

    mensagemModelMock.find = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatService,
        {
          provide: getModelToken(Mensagem.name),
          useValue: mensagemModelMock,
        },
      ],
    }).compile();

    service = module.get<ChatService>(ChatService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('sendMessage', () => {
    it('deve criar uma nova mensagem e salvar o registro', async () => {
      const atendenteId = 'atendente123';
      const clienteId = 'cliente123';
      const mensagemTexto = 'Olá, tudo bem?';
      const tipo = 'enviada';
      const mensagemSalva = {
        _id: 'mensagem-id',
        atendente: atendenteId,
        clienteId,
        mensagem: mensagemTexto,
        tipo,
      };

      const saveMock = jest.fn().mockResolvedValue(mensagemSalva);
      mensagemModelMock.mockImplementationOnce((doc) => ({
        ...doc,
        save: saveMock,
      }));

      const result = await service.sendMessage(atendenteId, clienteId, mensagemTexto, tipo);

      expect(mensagemModelMock).toHaveBeenCalledWith({
        atendente: atendenteId,
        clienteId,
        mensagem: mensagemTexto,
        tipo,
      });
      expect(saveMock).toHaveBeenCalled();
      expect(result).toEqual(mensagemSalva);
    });
  });

  describe('getMessages', () => {
    it('deve retornar uma lista de mensagens ordenadas por createdAt', async () => {
      const clienteId = 'cliente123';
      const mensagensEsperadas = [
        { _id: '1', atendente: 'atendente1', clienteId, mensagem: 'Primeira mensagem', createdAt: new Date('2025-01-01T00:00:00Z') },
        { _id: '2', atendente: 'atendente1', clienteId, mensagem: 'Segunda mensagem', createdAt: new Date('2025-01-02T00:00:00Z') },
      ];

      const execMock = jest.fn().mockResolvedValue(mensagensEsperadas);
      const sortMock = jest.fn().mockReturnValue({ exec: execMock });
      mensagemModelMock.find.mockReturnValue({ sort: sortMock });


      const result = await service.getMessages(clienteId);

      expect(mensagemModelMock.find).toHaveBeenCalledWith({ clienteId });
      expect(sortMock).toHaveBeenCalledWith({ createdAt: 1 });
      expect(execMock).toHaveBeenCalled();
      expect(result).toEqual(mensagensEsperadas);
    });
  });
});
