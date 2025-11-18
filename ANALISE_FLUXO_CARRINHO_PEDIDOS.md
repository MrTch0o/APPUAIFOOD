# 📋 Análise Completa - Fluxo de Carrinho, Checkout e Pedidos

## 🔍 REVISÃO DO PROJETO

### 1. BANCO DE DADOS (Prisma Schema)

#### ✅ Modelos Existentes:
- **User**: Usuários com roles (CLIENT, RESTAURANT_OWNER, ADMIN)
- **Restaurant**: Restaurantes com proprietário
- **Product**: Produtos com categorias
- **CartItem**: Itens do carrinho (relação user ↔ product)
- **Order**: Pedidos com status (PENDING, CONFIRMED, PREPARING, OUT_FOR_DELIVERY, DELIVERED, CANCELLED)
- **OrderItem**: Itens dentro de pedidos
- **Address**: Endereços dos usuários
- **Review**: Avaliações de pedidos

#### 📊 Estrutura de Dados:
```
Enum OrderStatus: PENDING | CONFIRMED | PREPARING | OUT_FOR_DELIVERY | DELIVERED | CANCELLED
Enum UserRole: CLIENT | RESTAURANT_OWNER | ADMIN
Enum PaymentMethod: CREDIT_CARD | DEBIT_CARD | PIX | CASH
```

---

### 2. BACKEND - ENDPOINTS DISPONÍVEIS

#### 🛒 Carrinho (`/cart`)
| Método | Endpoint | Autenticação | Descrição |
|--------|----------|--------------|-----------|
| POST | `/cart/items` | JWT | Adicionar produto ao carrinho |
| GET | `/cart` | JWT | Obter carrinho do usuário |
| PATCH | `/cart/items/:id` | JWT | Atualizar quantidade |
| DELETE | `/cart/items/:id` | JWT | Remover item do carrinho |
| DELETE | `/cart/clear` | JWT | Limpar todo carrinho |

**Validações Implementadas:**
- ✅ Validar disponibilidade do produto
- ✅ Validar atividade do restaurante
- ✅ Impedir mistura de produtos de restaurantes diferentes
- ✅ Impedir duplicatas (incrementa quantidade automaticamente)

#### 📦 Endereços (`/addresses`)
| Método | Endpoint | Autenticação | Descrição |
|--------|----------|--------------|-----------|
| POST | `/addresses` | JWT | Criar novo endereço |
| GET | `/addresses` | JWT | Listar endereços do usuário |
| GET | `/addresses/:id` | JWT | Obter endereço específico |
| PATCH | `/addresses/:id` | JWT | Atualizar endereço |
| PATCH | `/addresses/:id/default` | JWT | Marcar como padrão |
| DELETE | `/addresses/:id` | JWT | Remover endereço |

**Regras de Negócio:**
- ✅ Um usuário pode ter múltiplos endereços
- ✅ Um endereço pode ser marcado como padrão
- ✅ Não pode remover endereço com pedidos ativos

#### 📋 Pedidos (`/orders`)
| Método | Endpoint | Autenticação | Descrição |
|--------|----------|--------------|-----------|
| POST | `/orders` | JWT (CLIENT, OWNER, ADMIN) | Criar pedido |
| GET | `/orders` | JWT | Listar pedidos do usuário |
| GET | `/orders/:id` | JWT | Obter detalhes do pedido |
| GET | `/orders/restaurant/:restaurantId` | JWT (OWNER, ADMIN) | Listar pedidos do restaurante |
| PATCH | `/orders/:id/status` | JWT | Atualizar status |
| DELETE | `/orders/:id` | JWT (ADMIN) | Deletar pedido |

**Transições de Status Permitidas:**
- CLIENT: PENDING → CANCELLED (cancelar pedido)
- OWNER/ADMIN: PENDING → CONFIRMED → PREPARING → OUT_FOR_DELIVERY → DELIVERED

---

### 3. FRONTEND - SERVIÇOS EXISTENTES

#### ✅ Implementados:
- `cartService.ts` - Gerenciamento de carrinho
- `addressService.ts` - Gerenciamento de endereços
- `orderService.ts` - Criação e cancelamento de pedidos
- `authService.ts` - Autenticação e registro
- `userService.ts` - Perfil do usuário

