# 📋 PLANO DE DESENVOLVIMENTO COMPLETO - UAIFOOD

## 🎯 Visão Geral

Desenvolvimento completo de uma aplicação de delivery de comida (UAIFOOD) seguindo as melhores práticas de desenvolvimento web, com foco em segurança, arquitetura escalável e conceitos acadêmicos.

---

## 📊 ETAPAS DO PROJETO

### ✅ ETAPA 1: Configuração Inicial e Documentação
**Status**: ✅ Completo  
**Commit**: `37002f5`  
**Tempo estimado**: 2-3 horas

#### Entregas:
- [x] README.md principal detalhado com:
  - Descrição do projeto
  - Tecnologias utilizadas (NestJS, React, Prisma, PostgreSQL, Docker)
  - Arquitetura do sistema
  - Guia de instalação completo
  - Documentação de uso
  - Padrões e convenções
  
- [x] Documentação da modelagem do banco de dados
  - Diagrama ER
  - 7 entidades documentadas
  - Relacionamentos
  - Regras de negócio
  
- [x] Arquivos de configuração
  - `.gitignore`
  - `LICENSE` (MIT)
  - `docker-compose.yml`

#### Conceitos Abordados:
- ✓ Documentação técnica
- ✓ Arquitetura de software
- ✓ Modelagem de dados
- ✓ Versionamento com Git

---

### ✅ ETAPA 2: Setup do Backend (NestJS + PostgreSQL + Prisma)
**Status**: ✅ Completo  
**Commit**: `5d8cb80`  
**Tempo estimado**: 3-4 horas

#### Entregas:
- [x] Projeto NestJS inicializado
- [x] Dependências instaladas:
  - Prisma (ORM)
  - JWT e Passport (autenticação)
  - Bcrypt (hash de senhas)
  - Swagger (documentação)
  - Speakeasy (2FA)
  - Class Validator (validação)
  
- [x] Schema Prisma completo
  - 7 models: User, Restaurant, Product, Order, OrderItem, Address, Review
  - 2 enums: UserRole, OrderStatus
  - Relacionamentos definidos
  
- [x] Seed do banco de dados
  - 6 usuários de teste
  - 5 restaurantes
  - 30+ produtos
  - Pedidos e avaliações de exemplo
  
- [x] Configuração de ambiente (`.env`)
- [x] Dockerfile para backend

#### Conceitos Abordados:
- ✓ ORM Prisma
- ✓ Modelagem relacional
- ✓ Containerização (Docker)
- ✓ Gerenciamento de dependências

---

### 🔄 ETAPA 3: Módulos Core - Autenticação JWT
**Status**: 🔄 Em progresso  
**Tempo estimado**: 4-5 horas

#### Entregas Planejadas:
- [ ] Prisma Service configurado
- [ ] Módulo de Configuração (@nestjs/config)
- [ ] Módulo de Autenticação (Auth):
  - DTOs (LoginDto, RegisterDto, RefreshTokenDto)
  - JWT Strategy
  - Local Strategy
  - AuthService (login, register, refresh)
  - AuthController
  - Guards (JwtAuthGuard, RolesGuard)
  - Decorators (@GetUser, @Roles, @Public)
  
- [ ] Módulo de Usuários (Users):
  - DTOs (CreateUserDto, UpdateUserDto)
  - UsersService (CRUD)
  - UsersController
  - Testes unitários
  
- [ ] Exception Filters
- [ ] Transform Interceptors

#### Conceitos Abordados:
- Autenticação JWT
- Estratégias Passport
- Guards e Decorators
- Princípio SOLID (SRP, OCP, DIP)
- Validação de DTOs
- Testes unitários com Jest

---

### 🔜 ETAPA 4: Autenticação em Dois Fatores (2FA)
**Status**: 🔜 Planejado  
**Tempo estimado**: 3-4 horas

#### Entregas Planejadas:
- [ ] Serviço de 2FA:
  - Geração de secret (Speakeasy)
  - Geração de QR code
  - Validação de código TOTP
  - Ativação/desativação de 2FA
  
- [ ] Endpoints 2FA:
  - `POST /auth/2fa/generate` - Gerar QR code
  - `POST /auth/2fa/verify` - Verificar código
  - `POST /auth/2fa/enable` - Ativar 2FA
  - `POST /auth/2fa/disable` - Desativar 2FA
  
- [ ] Documentação Swagger do 2FA
- [ ] Testes de integração 2FA

#### Conceitos Abordados:
- **Autenticação em Dois Fatores (2FA)**
- Time-based One-Time Password (TOTP)
- Segurança da Informação
- QR codes

---

