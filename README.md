# 🍔 UAIFOOD - Aplicativo de Delivery de Comida

![Status](https://img.shields.io/badge/status-concluído-brightgreen)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-green)
![TypeScript](https://img.shields.io/badge/typescript-%5E5.7.3-blue)
![React](https://img.shields.io/badge/react-19.2.0-61dafb)
![NestJS](https://img.shields.io/badge/nestjs-11.0.1-ea2845)
![Prisma](https://img.shields.io/badge/prisma-6.18.0-0c344b)
![PostgreSQL](https://img.shields.io/badge/postgresql-15-336791)
![Docker](https://img.shields.io/badge/docker-compose-2496ED)

> Plataforma completa de delivery de comida desenvolvida com tecnologias modernas, boas práticas SOLID, segurança implementada e documentação completa

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Status do Projeto](#status-do-projeto)
- [Tecnologias](#tecnologias)
- [Arquitetura](#arquitetura)
- [Funcionalidades](#funcionalidades)
- [Requisitos](#requisitos)
- [Instalação Rápida](#instalação-rápida)
- [Configuração Detalhada](#configuração-detalhada)
- [Executando o Projeto](#executando-o-projeto)
- [Testes](#testes)
- [Documentação da API](#documentação-da-api)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Guias de Implementação](#guias-de-implementação)
- [Padrões e Convenções](#padrões-e-convenções)
- [Troubleshooting](#troubleshooting)
- [Contribuindo](#contribuindo)
- [Licença](#licença)

---

## 🎯 Visão Geral

O **UAIFOOD** é uma plataforma enterprise de delivery de comida que conecta:
- **👥 Clientes**: Descobrem restaurantes, fazem pedidos e acompanham entregas
- **🏪 Restaurantes**: Gerenciam menu, recebem pedidos e controlam operações
- **👨‍💼 Administradores**: Gerenciam usuários, categorias e monitoram a plataforma

### Características Principais

✅ **Autenticação Segura**
- JWT com access + refresh tokens
- Autenticação de dois fatores (2FA) via TOTP
- Password hashing com bcrypt (10 salt rounds)

✅ **Autorização Baseada em Papéis (RBAC)**
- 3 roles: CLIENT, RESTAURANT_OWNER, ADMIN
- Guards customizados para controle granular
- Decorators `@Roles()` e `@Public()`

✅ **Sistema de Pedidos Completo**
- Carrinho de compras persistente
- Múltiplas formas de pagamento
- Rastreamento de status em tempo real

✅ **Gerenciamento Operacional**
- Catálogo de produtos com categorias
- Horários de funcionamento customizáveis
- Sistema de avaliações e reviews

✅ **Qualidade de Código**
- Arquitetura em camadas (Controllers → Services → Repositories)
- Validação robusta com class-validator
- Exception filters para tratamento de erros
- Interceptors para padronização de respostas

✅ **Documentação Completa**
- Swagger/OpenAPI interativo
- Documentos detalhados nos `/docs`
- Exemplos de teste no backend

---

## 📊 Status do Projeto

| Componente | Status | Notas |
|-----------|--------|-------|
| **Banco de Dados** | ✅ Completo | Schema Prisma otimizado, 10 modelos, relacionamentos validados |
| **Backend API** | ✅ Completo | 10 módulos, 50+ endpoints, Swagger documentado |
| **Frontend** | ✅ Completo | Next.js 16, páginas dinâmicas, AuthContext, 15+ serviços |
| **Autenticação** | ✅ Completo | JWT + 2FA implementado e testado |
| **Testes** | ✅ Parcial | Jest configurado, exemplos presentes |
| **Docker** | ✅ Completo | Docker Compose com 3 serviços |
| **Documentação** | ✅ Completo | README, Swagger, docs/ adicionais |

---

## 🚀 Tecnologias

### Backend Stack
```
NestJS 11.0.1       → Framework Node.js progressivo
TypeScript 5.7.3    → Tipagem estática
Prisma 6.18.0       → ORM moderno
PostgreSQL 15       → Banco de dados relacional
Express 5.0.0       → HTTP server (via NestJS)
JWT (passport-jwt)  → Autenticação
Bcrypt 6.0.0        → Hash de senhas
Speakeasy 2.0.0     → Geração de códigos 2FA
Class-validator     → Validação de DTOs
Swagger/OpenAPI     → Documentação interativa
Jest 30.0.0         → Framework de testes
```

### Frontend Stack
```
React 19.2.0        → Biblioteca UI
Next.js 16.0.2      → Framework React
TypeScript 5.7.3    → Tipagem estática
Tailwind CSS 4      → Utility-first CSS
Axios 1.13.2        → Cliente HTTP
Lucide React        → Ícones
React Context API   → Gerenciamento de estado
```

### DevOps & Ferramentas
```
Docker & Compose    → Containerização
PostgreSQL 15       → Banco de dados
ESLint 9.18.0       → Linting
Prettier 3.4.2      → Formatação de código
```

---

## 🏗️ Arquitetura

### Visão Geral do Sistema

```
┌─────────────────────────────────────────────────────────────────┐
│                     CLIENTE (Browser)                           │
│  React 19 + Next.js 16 + TypeScript + Tailwind CSS              │
└────────────────────┬────────────────────────────────────────────┘
                     │ HTTPS/API (Axios)
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                  API REST (Backend)                             │
│  NestJS 11 + TypeScript + Prisma + PostgreSQL                   │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Modules: Auth, Users, Restaurants, Products, Orders...  │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Common: Guards, Filters, Interceptors, Decorators       │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────┬──────────────────────────────────────────────┘
                  │ SQL
                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                    DATABASE                                     │
│  PostgreSQL 15 (10 modelos relacionais)                         │
└─────────────────────────────────────────────────────────────────┘
```

### Estrutura de Diretórios

```
APPUAIFOOD/
│
├── backend/                          # API NestJS
│   ├── prisma/                       # Database
│   │   ├── schema.prisma             # Definição do banco
│   │   ├── migrations/               # Histórico de mudanças
│   │   └── seed.ts                   # Dados iniciais
│   │
│   ├── src/
│   │   ├── modules/                  # Recursos da aplicação
│   │   │   ├── auth/                 # Autenticação + 2FA
│   │   │   ├── users/                # Perfil de usuários
│   │   │   ├── restaurants/          # Gerenciamento de restaurantes
│   │   │   ├── products/             # Catálogo de produtos
│   │   │   ├── orders/               # Sistema de pedidos
│   │   │   ├── cart/                 # Carrinho de compras
│   │   │   ├── addresses/            # Endereços de entrega
│   │   │   ├── reviews/              # Avaliações
│   │   │   ├── restaurant-categories/ # Categorias de restaurante
│   │   │   └── product-categories/   # Categorias de produto
│   │   │
│   │   ├── common/                   # Código compartilhado
│   │   │   ├── decorators/           # Custom decorators
│   │   │   ├── guards/               # Autenticação/autorização
│   │   │   ├── filters/              # Exception handling
│   │   │   ├── pipes/                # Validation pipes
│   │   │   └── interceptors/         # Response transformation
│   │   │
│   │   ├── config/                   # Configurações
│   │   ├── database/                 # Prisma client
│   │   ├── app.module.ts             # Module raiz
│   │   ├── app.controller.ts         # Health check
│   │   ├── main.ts                   # Entry point
│   │   └── ...
│   │
│   ├── test/                         # Testes e2e
│   ├── uploads/                      # Arquivos enviados
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   └── Dockerfile
│
├── frontend/                         # App Next.js
│   ├── app/                          # App Router (Next.js 13+)
│   │   ├── layout.tsx                # Layout global
│   │   ├── page.tsx                  # Home
│   │   ├── login/                    # Autenticação
│   │   ├── 2fa/                      # Autenticação em 2 fatores
│   │   ├── carrinho/                 # Carrinho de compras
│   │   ├── checkout/                 # Finalização de compra
│   │   ├── confirmacao-pedido/       # Confirmação do pedido
│   │   ├── meus-pedidos/             # Histórico de pedidos
│   │   ├── restaurante/              # Detalhes do restaurante
│   │   ├── perfil/                   # Perfil do usuário
│   │   ├── admin/                    # Painel administrativo
│   │   └── owner/                    # Painel do proprietário
│   │
│   ├── components/                   # Componentes reutilizáveis
│   │   ├── PageHeader.tsx
│   │   ├── CategoryFilter.tsx
│   │   ├── Toast.tsx
│   │   └── ...
│   │
│   ├── contexts/                     # Context API
│   │   └── AuthContext.tsx           # Autenticação global
│   │
│   ├── services/                     # Serviços de API
│   │   ├── authService.ts
│   │   ├── userService.ts
│   │   ├── restaurantService.ts
│   │   ├── productService.ts
│   │   ├── orderService.ts
│   │   ├── cartService.ts
│   │   ├── addressService.ts
│   │   ├── reviewService.ts
│   │   └── ...
│   │
│   ├── lib/                          # Utilitários
│   │   ├── api.ts                    # Configuração Axios
│   │   ├── logger.ts                 # Sistema de logs
│   │   └── ...
│   │
│   ├── types/                        # TypeScript types
│   ├── constants/                    # Constantes da app
│   ├── public/                       # Assets estáticos
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   ├── next.config.ts
│   ├── tailwind.config.ts
│   └── Dockerfile
│
├── docs/                             # Documentação adicional
│   ├── database-model.md             # Modelagem do banco
│   ├── FLUXO-ROLES.md                # Sistema de roles
│   ├── CHECKLIST-2FA-COMPLETO.md     # Implementação 2FA
│   ├── STATUS-GERAL-PROJETO.md       # Status detalhado
│   └── ... (10+ documentos)
│
├── prototipacao/                     # Protótipos de UI
├── docker-compose.yml                # Orquestração de containers
├── .gitignore
├── README.md                         # Este arquivo
└── LICENSE
```

---

## ⚡ Funcionalidades

### 🔐 Autenticação e Segurança

| Funcionalidade | Status | Detalhes |
|----------------|--------|----------|
| Registro de usuários | ✅ | Validação de email, senha forte, roles customizáveis |
| Login | ✅ | JWT access + refresh tokens |
| 2FA (TOTP) | ✅ | Geração de QR code, verificação de código |
| Logout | ✅ | Limpeza de tokens |
| Refresh token | ✅ | Renovação automática de sessão |
| Password hashing | ✅ | Bcrypt com 10 salt rounds |
| CORS | ✅ | Configurado para frontend |
| Rate limiting | 🔄 | Planejado para v2 |

### 👥 Gerenciamento de Usuários

| Funcionalidade | Status | Detalhes |
|----------------|--------|----------|
| Perfil do usuário | ✅ | Visualizar e editar dados |
| Múltiplos endereços | ✅ | CRUD completo, endereço padrão |
| Histórico de pedidos | ✅ | Filtros por status e data |
| Alteração de senha | 🔄 | Planejado para v2 |
| Preferências | 🔄 | Planejado para v2 |

### 🏪 Gerenciamento de Restaurantes

| Funcionalidade | Status | Detalhes |
|----------------|--------|----------|
| Criar restaurante | ✅ | Validação de dados, categorias |
| Listar restaurantes | ✅ | Filtros por categoria, status |
| Detalhes do restaurante | ✅ | Menu, horários, avaliações |
| Editar restaurante | ✅ | Apenas para dono e admin |
| Deletar restaurante | ✅ | Apenas para dono e admin |
| Horários de funcionamento | ✅ | JSON customizável |
| Taxa de entrega | ✅ | Cálculo automático |
| Pedido mínimo | ✅ | Validação em checkout |

### 🍽️ Produtos e Categorias

| Funcionalidade | Status | Detalhes |
|----------------|--------|----------|
| CRUD de produtos | ✅ | Validação de preço e disponibilidade |
| Categorização | ✅ | Categorias de restaurante e produto |
| Upload de imagens | ✅ | Via multer, armazenamento local |
| Filtros por categoria | ✅ | Frontend e backend |
| Disponibilidade | ✅ | Ativação/desativação de produtos |

### 🛒 Carrinho e Pedidos

| Funcionalidade | Status | Detalhes |
|----------------|--------|----------|
| Adicionar ao carrinho | ✅ | Validação de mesmo restaurante |
| Remover do carrinho | ✅ | Item e quantidade |
| Visualizar carrinho | ✅ | Total, subtotal, taxa |
| Criar pedido | ✅ | Validação de endereço e pagamento |
| Acompanhar status | ✅ | PENDING → DELIVERED |
| Histórico de pedidos | ✅ | Com filtros |
| Múltiplas formas de pagamento | ✅ | Cartão, PIX, Dinheiro |

### ⭐ Avaliações e Reviews

| Funcionalidade | Status | Detalhes |
|----------------|--------|----------|
| Avaliar restaurante | ✅ | 1-5 estrelas + comentário |
| Visualizar avaliações | ✅ | Média, comentários, datas |
| Validação de proprietário | ✅ | Apenas comprador pode avaliar |

### 👨‍💼 Painel Administrativo

| Funcionalidade | Status | Detalhes |
|----------------|--------|----------|
| Gerenciar usuários | ✅ | CRUD, atribuir roles |
| Gerenciar restaurantes | ✅ | Aprovar, editar, deletar |
| Gerenciar produtos | ✅ | Aprovar, editar, deletar |
| Gerenciar categorias | ✅ | CRUD de categorias |
| Visualizar pedidos | ✅ | Dashboard com filtros |
| Gerenciar 2FA | ✅ | Ativar/desativar para usuários |

---

## 📦 Requisitos

### Obrigatórios
- **Node.js** ≥ 18.0.0
- **npm** ≥ 9.0.0 ou **yarn** ≥ 3.0.0
- **Git** ≥ 2.0.0

### Para Desenvolvimento Local
- **PostgreSQL** 15 (ou Docker para container)
- **Visual Studio Code** (recomendado)
- **Postman** ou **Insomnia** (para testar API)

### Para Docker (Recomendado)
- **Docker** ≥ 20.10
- **Docker Compose** ≥ 1.29

---

## 🚀 Instalação Rápida

### Opção 1: Com Docker (Recomendado)

```bash
# Clone o repositório
git clone https://github.com/MrTch0o/APPUAIFOOD.git
cd APPUAIFOOD

# Inicie todos os serviços
docker-compose up

# Em outro terminal, popule o banco (opcional)
docker exec uaifood-backend npm run seed
```

Acesse:
- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3000
- **Swagger**: http://localhost:3000/api/docs
- **PostgreSQL**: localhost:5432

### Opção 2: Instalação Local

```bash
# Clone o repositório
git clone https://github.com/MrTch0o/APPUAIFOOD.git
cd APPUAIFOOD

# Backend
cd backend
npm install
npx prisma migrate dev
npx prisma generate
npm run seed
npm run start:dev

# Em outro terminal, Frontend
cd ../frontend
npm install
npm run dev
```

---

## ⚙️ Configuração Detalhada

### Backend - Variáveis de Ambiente

Crie `.env` na pasta `backend/`:

```env
# Database
DATABASE_URL="postgresql://uaifood:uaifood123@localhost:5432/uaifood?schema=public"

# JWT
JWT_SECRET="seu-secret-super-seguro-mude-em-producao"
JWT_EXPIRES_IN="1d"
JWT_REFRESH_SECRET="seu-refresh-secret-super-seguro"
JWT_REFRESH_EXPIRES_IN="7d"

# 2FA
TWO_FACTOR_AUTHENTICATION_APP_NAME="UAIFOOD"

# Email (opcional, para 2FA via email)
MAIL_HOST="smtp.gmail.com"
MAIL_PORT=587
MAIL_USER="seu-email@gmail.com"
MAIL_PASS="senha-de-app"
MAIL_FROM="noreply@uaifood.com"

# App
PORT=3000
NODE_ENV="development"
CORS_ORIGIN="http://localhost:3001,http://localhost:5173"
```

### Frontend - Variáveis de Ambiente

Crie `.env.local` na pasta `frontend/`:

```env
NEXT_PUBLIC_API_URL="http://localhost:3000/api"
```

### Docker Compose - Customização

Edite `docker-compose.yml` para alterar:
- Porta do PostgreSQL: `5432:5432`
- Porta do Backend: `3000:3000`
- Porta do Frontend: `3001:3001`
- Credenciais do banco de dados

---

## 🎮 Executando o Projeto

### Com Docker (Recomendado)

```bash
# Iniciar tudo
docker-compose up

# Construir imagens
docker-compose up --build

# Rodar em background
docker-compose up -d

# Parar serviços
docker-compose down

# Ver logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Desenvolvimento Local

#### Terminal 1 - Backend
```bash
cd backend
npm run start:dev
# Servidor rodando em http://localhost:3000
```

#### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
# App rodando em http://localhost:3001
```

#### Terminal 3 - Prisma Studio (Opcional)
```bash
cd backend
npx prisma studio
# Interface visual em http://localhost:5555
```

---

## 🧪 Testes

### Backend

```bash
cd backend

# Testes unitários
npm run test

# Modo watch (atualiza ao salvar)
npm run test:watch

# Com cobertura
npm run test:cov

# Testes e2e
npm run test:e2e
```

### Frontend

```bash
cd frontend

# Testes com Jest (quando configurado)
npm run test
```

### Teste Manual da API

```bash
# Script PowerShell no backend
cd backend
./test-api.ps1

# Ou use Postman/Insomnia importando a collection do Swagger
# http://localhost:3000/api/docs
```

---

## 📚 Documentação da API

### Acesso à Documentação

- **Local**: http://localhost:3000/api/docs
- **Production**: https://api.uaifood.com/docs (quando deployado)

### Principais Endpoints

#### Autenticação
```
POST   /api/auth/register          Registrar novo usuário
POST   /api/auth/login             Login (JWT)
POST   /api/auth/refresh           Renovar token
POST   /api/auth/logout            Logout
POST   /api/auth/2fa/generate      Gerar QR code 2FA
POST   /api/auth/2fa/enable        Ativar 2FA
POST   /api/auth/2fa/disable       Desativar 2FA
POST   /api/auth/2fa/verify        Verificar código 2FA
```

#### Usuários
```
GET    /api/users/me               Perfil do usuário logado
PATCH  /api/users/me               Atualizar perfil
GET    /api/users/:id              Buscar usuário por ID
GET    /api/users                  Listar usuários (ADMIN)
PATCH  /api/users/:id              Atualizar usuário (ADMIN)
DELETE /api/users/:id              Deletar usuário (ADMIN)
```

#### Restaurantes
```
GET    /api/restaurants            Listar restaurantes
GET    /api/restaurants/:id        Detalhes do restaurante
POST   /api/restaurants            Criar restaurante
PATCH  /api/restaurants/:id        Editar restaurante
DELETE /api/restaurants/:id        Deletar restaurante
```

#### Produtos
```
GET    /api/products               Listar produtos
GET    /api/products/:id           Detalhes do produto
POST   /api/products               Criar produto
PATCH  /api/products/:id           Editar produto
DELETE /api/products/:id           Deletar produto
```

#### Carrinho
```
GET    /api/cart                   Visualizar carrinho
POST   /api/cart                   Adicionar ao carrinho
PATCH  /api/cart/:itemId           Atualizar quantidade
DELETE /api/cart/:itemId           Remover item
```

#### Pedidos
```
GET    /api/orders                 Listar pedidos
GET    /api/orders/:id             Detalhes do pedido
POST   /api/orders                 Criar pedido
PATCH  /api/orders/:id/status      Atualizar status
```

#### Endereços
```
GET    /api/addresses              Listar endereços
GET    /api/addresses/:id          Detalhes do endereço
POST   /api/addresses              Criar endereço
PATCH  /api/addresses/:id          Editar endereço
DELETE /api/addresses/:id          Deletar endereço
```

#### Avaliações
```
GET    /api/reviews                Listar avaliações
POST   /api/reviews                Criar avaliação
```

---

## 📁 Estrutura de Módulos do Backend

Cada módulo segue a arquitetura padrão:

```
módulo/
├── dto/                          # Data Transfer Objects
│   ├── create-*.dto.ts
│   ├── update-*.dto.ts
│   └── ...
├── entities/                     # Entidades (opcional)
├── *-service.ts                  # Lógica de negócio
├── *-controller.ts               # Endpoints HTTP
├── *-module.ts                   # Configuração do módulo
└── [validators/]                 # Validadores customizados
```

### Padrão de Serviços

```typescript
@Injectable()
export class ExampleService {
  constructor(private prisma: PrismaService) {}
  
  async create(dto: CreateExampleDto) {
    return this.prisma.example.create({ data: dto });
  }
  
  async findAll(filters?: FilterDto) {
    return this.prisma.example.findMany({ where: filters });
  }
  
  async findOne(id: string) {
    return this.prisma.example.findUnique({ where: { id } });
  }
  
  async update(id: string, dto: UpdateExampleDto) {
    return this.prisma.example.update({ where: { id }, data: dto });
  }
  
  async delete(id: string) {
    return this.prisma.example.delete({ where: { id } });
  }
}
```

---

## 🎨 Guias de Implementação

### Adicionar Novo Endpoint

1. **Criar DTO** (`src/modules/exemplo/dto/create-exemplo.dto.ts`)
2. **Criar Serviço** (`src/modules/exemplo/exemplo.service.ts`)
3. **Criar Controller** (`src/modules/exemplo/exemplo.controller.ts`)
4. **Registrar no Módulo** (`src/modules/exemplo/exemplo.module.ts`)
5. **Testar com Swagger**: http://localhost:3000/api/docs

### Adicionar Validação DTO

```typescript
import { IsString, IsEmail, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'usuario@example.com' })
  @IsEmail({}, { message: 'Email inválido' })
  email: string;

  @ApiProperty({ example: 'Senha@123', minLength: 8 })
  @IsString()
  @MinLength(8, { message: 'Mínimo 8 caracteres' })
  password: string;

  @ApiProperty({ example: 'João Silva' })
  @IsString()
  @MaxLength(100, { message: 'Máximo 100 caracteres' })
  name: string;
}
```

### Adicionar Autenticação/Autorização

```typescript
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('exemplo')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ExemploController {
  @Post()
  @Roles(UserRole.ADMIN, UserRole.RESTAURANT_OWNER)
  create(@Body() dto: CreateExemploDto) {
    return this.service.create(dto);
  }

  @Get()
  @Public() // Endpoint público
  findAll() {
    return this.service.findAll();
  }
}
```

### Sistema de Roles

| Role | Acesso |
|------|--------|
| `CLIENT` | Visualizar restaurantes, fazer pedidos, avaliar |
| `RESTAURANT_OWNER` | Gerenciar restaurante e menu |
| `ADMIN` | Gerenciar tudo |

---

## 📝 Padrões e Convenções

### Commits

Seguimos [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: adiciona autenticação 2FA
fix: corrige cálculo de taxa de entrega
docs: atualiza README
refactor: simplifica serviço de pedidos
test: adiciona testes para auth
```

### Branches

```
main          → Produção
develop       → Desenvolvimento
feature/*     → Novas features
fix/*         → Correções de bugs
hotfix/*      → Fixes urgentes
```

### Nomenclatura

- **Variáveis**: `camelCase` (`user`, `cartItems`)
- **Classes**: `PascalCase` (`UserService`, `CreateUserDto`)
- **Constantes**: `UPPER_SNAKE_CASE` (`MAX_ATTEMPTS`, `DEFAULT_ROLE`)
- **Arquivos**: `kebab-case` (`user.service.ts`, `create-user.dto.ts`)
- **Pastas**: `kebab-case` ou `camelCase` (`src/common`, `user-service`)

### Lint e Formatação

```bash
# Backend
cd backend
npm run lint        # Verificar erros
npm run lint:fix    # Corrigir automaticamente
npm run format      # Formatar com Prettier

# Frontend
cd frontend
npm run lint        # Verificar erros
npm run lint:fix    # Corrigir automaticamente
```

---

## 🔍 Troubleshooting

### Docker Issues

```bash
# Container não inicia
docker-compose logs backend

# Porta já em uso
# Mude PORTS no docker-compose.yml ou:
lsof -i :3000  # Listar processos
kill -9 <PID>  # Matar processo

# Resetar banco de dados
docker-compose down -v
docker-compose up
```

### Backend Issues

```bash
# Migration error
cd backend
npx prisma migrate reset

# Tipos Prisma desatualizados
npx prisma generate

# Dependências faltando
rm -rf node_modules package-lock.json
npm install
```

### Frontend Issues

```bash
# Cache do Next.js
rm -rf .next
npm run dev

# Porta 3001 em uso
npm run dev -- -p 3002

# Variáveis de ambiente não carregam
# Reinicie o servidor dev após alterar .env.local
```

### Conexão com API

```bash
# Testar conectividade
curl http://localhost:3000/api/health

# Verificar CORS
# Confirme CORS_ORIGIN em .env do backend

# Token JWT inválido
# Limpar localStorage no browser
localStorage.clear()

# 2FA não funciona
# Confirme relógio do sistema sincronizado (TOTP usa hora)
```

---

## 🤝 Contribuindo

1. Faça fork do projeto
2. Crie branch para sua feature: `git checkout -b feature/MinhaFeature`
3. Commit suas mudanças: `git commit -am 'feat: adiciona MinhaFeature'`
4. Push para a branch: `git push origin feature/MinhaFeature`
5. Abra um Pull Request

### Checklist antes de PR

- [ ] Código segue o padrão de estilo (ESLint)
- [ ] Testes unitários passam
- [ ] Documentação foi atualizada
- [ ] Commit message segue Conventional Commits
- [ ] Sem console.log deixado no código
- [ ] Sem console.log em produção

---

## 📄 Licença

Este projeto está sob licença MIT. Veja [LICENSE](LICENSE) para detalhes.

---

## 👨‍💻 Autor

Desenvolvido por **MrTch0o** para a disciplina de **Desenvolvimento Web II**

## 🔗 Links Úteis

- [NestJS Docs](https://docs.nestjs.com/)
- [Prisma Docs](https://www.prisma.io/docs)
- [React Docs](https://react.dev)
- [Next.js Docs](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Docker Docs](https://docs.docker.com/)

---

⭐ **Se este projeto foi útil, considere deixar uma star!**

🐛 **Encontrou um bug?** Abra uma issue no GitHub.

💬 **Sugestões?** Envie um pull request!

````