#### ⚠️ Observações no `orderService.ts`:
```typescript
// Problema atual: Não implementa corretamente o endpoint
async cancel(id: string) {
  // Tenta usar /orders/:id/cancel (não existe)
  // Deveria usar /orders/:id/status com status CANCELLED
}

async create(data: CreateOrderData) {
  // Falta propriedade 'items' para pedidos com itens específicos
  // Deveria suportar também criação com itens customizados
}
```

#### Páginas Existentes:
- ✅ `app/` - Home (listar restaurantes)
- ✅ `app/restaurante/[id]` - Detalhes do restaurante e produtos
- ✅ `app/perfil` - Perfil do usuário
- ✅ `owner/*` - Painel do proprietário

#### Páginas Faltando (a implementar):
- ❌ `app/carrinho` - Carrinho de compras
- ❌ `app/checkout` - Página de checkout
- ❌ `app/meus-pedidos` - Histórico de pedidos
- ❌ `app/confirmacao-pedido/[id]` - Confirmação após criação

---

### 4. REQUISITOS DE NEGÓCIO

#### 📱 Fluxo do Cliente (USER/CLIENT):

1. **Home Page** (`/`)
   - Listar restaurantes em destaque
   - Filtrar por categoria
   - Pesquisar por nome/comida

2. **Detalhes do Restaurante** (`/restaurante/[id]`)
   - Exibir menu (produtos)
   - Adicionar produtos ao carrinho ✅ (backend pronto)
   - Visualizar detalhes do produto

3. **Carrinho** (`/carrinho`) - ❌ PÁGINA NÃO EXISTE
   - Listar produtos adicionados
   - Editar quantidades
   - Remover produtos
   - Mostrar subtotal + taxa de entrega
   - Botão "Ir para Checkout"

4. **Checkout** (`/checkout`) - ❌ PÁGINA NÃO EXISTE
   - Selecionar endereço de entrega (com opção de criar novo)
   - Selecionar método de pagamento
   - Revisar pedido
   - Botão "Confirmar Pedido"

5. **Confirmação de Pedido** (`/confirmacao-pedido/[id]`) - ❌ PÁGINA NÃO EXISTE
   - Mostrar número do pedido
   - Tempo estimado de entrega
   - Endereço de entrega
   - Opções: "Rastrear Pedido" e "Voltar para Home"

6. **Meus Pedidos** (`/meus-pedidos`) - ❌ PÁGINA NÃO EXISTE
   - Listar todos os pedidos do usuário
   - Filtrar por status
   - Visualizar detalhes de cada pedido
   - Cancelar pedido (se PENDING)
   - Acessar restaurante

---

#### 🏪 Fluxo do Proprietário (RESTAURANT_OWNER):

**Regra Crítica:** Pedidos devem aparecer no painel SOMENTE quando status ≠ PENDING

1. **Painel de Pedidos** (`/owner/pedidos`) - ❌ PÁGINA NÃO EXISTE
   - Listar pedidos CONFIRMADOS, PREPARING, OUT_FOR_DELIVERY, DELIVERED
   - Filtrar por status
   - NÃO EXIBIR pedidos com status PENDING ou CANCELLED
   - Atualizar status do pedido
   - Visualizar detalhes (cliente, endereço, itens, etc)

2. **Detalhes do Pedido** (modal ou página) - ❌ PÁGINA NÃO EXISTE
   - Informações completas do pedido
   - Lista de itens (com quantidade e preço)
   - Dados do cliente
   - Endereço de entrega
   - Método de pagamento

---

### 5. FLUXO DE PAGAMENTO E VISIBILIDADE DE PEDIDOS

#### 🔴 Problema a Resolver:
O protocolo atual não tem uma coluna `isPaid` (pago) no modelo Order.

#### ✅ Solução Proposta:

**Opção A: Adicionar campo `isPaid` no Order** (Recomendado)
```prisma
model Order {
  id              String
  status          OrderStatus
  isPaid          Boolean  @default(false)  // Novo campo
  paymentMethod   String
  ...
}
```

**Regra de Negócio:**
1. Cliente paga durante checkout (simular integração com gateway)
2. Status automaticamente muda para PENDING após confirmação de pagamento
3. Restaurante vê pedido SOMENTE se isPaid = true
4. Pedidos não pagos não aparecem para ninguém