### 🔜 ETAPA 5: Módulos de Negócio - Restaurantes e Produtos
**Status**: 🔜 Planejado  
**Tempo estimado**: 4-5 horas

#### Entregas Planejadas:
- [ ] Módulo de Restaurantes:
  - DTOs (CreateRestaurantDto, UpdateRestaurantDto, FilterRestaurantDto)
  - RestaurantsService (CRUD, filtros, busca)
  - RestaurantsController
  - Upload de imagens
  - Cálculo automático de rating
  
- [ ] Módulo de Produtos:
  - DTOs (CreateProductDto, UpdateProductDto)
  - ProductsService (CRUD, filtros por restaurante/categoria)
  - ProductsController
  - Gerenciamento de disponibilidade
  
- [ ] Testes unitários
- [ ] Documentação Swagger

#### Conceitos Abordados:
- CRUD RESTful
- Filtros e paginação
- Upload de arquivos
- Relacionamentos no Prisma
- Princípios SOLID (SRP, OCP)

---

### 🔜 ETAPA 6: Módulos de Negócio - Pedidos e Avaliações
**Status**: 🔜 Planejado  
**Tempo estimado**: 5-6 horas

#### Entregas Planejadas:
- [ ] Módulo de Pedidos (Orders):
  - DTOs (CreateOrderDto, UpdateOrderStatusDto)
  - OrdersService (criar, listar, atualizar status)
  - OrdersController
  - Cálculo automático de totais
  - Máquina de estados para status
  - Histórico de pedidos
  
- [ ] Módulo de Avaliações (Reviews):
  - DTOs (CreateReviewDto)
  - ReviewsService
  - ReviewsController
  - Recálculo de rating do restaurante
  
- [ ] Módulo de Endereços (Addresses):
  - DTOs (CreateAddressDto, UpdateAddressDto)
  - AddressesService
  - AddressesController
  - Gerenciamento de endereço padrão
  
- [ ] Testes unitários e e2e
- [ ] Documentação Swagger

#### Conceitos Abordados:
- Lógica de negócio complexa
- Transações no banco
- Máquina de estados
- Cálculos automatizados
- API REST completa

---

### 🔜 ETAPA 7: Documentação Swagger e Testes Completos
**Status**: 🔜 Planejado  
**Tempo estimado**: 4-5 horas

#### Entregas Planejadas:
- [ ] Swagger configurado globalmente
- [ ] Documentação completa de todos os endpoints:
  - Descrições detalhadas
  - Exemplos de requisições
  - Schemas de resposta
  - Códigos de erro
  - Tags organizadas
  
- [ ] Testes unitários completos (coverage > 80%):
  - AuthService
  - UsersService
  - RestaurantsService
  - ProductsService
  - OrdersService
  
- [ ] Testes e2e principais:
  - Fluxo completo de registro e login
  - Fluxo de criação de pedido
  - Fluxo de avaliação
  
- [ ] Documentação de exemplos de uso da API

#### Conceitos Abordados:
- **Documentação Swagger/OpenAPI**
- **Testes unitários com Jest**
- Testes e2e
- Coverage de testes
- Mocks e stubs

---

### 🔜 ETAPA 8: Frontend - Setup e Autenticação
**Status**: 🔜 Planejado  
**Tempo estimado**: 5-6 horas

#### Entregas Planejadas:
- [ ] Projeto React + Vite + TypeScript
- [ ] Configuração Tailwind CSS
- [ ] Configuração React Router
- [ ] Configuração Axios (interceptors)
- [ ] Gerenciamento de estado (Zustand)
- [ ] React Query para cache

- [ ] Páginas de Autenticação:
  - Login
  - Cadastro
  - Recuperação de senha
  - Verificação 2FA
  
- [ ] Componentes reutilizáveis:
  - Button
  - Input
  - Card
  - Modal
  - Loading
  - Toast/Notifications
  
- [ ] Serviços de API:
  - AuthService
  - Interceptors JWT
  - Refresh token automático

#### Conceitos Abordados:
- React com TypeScript
- Vite (build tool)
- Tailwind CSS (utility-first)
- Gerenciamento de estado
- Autenticação no frontend
- Proteção de rotas

---

### 🔜 ETAPA 9: Frontend - Páginas Principais
**Status**: 🔜 Planejado  
**Tempo estimado**: 6-8 horas

#### Entregas Planejadas:
- [ ] Página Inicial/Explorar:
  - Barra de busca
  - Categorias de restaurantes
  - Lista/grid de restaurantes
  - Filtros (categoria, rating, entrega)
  
- [ ] Página de Detalhes do Restaurante:
  - Informações do restaurante
  - Menu categorizado
  - Adicionar ao carrinho
  - Avaliações
  
