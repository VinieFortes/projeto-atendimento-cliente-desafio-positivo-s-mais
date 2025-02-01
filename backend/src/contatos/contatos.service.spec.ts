import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { ContatosService } from './contatos.service';
import { Contato } from './schemas/contato.schema';

describe('ContatosService', () => {
  let service: ContatosService;
  let contatoModelMock: any;

  beforeEach(async () => {
    contatoModelMock = jest.fn().mockImplementation((doc) => ({
      ...doc,
      save: jest.fn(),
    }));
    contatoModelMock.find = jest.fn();
    contatoModelMock.countDocuments = jest.fn();
    contatoModelMock.findById = jest.fn();
    contatoModelMock.findByIdAndUpdate = jest.fn();
    contatoModelMock.findByIdAndDelete = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContatosService,
        {
          provide: getModelToken(Contato.name),
          useValue: contatoModelMock,
        },
      ],
    }).compile();

    service = module.get<ContatosService>(ContatosService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('deve criar um novo contato e retornar o contato salvo', async () => {
      const contatoData = { nome: 'John Doe', status: 'open' };
      const savedContato = { _id: 'some-id', ...contatoData };

      const saveMock = jest.fn().mockResolvedValue(savedContato);
      contatoModelMock.mockImplementationOnce((doc) => ({
        ...doc,
        save: saveMock,
      }));

      const result = await service.create(contatoData as Contato);
      expect(contatoModelMock).toHaveBeenCalledWith(contatoData);
      expect(saveMock).toHaveBeenCalled();
      expect(result).toEqual(savedContato);
    });
  });

  describe('findAll', () => {
    it('deve retornar contatos paginados', async () => {
      const data = [
        { _id: '1', nome: 'Contact1' },
        { _id: '2', nome: 'Contact2' },
      ];
      const total = 2;
      const page = 1;
      const limit = 10;
      const skip = 0;

      const execFindMock = jest.fn().mockResolvedValue(data);
      const limitMock = jest.fn().mockReturnValue({ exec: execFindMock });
      const skipMock = jest.fn().mockReturnValue({ limit: limitMock });
      contatoModelMock.find.mockReturnValue({ skip: skipMock });

      contatoModelMock.countDocuments.mockReturnValue({
        exec: jest.fn().mockResolvedValue(total),
      });

      const result = await service.findAll(page, limit);
      expect(contatoModelMock.find).toHaveBeenCalled();
      expect(contatoModelMock.countDocuments).toHaveBeenCalled();
      expect(result).toEqual({ data, total, page, limit });
    });
  });

  describe('findOne', () => {
    it('deve retornar um contato se encontrado', async () => {
      const id = 'some-id';
      const foundContato = { _id: id, nome: 'John Doe' };

      const execMock = jest.fn().mockResolvedValue(foundContato);
      contatoModelMock.findById.mockReturnValue({ exec: execMock });

      const result = await service.findOne(id);
      expect(contatoModelMock.findById).toHaveBeenCalledWith(id);
      expect(execMock).toHaveBeenCalled();
      expect(result).toEqual(foundContato);
    });

    it('deve lançar NotFoundException se o contato não for encontrado', async () => {
      const id = 'nonexistent';
      const execMock = jest.fn().mockResolvedValue(null);
      contatoModelMock.findById.mockReturnValue({ exec: execMock });

      await expect(service.findOne(id)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('deve atualizar um contato e retornar o contato atualizado', async () => {
      const id = 'some-id';
      const updateData = { nome: 'Jane Doe' };
      const updatedContato = { _id: id, ...updateData };

      const execMock = jest.fn().mockResolvedValue(updatedContato);
      contatoModelMock.findByIdAndUpdate.mockReturnValue({ exec: execMock });

      const result = await service.update(id, updateData);
      expect(contatoModelMock.findByIdAndUpdate).toHaveBeenCalledWith(
          id,
          updateData,
          { new: true },
      );
      expect(execMock).toHaveBeenCalled();
      expect(result).toEqual(updatedContato);
    });

    it('deve lançar NotFoundException se o contato a ser atualizado não for encontrado', async () => {
      const id = 'nonexistent';
      const updateData = { nome: 'Jane Doe' };

      const execMock = jest.fn().mockResolvedValue(null);
      contatoModelMock.findByIdAndUpdate.mockReturnValue({ exec: execMock });

      await expect(service.update(id, updateData)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('deve remover um contato e retornar o contato removido', async () => {
      const id = 'some-id';
      const deletedContato = { _id: id, nome: 'John Doe' };

      const execMock = jest.fn().mockResolvedValue(deletedContato);
      contatoModelMock.findByIdAndDelete.mockReturnValue({ exec: execMock });

      const result = await service.remove(id);
      expect(contatoModelMock.findByIdAndDelete).toHaveBeenCalledWith(id);
      expect(execMock).toHaveBeenCalled();
      expect(result).toEqual(deletedContato);
    });

    it('deve lançar NotFoundException se o contato a ser removido não for encontrado', async () => {
      const id = 'nonexistent';

      const execMock = jest.fn().mockResolvedValue(null);
      contatoModelMock.findByIdAndDelete.mockReturnValue({ exec: execMock });

      await expect(service.remove(id)).rejects.toThrow(NotFoundException);
    });
  });

  describe('finalizarAtendimento', () => {
    it('deve finalizar o atendimento e retornar o contato atualizado', async () => {
      const id = 'some-id';
      const updatedContato = { _id: id, status: 'finalizado' };

      const execMock = jest.fn().mockResolvedValue(updatedContato);
      contatoModelMock.findByIdAndUpdate.mockReturnValue({ exec: execMock });

      const result = await service.finalizarAtendimento(id);
      expect(contatoModelMock.findByIdAndUpdate).toHaveBeenCalledWith(
          id,
          { status: 'finalizado' },
          { new: true },
      );
      expect(execMock).toHaveBeenCalled();
      expect(result).toEqual(updatedContato);
    });

    it('deve lançar NotFoundException se o contato a ser finalizado não for encontrado', async () => {
      const id = 'nonexistent';

      const execMock = jest.fn().mockResolvedValue(null);
      contatoModelMock.findByIdAndUpdate.mockReturnValue({ exec: execMock });

      await expect(service.finalizarAtendimento(id)).rejects.toThrow(NotFoundException);
    });
  });
});
