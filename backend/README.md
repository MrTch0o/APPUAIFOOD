# 🍔 UAIFOOD - Backend API

> API REST completa para aplicativo de delivery de comida desenvolvida com NestJS, TypeScript e PostgreSQL.

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Tecnologias](#tecnologias)
- [Status do Projeto](#status-do-projeto)
- [Instalação](#instalação)
- [Executando o Projeto](#executando-o-projeto)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Endpoints Disponíveis](#endpoints-disponíveis)
- [Documentação Adicional](#documentação-adicional)
- [Testes](#testes)

## 🎯 Sobre o Projeto

UAIFOOD é uma API REST robusta para gerenciamento de pedidos de delivery, incluindo:

- ✅ Autenticação JWT com refresh token
- ✅ Autenticação de 2 fatores (2FA/TOTP)
- ✅ Sistema de roles (ADMIN, RESTAURANT_OWNER, CLIENT)
- ✅ CRUD completo de Usuários, Restaurantes e Produtos
- ✅ Upload de imagens para restaurantes e produtos
- ✅ Exception filters personalizados
- ✅ Response transformation padronizado
- ✅ Documentação Swagger/OpenAPI
- ✅ Validação com class-validator
- ✅ Integração com PostgreSQL via Prisma ORM

## 🚀 Tecnologias

- **Framework**: [NestJS](https://nestjs.com/) v11
- **Linguagem**: [TypeScript](https://www.typescriptlang.org/) v5
- **Banco de Dados**: [PostgreSQL](https://www.postgresql.org/) v15
- **ORM**: [Prisma](https://www.prisma.io/) v6.18.0
- **Autenticação**: JWT + Passport.js
- **2FA**: Speakeasy (TOTP)
- **Upload**: Multer
- **Validação**: class-validator
- **Documentação**: Swagger/OpenAPI
- **Containerização**: Docker

## 📊 Status do Projeto

### ✅ Completado (Etapas 1-5)

- [x] **Etapa 1**: Configuração inicial e estrutura
- [x] **Etapa 2**: Modelo de dados (Prisma Schema)
- [x] **Etapa 3**: Autenticação JWT
- [x] **Etapa 4**: Autenticação 2FA (TOTP)
- [x] **Etapa 5**: API REST - Módulos Core
  - [x] CRUD de Usuários
  - [x] CRUD de Restaurantes
  - [x] CRUD de Produtos
  - [x] Sistema de Upload de Imagens
  - [x] Exception Filters
  - [x] Transform Interceptor

### 🔄 Em Desenvolvimento

- [ ] **Etapa 6**: Pedidos e Carrinho
- [ ] **Etapa 7**: Sistema de Pagamentos
- [ ] **Etapa 8**: Notificações em Tempo Real
- [ ] **Etapa 9**: Testes Automatizados
- [ ] **Etapa 10**: Deploy e CI/CD

**Total de Endpoints Ativos**: 24

## ⚙️ Instalação

### Pré-requisitos

- Node.js v18+
- PostgreSQL v15+
- npm ou yarn

### Passos

```bash
# 1. Clone o repositório
git clone https://github.com/MrTch0o/APPUAIFOOD.git
cd APPUAIFOOD/backend

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas configurações

# 4. Execute as migrations do banco
npx prisma migrate dev

# 5. (Opcional) Popule o banco com dados de exemplo
npx prisma db seed
```

### Variáveis de Ambiente

```env
# Database
DATABASE_URL="postgresql://usuario:senha@localhost:5432/uaifood"

# JWT
JWT_SECRET="seu-secret-super-seguro"
JWT_REFRESH_SECRET="seu-refresh-secret-super-seguro"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# Server
PORT=3000
CORS_ORIGIN="http://localhost:5173"
```

## 🏃 Executando o Projeto

```bash
# Desenvolvimento (com hot-reload)
npm run start:dev

# Produção
npm run build
npm run start:prod

# Modo debug
npm run start:debug
```

Após iniciar, acesse:
- **API**: http://localhost:3000/api
- **Swagger**: http://localhost:3000/api/docs
- **Imagens**: http://localhost:3000/uploads

## 📁 Estrutura do Projeto

```
backend/
├── docs/                        # 📚 Documentação
│   ├── 2FA-GUIDE.md            # Guia de autenticação 2FA
│   └── UPLOAD.md               # Guia de upload de imagens
├── prisma/
│   ├── schema.prisma           # Modelo do banco de dados
│   └── migrations/             # Histórico de migrations
├── src/
│   ├── auth/                   # 🔐 Autenticação (JWT + 2FA)
│   ├── users/                  # 👤 Módulo de usuários
│   ├── restaurants/            # 🏪 Módulo de restaurantes
│   ├── products/               # 🍕 Módulo de produtos
│   ├── common/
│   │   ├── decorators/         # Decorators customizados
│   │   ├── guards/             # Guards (JWT, Roles)
│   │   ├── filters/            # Exception filters
│   │   ├── interceptors/       # Interceptors
│   │   └── config/             # Configurações (Multer)
│   ├── database/               # Prisma Service
│   └── main.ts                 # Bootstrap da aplicação
├── uploads/                    # 🖼️ Arquivos enviados
└── README.md                   # Este arquivo
```

## 🌐 Endpoints Disponíveis

### Autenticação (8 endpoints)

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | `/api/auth/register` | Registrar novo usuário | ❌ |
| POST | `/api/auth/login` | Login (retorna access + refresh token) | ❌ |
| POST | `/api/auth/refresh` | Renovar access token | ❌ |
| POST | `/api/auth/logout` | Logout | ✅ |
| POST | `/api/auth/2fa/generate` | Gerar QR Code 2FA | ✅ |
| POST | `/api/auth/2fa/enable` | Ativar 2FA | ✅ |
| POST | `/api/auth/2fa/disable` | Desativar 2FA | ✅ |
| POST | `/api/auth/2fa/verify` | Verificar código 2FA no login | ❌ |

### Usuários (4 endpoints)

| Método | Endpoint | Descrição | Roles |
|--------|----------|-----------|-------|
| GET | `/api/users/me` | Perfil do usuário autenticado | Todos |
| PATCH | `/api/users/me` | Atualizar perfil | Todos |
| DELETE | `/api/users/me` | Deletar conta | Todos |
| GET | `/api/users` | Listar todos os usuários | ADMIN |

### Restaurantes (6 endpoints)

| Método | Endpoint | Descrição | Roles |
|--------|----------|-----------|-------|
| POST | `/api/restaurants` | Criar restaurante | ADMIN |
| GET | `/api/restaurants` | Listar restaurantes ativos | Público |
| GET | `/api/restaurants/:id` | Detalhes do restaurante | Público |
| PATCH | `/api/restaurants/:id` | Atualizar restaurante | ADMIN/OWNER |
| DELETE | `/api/restaurants/:id` | Deletar restaurante | ADMIN |
| POST | `/api/restaurants/:id/image` | Upload de imagem | ADMIN/OWNER |

### Produtos (6 endpoints)

| Método | Endpoint | Descrição | Roles |
|--------|----------|-----------|-------|
| POST | `/api/products` | Criar produto | ADMIN/OWNER |
| GET | `/api/products` | Listar produtos (com filtros) | Público |
| GET | `/api/products/:id` | Detalhes do produto | Público |
| PATCH | `/api/products/:id` | Atualizar produto | ADMIN/OWNER |
| DELETE | `/api/products/:id` | Deletar produto | ADMIN/OWNER |
| POST | `/api/products/:id/image` | Upload de imagem | ADMIN/OWNER |

## 📚 Documentação Adicional

- **[Guia 2FA](./docs/2FA-GUIDE.md)** - Implementação completa de autenticação de 2 fatores
- **[Guia Upload](./docs/UPLOAD.md)** - Sistema de upload de imagens com Multer
- **[Swagger UI](http://localhost:3000/api/docs)** - Documentação interativa (quando o servidor estiver rodando)

## 🧪 Testes

```bash
# Testes unitários
npm run test

# Testes e2e
npm run test:e2e

# Cobertura de testes
npm run test:cov
```

## 🐛 Debugging

```bash
# Verificar erros de compilação
npm run build

# Verificar formatação
npm run format

# Lint
npm run lint
```

## 📝 Scripts Úteis

```bash
# Gerar novo módulo
npm run nest g module nome-modulo

# Gerar novo controller
npm run nest g controller nome-controller

# Gerar novo service
npm run nest g service nome-service

# Gerar resource completo (CRUD)
npm run nest g resource nome-resource

# Prisma Studio (GUI do banco)
npx prisma studio

# Resetar banco de dados
npx prisma migrate reset
```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie sua feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

## 👨‍💻 Desenvolvido por

**MrTch0o** - [GitHub](https://github.com/MrTch0o)

---

⭐ Se este projeto te ajudou, considere dar uma estrela!
