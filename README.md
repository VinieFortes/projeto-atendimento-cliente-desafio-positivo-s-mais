# 🛠️ Sistema de Atendimento ao Cliente

Este repositório contém a implementação do **backend** e **frontend** do sistema de atendimento ao cliente, desenvolvido como parte do **Desafio Técnico - Positivo S+**.

## 🧠 **Acesso para Testes**
Como não há opção para criar conta pela interface, utilize as seguintes credenciais para testes:

- **Analista**:
   - **Usuário**: `analista1`
   - **Senha**: `senha123`
- **Gestor**:
   - **Usuário**: `gestor1`
   - **Senha**: `senha123`


## 🚀 Tecnologias Utilizadas

### **Backend**
- **NestJS** - Framework Node.js para aplicações escaláveis.
- **MongoDB (Atlas)** - Banco de dados NoSQL utilizado para armazenar contatos, usuários e histórico de mensagens.
- **Mongoose** - ODM para modelagem e manipulação de dados MongoDB.
- **JWT (JSON Web Token)** - Autenticação baseada em token.
- **bcrypt** - Criptografia de senhas.
- **ConfigModule** - Gerenciamento de variáveis de ambiente.

### **Frontend**
- **Angular 19** - Framework para desenvolvimento de aplicações web.
- **Angular Material** - Biblioteca de componentes UI para design moderno.
- **ng2-charts & Chart.js** - Geração de gráficos dinâmicos.
- **RxJS** - Gerenciamento de estados assíncronos.
- **SCSS** - Estilização do frontend.
---

## 📐 Arquitetura do Projeto

O projeto segue **Clean Architecture** e **modularização**, garantindo **baixo acoplamento** e **alta coesão** entre os módulos. O código é estruturado da seguinte forma:

```
📂 backend/
│── 📂 src/
│   │── 📂 auth/              # Autenticação e geração de JWT
│   │── 📂 contatos/          # CRUD de contatos
│   │── 📂 chat/              # Mensagens e chat
│   │── 📂 dashboard/         # Estatísticas e métricas de atendimento
│   │── 📂 historico/         # Histórico de atendimentos
│   │── 📂 users/             # Gestão de usuários e roles
│   │── 📜 app.module.ts      # Módulo principal do NestJS
│   │── 📜 main.ts            # Ponto de entrada da aplicação

📂 frontend/
│── 📂 src/
│   │── 📂 app/
│   │   │── 📂 auth/             # Login e autenticação
│   │   │── 📂 chat/             # Módulo de chat
│   │   │── 📂 dashboard/        # Painel de estatísticas
│   │   │── 📂 contatos/         # Gerenciamento de contatos
│   │   │── 📜 app.component.ts  # Componente raiz da aplicação
│   │   │── 📜 app.routes.ts     # Configuração de rotas
```

Cada módulo encapsula **controllers**, **services** e **schemas** no backend e **componentes**, **services** e **módulos** no frontend, tornando o código **escalável e reutilizável**.

---

## 🔑 Autenticação e Segurança (JWT)

A API implementa **autenticação baseada em tokens JWT**, protegendo **endpoints sensíveis**.

### 📌 Processo de Autenticação:
1. O usuário faz **login** enviando `username` e `password`.
2. Se as credenciais forem válidas:
    - A senha é **criptografada** com `bcrypt`.
    - Um **JWT** é gerado e retornado no **response**.
3. O **token** deve ser enviado no **header Authorization** para acessar rotas protegidas.

### 📌 Exemplo de Cabeçalho de Requisição:
```http
Authorization: Bearer <TOKEN_JWT>
```

---

## 📡 Endpoints da API

### 🔐 **Autenticação**

| Método | Endpoint | Descrição |
|---------|----------|-------------|
| `POST`  | `/auth/login` | Autentica o usuário e retorna um **JWT** |
| `GET`   | `/auth/profile` | Retorna os dados do usuário autenticado |

### 📞 **Contatos (clientes)**

| Método | Endpoint | Descrição |
|---------|----------|-------------|
| `POST`  | `/contatos` | Cria um novo contato |
| `GET`   | `/contatos` | Lista todos os contatos (paginação disponível) |
| `GET`   | `/contatos/:id` | Retorna os detalhes de um contato específico |
| `PUT`   | `/contatos/:id` | Atualiza um contato |
| `DELETE`| `/contatos/:id` | Remove um contato |

### 💬 **Chat (mensagens)**

| Método | Endpoint | Descrição |
|---------|----------|-------------|
| `POST`  | `/chat/send` | Envia uma mensagem para o cliente |
| `GET`   | `/chat/messages/:clienteId` | Retorna o histórico de mensagens de um cliente |

### 📊 **Dashboard**

| Método | Endpoint | Descrição |
|---------|----------|-------------|
| `GET`   | `/dashboard/stats` | Retorna métricas do sistema (total de atendimentos, mensagens enviadas, etc.) |

### 📜 **Histórico de Atendimentos**

| Método | Endpoint | Descrição |
|---------|----------|-------------|
| `POST`  | `/historico` | Registra um novo histórico de atendimento |
| `GET`   | `/historico` | Lista todos os atendimentos finalizados |

### 🧑‍💻 **Usuários**

| Método | Endpoint | Descrição |
|---------|----------|-------------|
| `POST`  | `/users` | Cria um novo usuário (somente **gestores**) |
| `GET`   | `/users/:username` | Retorna os detalhes de um usuário |

---

## ⚙️ Configuração e Execução

### 📌 **Variáveis de Ambiente**
Antes de iniciar a aplicação, crie um arquivo **`.env`** na pasta `backend/` e configure as seguintes variáveis:

```env
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/db
JWT_SECRET=secret-key
```

### 📌 **Instalação**
```bash
# Clone o repositório
git clone https://github.com/VinieFortes/projeto-atendimento-cliente-desafio-positivo-s-mais
cd projeto-atendimento-cliente-desafio-positivo-s-mais

# Instale as dependências do backend
cd backend
npm install
```

## ⚙️ Configuração e Execução

### 📌 **Instalação**
```bash
# Clone o repositório
git clone https://github.com/VinieFortes/projeto-atendimento-cliente-desafio-positivo-s-mais
cd projeto-atendimento-cliente-desafio-positivo-s-mais

# Instale as dependências do backend
cd backend
npm install

# Instale as dependências do frontend
cd ../frontend
npm install
```
A API estará disponível em:  
📍 `http://localhost:3000`

O frontend estará disponível em:  
📍 `http://localhost:4200`

---

## 🧪 **Testes**
Este projeto inclui testes unitários e de integração usando **Jest**.

```bash
# Rodar testes unitários
npm run test
```