- [ ] Carrinho de Compras:
  - Lista de itens
  - Ajustar quantidades
  - Cálculo de totais
  - Botão de checkout
  
- [ ] Checkout:
  - Seleção de endereço
  - Método de pagamento
  - Resumo do pedido
  - Confirmação
  
- [ ] Página de Confirmação de Pedido
- [ ] Perfil do Usuário:
  - Meus pedidos
  - Meus endereços
  - Configurações
  - Segurança (2FA)

#### Conceitos Abordados:
- Componentização React
- Estados locais e globais
- Formulários com React Hook Form
- Validação client-side
- UX/UI design
- Responsividade

---

### 🔜 ETAPA 10: Dockerização, CI/CD e Deploy
**Status**: 🔜 Planejado  
**Tempo estimado**: 4-5 horas

#### Entregas Planejadas:
- [ ] Docker Compose completo:
  - PostgreSQL
  - Backend (NestJS)
  - Frontend (React)
  - Nginx (reverse proxy)
  
- [ ] Variáveis de ambiente para produção
- [ ] Health checks
- [ ] Volumes para persistência
- [ ] Networks isoladas

- [ ] GitHub Actions (CI/CD):
  - Testes automatizados no push
  - Lint e formatação
  - Build da aplicação
  - Deploy automático (opcional)
  
- [ ] Documentação de deploy:
  - Instruções para deploy local
  - Instruções para deploy em VPS
  - Configuração de domínio
  - SSL/TLS com Let's Encrypt
  
- [ ] README atualizado com instruções finais

#### Conceitos Abordados:
- **Docker e Docker Compose**
- Containerização completa
- CI/CD com GitHub Actions
- Deploy de aplicações
- Nginx como reverse proxy
- Variáveis de ambiente
- Segurança em produção

---

## 📈 CRONOGRAMA ESTIMADO

| Etapa | Descrição | Tempo | Status |
|-------|-----------|-------|--------|
| 1 | Configuração Inicial e Documentação | 2-3h | ✅ Completo |
| 2 | Setup do Backend | 3-4h | ✅ Completo |
| 3 | Módulos Core - Autenticação JWT | 4-5h | 🔄 Em progresso |
| 4 | Autenticação 2FA | 3-4h | 🔜 Planejado |
| 5 | Módulos - Restaurantes e Produtos | 4-5h | 🔜 Planejado |
| 6 | Módulos - Pedidos e Avaliações | 5-6h | 🔜 Planejado |
| 7 | Swagger e Testes Completos | 4-5h | 🔜 Planejado |
| 8 | Frontend - Setup e Autenticação | 5-6h | 🔜 Planejado |
| 9 | Frontend - Páginas Principais | 6-8h | 🔜 Planejado |
| 10 | Dockerização e CI/CD | 4-5h | 🔜 Planejado |
| **TOTAL** | | **40-51h** | **20% completo** |

---

## 🎓 CONCEITOS ACADÊMICOS COBERTOS

### ✅ Já Implementados:
- [x] Documentação técnica
- [x] Arquitetura de software
- [x] Modelagem de banco de dados relacional
- [x] ORM Prisma
- [x] Versionamento Git
- [x] Docker (básico)

### 🔄 Em Implementação:
- [ ] API REST
- [ ] SOLID
- [ ] Autenticação JWT

### 🔜 A Implementar:
- [ ] **Autenticação em Dois Fatores (2FA)**
- [ ] **Segurança da Informação** (bcrypt, JWT, HTTPS)
- [ ] **Princípios SOLID completos**
- [ ] **Swagger/OpenAPI**
- [ ] **Testes Unitários com Jest**
- [ ] Docker Compose avançado
- [ ] CI/CD

---

## 🔗 LINKS IMPORTANTES

- **Repositório**: https://github.com/MrTch0o/APPUAIFOOD
- **Branch Principal**: `main`
- **Commits**:
  - Etapa 1: `37002f5`
  - Etapa 2: `5d8cb80`

---

## 📝 OBSERVAÇÕES

- Cada etapa resulta em um commit no GitHub
- Commits seguem o padrão Conventional Commits
- Código totalmente tipado com TypeScript
- Cobertura de testes mínima de 80%
- Documentação Swagger em todos os endpoints
- Código segue princípios SOLID
- Variáveis de ambiente para configurações sensíveis

---

**Projeto**: UAIFOOD - Aplicativo de Delivery de Comida  
**Disciplina**: Desenvolvimento Web II  
**Desenvolvedor**: MrTch0o  
**Última atualização**: 4 de novembro de 2025
