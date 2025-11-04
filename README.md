# 🍔 UAIFOOD - Aplicativo de Delivery de Comida

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-green)
![TypeScript](https://img.shields.io/badge/typescript-%5E5.0.0-blue)

> Aplicativo completo de delivery de comida desenvolvido para a disciplina de Desenvolvimento Web II

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Arquitetura](#arquitetura)
- [Funcionalidades](#funcionalidades)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Executando o Projeto](#executando-o-projeto)
- [Testes](#testes)
- [Documentação da API](#documentação-da-api)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Padrões e Convenções](#padrões-e-convenções)
- [Contribuindo](#contribuindo)
- [Roadmap](#roadmap)
- [Licença](#licença)

## 🎯 Sobre o Projeto

O **UAIFOOD** é uma plataforma completa de delivery de comida que conecta restaurantes e clientes, oferecendo uma experiência moderna e segura de pedidos online. O projeto foi desenvolvido com foco em boas práticas de desenvolvimento, segurança da informação e arquitetura escalável.

### Objetivos Acadêmicos

Este projeto aborda os seguintes conceitos:

- ✅ **Autenticação em Dois Fatores (2FA)** - Segurança adicional no login
- ✅ **Segurança da Informação** - Criptografia, JWT, HTTPS
- ✅ **Princípios SOLID** - Código limpo e manutenível
- ✅ **API REST** - Arquitetura RESTful completa
- ✅ **Swagger/OpenAPI** - Documentação interativa da API
- ✅ **Docker** - Containerização e orquestração
- ✅ **Testes Unitários** - Cobertura com Jest
- ✅ **ORM Prisma** - Gestão moderna do banco de dados
- ✅ **PostgreSQL** - Banco de dados relacional robusto

## 🚀 Tecnologias Utilizadas

### Backend

- **[NestJS](https://nestjs.com/)** - Framework Node.js progressivo
- **[TypeScript](https://www.typescriptlang.org/)** - Superset JavaScript tipado
- **[Prisma](https://www.prisma.io/)** - ORM moderno para Node.js
- **[PostgreSQL](https://www.postgresql.org/)** - Banco de dados relacional
- **[JWT](https://jwt.io/)** - JSON Web Tokens para autenticação
- **[Bcrypt](https://github.com/kelektiv/node.bcrypt.js)** - Hash de senhas
- **[Passport](http://www.passportjs.org/)** - Middleware de autenticação
- **[Speakeasy](https://github.com/speakeasyjs/speakeasy)** - Geração de códigos 2FA
- **[Swagger](https://swagger.io/)** - Documentação OpenAPI
- **[Jest](https://jestjs.io/)** - Framework de testes
- **[Class Validator](https://github.com/typestack/class-validator)** - Validação de DTOs

### Frontend

- **[React](https://react.dev/)** - Biblioteca JavaScript para UI
- **[Vite](https://vitejs.dev/)** - Build tool moderno
- **[TypeScript](https://www.typescriptlang.org/)** - Tipagem estática
- **[React Router](https://reactrouter.com/)** - Roteamento
- **[Axios](https://axios-http.com/)** - Cliente HTTP
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework CSS utility-first
- **[Zustand](https://github.com/pmndrs/zustand)** - Gerenciamento de estado
- **[React Query](https://tanstack.com/query)** - Gerenciamento de dados assíncronos
- **[React Hook Form](https://react-hook-form.com/)** - Gerenciamento de formulários

### DevOps e Ferramentas

- **[Docker](https://www.docker.com/)** - Containerização
- **[Docker Compose](https://docs.docker.com/compose/)** - Orquestração de containers
- **[GitHub Actions](https://github.com/features/actions)** - CI/CD
- **[ESLint](https://eslint.org/)** - Linter JavaScript/TypeScript
- **[Prettier](https://prettier.io/)** - Formatador de código

## 🏗️ Arquitetura

O projeto segue uma arquitetura de **monorepo** com backend e frontend separados:

```
APPUAIFOOD/
├── backend/          # API NestJS
├── frontend/         # App React
├── docs/             # Documentação adicional
├── docker-compose.yml
└── README.md
```

### Arquitetura do Backend (NestJS)

O backend segue os princípios **SOLID** e é organizado em módulos:

```
backend/
├── src/
│   ├── modules/          # Módulos da aplicação
│   │   ├── auth/         # Autenticação e 2FA
│   │   ├── users/        # Gestão de usuários
│   │   ├── restaurants/  # Gestão de restaurantes
│   │   ├── products/     # Produtos/itens do menu
│   │   ├── orders/       # Sistema de pedidos
│   │   ├── cart/         # Carrinho de compras
│   │   └── reviews/      # Avaliações
│   ├── common/           # Código compartilhado
│   │   ├── decorators/   # Custom decorators
│   │   ├── guards/       # Guards de autenticação
│   │   ├── filters/      # Exception filters
│   │   ├── pipes/        # Validation pipes
│   │   └── interceptors/ # Interceptors
│   ├── config/           # Configurações
│   └── database/         # Prisma e migrations
└── test/                 # Testes
```

## ⚡ Funcionalidades

### Autenticação e Segurança
- [x] Registro de usuários com validação
- [x] Login com JWT
- [x] Autenticação de dois fatores (2FA) via e-mail/SMS
- [x] Recuperação de senha
- [x] Refresh tokens
- [x] Rate limiting

### Usuários
- [x] Perfil de usuário (cliente/restaurante)
- [x] Gerenciamento de endereços
- [x] Histórico de pedidos
- [x] Favoritos

### Restaurantes
- [x] Cadastro e gestão de restaurantes
- [x] Upload de imagens
- [x] Categorização
- [x] Horário de funcionamento
- [x] Avaliações e notas

### Produtos/Menu
- [x] CRUD de produtos
- [x] Categorias de produtos
- [x] Preços e promoções
- [x] Disponibilidade

### Carrinho e Pedidos
- [x] Adicionar/remover itens do carrinho
- [x] Cálculo de subtotal e taxas
- [x] Finalização de pedido
- [x] Rastreamento de status
- [x] Histórico de pedidos

### Pagamentos
- [x] Múltiplos métodos de pagamento
- [x] Integração com gateway (simulado)

### Avaliações
- [x] Avaliar restaurantes
- [x] Avaliar pedidos
- [x] Sistema de notas (1-5 estrelas)

## 📦 Pré-requisitos

Antes de começar, você precisa ter instalado:

- **[Node.js](https://nodejs.org/)** (versão 18 ou superior)
- **[npm](https://www.npmjs.com/)** ou **[yarn](https://yarnpkg.com/)**
- **[Docker](https://www.docker.com/)** e **[Docker Compose](https://docs.docker.com/compose/)**
- **[Git](https://git-scm.com/)**

## 🔧 Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/MrTch0o/APPUAIFOOD.git
cd APPUAIFOOD
```

### 2. Instale as dependências do Backend

```bash
cd backend
npm install
```

### 3. Instale as dependências do Frontend

```bash
cd ../frontend
npm install
```

## ⚙️ Configuração

### Backend

1. Copie o arquivo de exemplo de variáveis de ambiente:

```bash
cd backend
cp .env.example .env
```

2. Configure as variáveis de ambiente no arquivo `.env`:

```env
# Database
DATABASE_URL="postgresql://uaifood:uaifood123@localhost:5432/uaifood?schema=public"

# JWT
JWT_SECRET="seu-secret-super-seguro-aqui"
JWT_EXPIRES_IN="1d"
JWT_REFRESH_SECRET="seu-refresh-secret-aqui"
JWT_REFRESH_EXPIRES_IN="7d"

# 2FA
TWO_FACTOR_AUTHENTICATION_APP_NAME="UAIFOOD"

# Email (para 2FA e recuperação de senha)
MAIL_HOST="smtp.gmail.com"
MAIL_PORT=587
MAIL_USER="seu-email@gmail.com"
MAIL_PASS="sua-senha-de-app"
MAIL_FROM="noreply@uaifood.com"

# App
PORT=3000
NODE_ENV="development"

# CORS
CORS_ORIGIN="http://localhost:5173"
```

### Frontend

1. Copie o arquivo de exemplo de variáveis de ambiente:

```bash
cd frontend
cp .env.example .env
```

2. Configure as variáveis de ambiente:

```env
VITE_API_URL="http://localhost:3000/api"
```

## 🚀 Executando o Projeto

### Com Docker (Recomendado)

Execute todo o projeto (backend + frontend + banco de dados) com um único comando:

```bash
docker-compose up
```

Acesse:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **Swagger**: http://localhost:3000/api/docs
- **PostgreSQL**: localhost:5432

### Sem Docker

#### 1. Inicie o PostgreSQL

Você precisa ter o PostgreSQL rodando localmente ou usar Docker apenas para o banco:

```bash
docker run --name uaifood-postgres -e POSTGRES_PASSWORD=uaifood123 -e POSTGRES_USER=uaifood -e POSTGRES_DB=uaifood -p 5432:5432 -d postgres:15
```

#### 2. Execute as migrations do Prisma

```bash
cd backend
npx prisma migrate dev
npx prisma generate
```

#### 3. (Opcional) Popule o banco com dados de teste

```bash
npm run seed
```

#### 4. Inicie o Backend

```bash
cd backend
npm run start:dev
```

O backend estará rodando em: http://localhost:3000

#### 5. Inicie o Frontend

Em outro terminal:

```bash
cd frontend
npm run dev
```

O frontend estará rodando em: http://localhost:5173

## 🧪 Testes

### Backend

```bash
cd backend

# Testes unitários
npm run test

# Testes com coverage
npm run test:cov

# Testes em modo watch
npm run test:watch

# Testes e2e
npm run test:e2e
```

### Frontend

```bash
cd frontend

# Testes unitários
npm run test

# Testes com coverage
npm run test:coverage
```

## 📚 Documentação da API

A documentação completa da API está disponível através do Swagger:

- **Desenvolvimento**: http://localhost:3000/api/docs
- **Produção**: https://api.uaifood.com/docs

### Principais Endpoints

#### Autenticação
- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Login
- `POST /api/auth/2fa/generate` - Gerar código 2FA
- `POST /api/auth/2fa/verify` - Verificar código 2FA
- `POST /api/auth/refresh` - Refresh token

#### Usuários
- `GET /api/users/me` - Perfil do usuário logado
- `PATCH /api/users/me` - Atualizar perfil
- `GET /api/users/:id` - Buscar usuário por ID

#### Restaurantes
- `GET /api/restaurants` - Listar restaurantes
- `GET /api/restaurants/:id` - Detalhes do restaurante
- `POST /api/restaurants` - Criar restaurante (apenas donos)
- `PATCH /api/restaurants/:id` - Atualizar restaurante
- `DELETE /api/restaurants/:id` - Deletar restaurante

#### Produtos
- `GET /api/products` - Listar produtos
- `GET /api/products/:id` - Detalhes do produto
- `POST /api/products` - Criar produto
- `PATCH /api/products/:id` - Atualizar produto
- `DELETE /api/products/:id` - Deletar produto

#### Pedidos
- `GET /api/orders` - Listar pedidos
- `GET /api/orders/:id` - Detalhes do pedido
- `POST /api/orders` - Criar pedido
- `PATCH /api/orders/:id/status` - Atualizar status

## 📁 Estrutura do Projeto

```
APPUAIFOOD/
│
├── backend/                    # API NestJS
│   ├── prisma/                 # Schema e migrations do Prisma
│   │   ├── schema.prisma
│   │   ├── migrations/
│   │   └── seed.ts
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/          # Módulo de autenticação
│   │   │   ├── users/         # Módulo de usuários
│   │   │   ├── restaurants/   # Módulo de restaurantes
│   │   │   ├── products/      # Módulo de produtos
│   │   │   ├── orders/        # Módulo de pedidos
│   │   │   ├── cart/          # Módulo de carrinho
│   │   │   └── reviews/       # Módulo de avaliações
│   │   ├── common/            # Código compartilhado
│   │   ├── config/            # Configurações
│   │   └── main.ts            # Entry point
│   ├── test/                  # Testes
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                   # App React
│   ├── public/
│   ├── src/
│   │   ├── components/        # Componentes reutilizáveis
│   │   ├── pages/             # Páginas da aplicação
│   │   ├── services/          # Serviços de API
│   │   ├── store/             # Estado global (Zustand)
│   │   ├── hooks/             # Custom hooks
│   │   ├── utils/             # Utilitários
│   │   ├── types/             # TypeScript types
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── .env.example
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
├── docs/                       # Documentação adicional
│   ├── database-model.md      # Modelagem do banco
│   ├── api-examples.md        # Exemplos de uso da API
│   └── deployment.md          # Guia de deployment
│
├── prototipacao/              # Protótipos de UI
│
├── .gitignore
├── docker-compose.yml         # Orquestração Docker
├── README.md
└── LICENSE
```

## 📝 Padrões e Convenções

### Commits

Seguimos o padrão de [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: adiciona sistema de 2FA
fix: corrige cálculo de taxa de entrega
docs: atualiza README com instruções de setup
test: adiciona testes para módulo de pedidos
refactor: refatora serviço de autenticação
```

### Branches

- `main` - Branch principal (produção)
- `develop` - Branch de desenvolvimento
- `feature/nome-da-feature` - Novas funcionalidades
- `fix/nome-do-bug` - Correções de bugs
- `hotfix/nome-do-hotfix` - Correções urgentes

### Código

- **TypeScript** para todo o código
- **ESLint** para linting
- **Prettier** para formatação
- **Testes** obrigatórios para novas features
- **Documentação** de funções complexas

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 🗺️ Roadmap

- [x] **Etapa 1**: Configuração inicial e documentação
- [ ] **Etapa 2**: Setup do Backend (NestJS + PostgreSQL + Prisma)
- [ ] **Etapa 3**: Modelagem do banco de dados
- [ ] **Etapa 4**: Autenticação e Segurança (JWT + 2FA)
- [ ] **Etapa 5**: API REST - Módulos Core
- [ ] **Etapa 6**: API REST - Módulos de Negócio
- [ ] **Etapa 7**: Documentação Swagger e Testes
- [ ] **Etapa 8**: Frontend - Setup e Autenticação
- [ ] **Etapa 9**: Frontend - Páginas Principais
- [ ] **Etapa 10**: Dockerização e Deploy

## 👥 Equipe

- **Desenvolvimento**: MrTch0o
- **Disciplina**: Desenvolvimento Web II

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

⭐ **Desenvolvido com dedicação para a disciplina de Desenvolvimento Web II**

🔗 **Links Úteis**
- [Documentação NestJS](https://docs.nestjs.com/)
- [Documentação Prisma](https://www.prisma.io/docs)
- [Documentação React](https://react.dev/)
- [Guia TypeScript](https://www.typescriptlang.org/docs/)
