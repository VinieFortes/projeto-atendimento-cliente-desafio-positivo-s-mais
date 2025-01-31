FROM node:22-alpine

# Define o diretório de trabalho no container
WORKDIR /app

# Copia apenas os arquivos necessários para instalação das dependências
COPY backend/package*.json ./

# Instala as dependências
RUN npm install

# Copia todos os arquivos do backend para o container
COPY backend/ ./

# Compila o projeto
RUN npm run build

# Exponha a porta usada pelo NestJS
EXPOSE 3000

# Comando para iniciar o app
CMD ["npm", "run", "start:prod"]