**Fluxo:**
```
1. Cliente finaliza checkout e paga
2. Order criada com status PENDING e isPaid = false
3. Sistema processa pagamento (simular)
4. Se sucesso: isPaid = true
5. Restaurante recebe notificação e vê pedido no painel
6. Proprietário muda status: PENDING → CONFIRMED → PREPARING → OUT_FOR_DELIVERY → DELIVERED
```

---

### 6. PADRÃO DE INTERFACE

#### 📐 Componentes a Reutilizar:
- `PageHeader` - Header com título e botão voltar
- `BackButton` - Botão voltar customizado
- Paleta de cores: Orange (#ee7c2b), Brown (#1b130d), Beige (#f8f7f6)
- Cards com sombras
- Tabelas para listar itens

#### 🎨 Estilo das Páginas Novas:
- Seguir mesmo padrão do `/owner/*`
- Usar TailwindCSS
- Espaçamento consistente
- Feedback visual (loading, success, error)
- Responsividade mobile-first

---

### 7. CHECKLIST DE IMPLEMENTAÇÃO

#### Fase 1: Backend (se necessário ajustar)
- [ ] Adicionar campo `isPaid` no modelo Order
- [ ] Atualizar Orders Service para validar `isPaid` antes de mostrar ao restaurante
- [ ] Corrigir endpoint de cancelamento (usar `/orders/:id/status` com CANCELLED)
- [ ] Criar/Atualizar DTOs para suportar todos os campos necessários

#### Fase 2: Frontend - Página de Carrinho
- [ ] Criar `/app/carrinho/page.tsx`
- [ ] Implementar exibição de itens do carrinho
- [ ] Funcionalidade para editar quantidades
- [ ] Funcionalidade para remover itens
- [ ] Cálculo dinâmico de subtotal + taxa de entrega
- [ ] Integrar com cartService

#### Fase 3: Frontend - Página de Checkout
- [ ] Criar `/app/checkout/page.tsx`
- [ ] Listar endereços do usuário
- [ ] Opção de criar novo endereço
- [ ] Selecionar método de pagamento
- [ ] Resumo do pedido
- [ ] Integrar com orderService e addressService
- [ ] Simulação de pagamento

#### Fase 4: Frontend - Confirmação de Pedido
- [ ] Criar `/app/confirmacao-pedido/[id]/page.tsx`
- [ ] Exibir dados do pedido criado
- [ ] Número do pedido
- [ ] Tempo estimado
- [ ] Botões de ação (rastrear, home)

#### Fase 5: Frontend - Meus Pedidos
- [ ] Criar `/app/meus-pedidos/page.tsx`
- [ ] Listar pedidos do usuário
- [ ] Filtro por status
- [ ] Modal/página de detalhes
- [ ] Opção de cancelar
- [ ] Integrar com orderService

#### Fase 6: Frontend - Painel de Pedidos do Owner
- [ ] Criar `/app/owner/pedidos/page.tsx`
- [ ] Listar SOMENTE pedidos com isPaid=true
- [ ] Filtrar por status (excluir PENDING)
- [ ] Atualizar status do pedido
- [ ] Modal/página de detalhes
- [ ] Integrar com ownerService

---

## 📝 NOTAS IMPORTANTES

1. **Validações Críticas:**
   - Carrinho só aceita produtos do mesmo restaurante
   - Pedidos só podem ser criados se carrinho não estiver vazio
   - Apenas restaurante do pedido ou ADMIN podem alterar status
   - Cliente só pode cancelar se status = PENDING
   - Restaurante só vê pedidos se isPaid = true

2. **Fluxo de Dados:**
   - Carrinho → Checkout → Criar Pedido → Confirmação
   - Restaurante recebe notificação quando pedido é pago
   - Cliente recebe confirmação e pode rastrear

3. **Segurança:**
   - Validar autorização em todo endpoint
   - Não expor dados sensíveis (telefone, endereço de outros usuários)
   - Validar modificações de status (só transições válidas)

4. **Tipagem Frontend:**
   - Atualizar `types/index.ts` com campo `isPaid`
   - Adicionar tipos para respostas de criar pedido
   - Criar tipos para respostas de confirmação

---

## 🎯 PRÓXIMOS PASSOS

1. Revisar e aprovar esta análise
2. Decidir se adiciona campo `isPaid` no banco
3. Implementar as 6 fases na ordem proposta
4. Testes de integração entre frontend e backend
5. Validação do fluxo completo de cliente e restaurante
