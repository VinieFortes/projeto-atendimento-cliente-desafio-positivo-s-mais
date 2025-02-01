import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { Model } from 'mongoose';
import { ContatoDocument } from './src/contatos/schemas/contato.schema';
import { HistoricoDocument } from './src/historico/schemas/historico.schema';
import { MensagemDocument } from './src/chat/schemas/mensagem.schema';
import { UserDocument } from './src/users/schemas/user.schema';

async function bootstrap() {
    const appContext = await NestFactory.createApplicationContext(AppModule);

    // OBS: Certifique-se de usar os tokens corretos
    const contatoModel = appContext.get<Model<ContatoDocument>>('ContatoModel');
    const mensagemModel = appContext.get<Model<MensagemDocument>>('MensagemModel');
    const historicoModel = appContext.get<Model<HistoricoDocument>>('HistoricoModel');
    const userModel = appContext.get<Model<UserDocument>>('UserModel');

    // Localiza usuários existentes, ex: gestor1 e analista1
    const analista = await userModel.findOne({ username: 'analista1' });
    const gestor = await userModel.findOne({ username: 'gestor1' });

    if (!analista || !gestor) {
        console.error('Usuários analista1 ou gestor1 não encontrados.');
        process.exit(1);
    }

    const nomes = [
        'João Silva', 'Maria Oliveira', 'Pedro Santos', 'Ana Souza', 'Carla Almeida',
        'Luiz Carvalho', 'Paula Fernandes', 'Rafael Duarte', 'Camila Rocha', 'Bruno Lima',
        'Renata Lopes', 'Felipe Gonçalves', 'Juliana Castro', 'Marcos Pereira', 'Beatriz Nunes',
        'Vinicius Ribeiro', 'Aline Castro', 'Gustavo Teixeira', 'André Almeida', 'Larissa Melo'
    ];

    const canais = ['WhatsApp', 'Web Chat', 'Telegram', 'Email'];

    const mensagensCliente = [
        'Olá, preciso de ajuda com minha conta.',
        'Estou com dúvidas sobre pagamento.',
        'Não consigo acessar meu histórico.',
        'Preciso alterar meu telefone de contato.',
        'Minha assinatura está com problema.',
        'Existe algum desconto disponível?',
        'Gostaria de saber o status do meu atendimento.',
        'Estou enfrentando dificuldades para fazer login.',
        'Como posso acessar o suporte avançado?',
        'Minha fatura chegou com valor incorreto.'
    ];

    const statusHistorico = ['concluido', 'cancelado', 'pendente', 'finalizado', 'em andamento'];

    // Cria 20 contatos, cada um com ao menos 1 mensagem e 1 histórico
    for (let i = 0; i < 20; i++) {
        const randomName = nomes[i];
        const randomEmail = randomName.toLowerCase().replace(/ /g, '.') + '@exemplo.com';
        const randomTelefone = `(${Math.floor(Math.random() * 90 + 10)}) 9${Math.floor(Math.random() * 9000 + 1000)}-${Math.floor(Math.random() * 9000 + 1000)}`;
        const randomCanal = canais[Math.floor(Math.random() * canais.length)];

        // Cria contato
        const contato = new contatoModel({
            nome: randomName,
            email: randomEmail,
            telefone: randomTelefone,
            canal: randomCanal,
            status: 'aberto'
        });
        const contatoSalvo = await contato.save();

        const randomMsg = mensagensCliente[Math.floor(Math.random() * mensagensCliente.length)];
        const randomUser = Math.random() < 0.5 ? analista : gestor;

        // Cria a mensagem utilizando os IDs convertidos para string

        const novaMensagem = new mensagemModel({
            atendente: randomUser._id?.toString(),
            clienteId: contatoSalvo._id?.toString(),
            mensagem: randomMsg,
            tipo: 'recebida'
        });
        await novaMensagem.save();

        const inicioDate = new Date();
        const fimDate = new Date(inicioDate.getTime() + 1000 * 60 * (5 + Math.floor(Math.random() * 55)));

        const novoHistorico = new historicoModel({
            userId: randomUser._id?.toString(),
            clienteId: contatoSalvo._id?.toString(),
            inicio: inicioDate,
            fim: fimDate,
            status: statusHistorico[Math.floor(Math.random() * statusHistorico.length)],
            nota: Math.floor(Math.random() * 5 + 1)
        });
        await novoHistorico.save();

        console.log(`Contato, mensagem e histórico criados para: ${randomName}`);
    }

    console.log('Seeding concluído!');
    process.exit(0);
}

bootstrap().catch((error) => {
    console.error('Erro ao executar seed:', error);
    process.exit(1);
});
