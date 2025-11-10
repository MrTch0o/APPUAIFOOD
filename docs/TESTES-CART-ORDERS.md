# 🛒🍕 GUIA DE TESTES - FLUXO DE CARRINHO E PEDIDOS

**Data:** 08/11/2025  
**Status:** ✅ Módulos implementados (Cart + Orders)  
**Total de Endpoints:** 35 (24 anteriores + 11 novos)

---

## 📝 RESUMO DAS NOVIDADES

### ✨ Novos Módulos

#### 🛒 **Cart** (Carrinho)
- 5 endpoints para gerenciar carrinho de compras
- Cálculo automático de totais (subtotal + entrega)
- Validação de disponibilidade de produtos
- Um carrinho por usuário, múltiplos produtos

#### 📦 **Orders** (Pedidos)
- 6 endpoints para criar e gerenciar pedidos
- Criação a partir do carrinho ou itens diretos
- Validação de regras de negócio
- Workflow de status com transições válidas
- Permissões por role (CLIENT, OWNER, ADMIN)

---

## 🔄 FLUXO COMPLETO DO PEDIDO

```
1️⃣ Login como CLIENT
    ↓
2️⃣ Navegar restaurantes (GET /restaurants)
    ↓
3️⃣ Ver produtos (GET /products?restaurantId=xxx)
    ↓
4️⃣ Adicionar ao carrinho (POST /cart/items)
    ↓
5️⃣ Ver carrinho com totais (GET /cart)
    ↓
6️⃣ Criar pedido (POST /orders)
    ↓ (carrinho é limpo automaticamente)
7️⃣ Ver histórico de pedidos (GET /orders)
    ↓
8️⃣ Ver detalhes do pedido (GET /orders/:id)
    ↓
9️⃣ Login como OWNER
    ↓
🔟 Ver pedidos do restaurante (GET /orders/restaurant/:id)
    ↓
1️⃣1️⃣ Atualizar status (PATCH /orders/:id/status)
```

---

## 🧪 TESTES PASSO A PASSO

### 📌 PRÉ-REQUISITOS

1. ✅ Servidor rodando em http://localhost:3000
2. ✅ Seed executado (`npm run seed`)
3. ✅ Swagger aberto em http://localhost:3000/api/docs

---

### 1️⃣ AUTENTICAÇÃO

#### 🔑 Login CLIENT
**Endpoint:** `POST /api/auth/login`

```json
{
  "email": "maria@example.com",
  "password": "Maria@123"
}
```

**✅ Resultado Esperado:**
```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid",
      "email": "maria@example.com",
      "name": "Maria Silva",
      "role": "CLIENT"
    }
  }
}
```

**⚠️ Copie o `access_token` e clique em "Authorize" no Swagger**

---

### 2️⃣ NAVEGAR RESTAURANTES

#### 📍 Listar Restaurantes
**Endpoint:** `GET /api/restaurants`  
**Auth:** Não requer

**✅ Resultado Esperado:**
- Lista com 5 restaurantes
- Pegue o `id` da **Pizzaria Bella Napoli** ou **Burger House**

---

### 3️⃣ VER PRODUTOS

#### 🍕 Produtos da Pizzaria
**Endpoint:** `GET /api/products?restaurantId={id-da-pizzaria}`  
**Auth:** Não requer

**✅ Resultado Esperado:**
- Lista com pizzas (Margherita, Calabresa, Quatro Queijos, etc.)
- Pegue alguns `productId` para adicionar ao carrinho

---

### 4️⃣ ADICIONAR AO CARRINHO

#### ➕ Adicionar Pizza Margherita
**Endpoint:** `POST /api/cart/items`  
**Auth:** Bearer Token (CLIENT)

```json
{
  "productId": "id-da-pizza-margherita",
  "quantity": 2
}
```

**✅ Resultado Esperado:**
```json
{
  "success": true,
  "data": {
    "id": "cart-item-uuid",
    "quantity": 2,
    "product": {
      "id": "product-uuid",
      "name": "Pizza Margherita",
      "price": 45.0,
      "restaurant": {
        "id": "restaurant-uuid",
        "name": "Pizzaria Bella Napoli",
        "deliveryFee": 5.0
      }
    }
  }
}
```

#### ➕ Adicionar Mais Produtos
**Repita** adicionando:
- Pizza Calabresa (quantidade: 1)
- Refrigerante (quantidade: 2)

**📝 Observação:** Todos devem ser do **mesmo restaurante**!

---

### 5️⃣ VER CARRINHO COM TOTAIS

#### 🛒 Obter Carrinho
**Endpoint:** `GET /api/cart`  
**Auth:** Bearer Token (CLIENT)

**✅ Resultado Esperado:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "item-1-uuid",
        "quantity": 2,
        "product": {
          "id": "product-1-uuid",
          "name": "Pizza Margherita",
          "price": 45.0
        }
      },
      {
        "id": "item-2-uuid",
        "quantity": 1,
        "product": {
          "id": "product-2-uuid",
          "name": "Pizza Calabresa",
          "price": 48.0
        }
      },
      {
        "id": "item-3-uuid",
        "quantity": 2,
        "product": {
          "id": "product-3-uuid",
          "name": "Refrigerante Lata",
          "price": 5.0
        }
      }
    ],
    "summary": {
      "itemCount": 3,
      "totalQuantity": 5,
      "subtotal": 148.0,
      "deliveryFee": 5.0,
      "total": 153.0,
      "restaurantId": "restaurant-uuid",
      "restaurantName": "Pizzaria Bella Napoli",
      "minimumOrder": 20.0,
      "meetsMinimumOrder": true
    }
  }
}
```

**✅ Validar:**
- [ ] `subtotal` = (45 × 2) + (48 × 1) + (5 × 2) = 148
- [ ] `deliveryFee` = 5.0
- [ ] `total` = 153.0
- [ ] `meetsMinimumOrder` = true

---

### 6️⃣ CRIAR PEDIDO

Primeiro, precisamos de um endereço. Como o seed já criou endereços, vamos buscar:

#### 📍 Ver Perfil (para pegar addressId)
**Endpoint:** `GET /api/users/me`  
**Auth:** Bearer Token (CLIENT)

**📝 Copie o ID de um dos endereços disponíveis**

#### 📦 Criar Pedido a partir do Carrinho
**Endpoint:** `POST /api/orders`  
**Auth:** Bearer Token (CLIENT)

```json
{
  "addressId": "address-uuid-aqui",
  "paymentMethod": "Cartão de Crédito",
  "notes": "Entregar na portaria"
}
```

**✅ Resultado Esperado:**
```json
{
  "success": true,
  "data": {
    "id": "order-uuid",
    "status": "PENDING",
    "subtotal": 148.0,
    "deliveryFee": 5.0,
    "total": 153.0,
    "paymentMethod": "Cartão de Crédito",
    "notes": "Entregar na portaria",
    "items": [
      {
        "id": "order-item-1-uuid",
        "quantity": 2,
        "price": 45.0,
        "subtotal": 90.0,
        "product": {
          "id": "product-uuid",
          "name": "Pizza Margherita"
        }
      }
      // ... outros itens
    ],
    "restaurant": {
      "id": "restaurant-uuid",
      "name": "Pizzaria Bella Napoli",
      "phone": "31333333333",
      "deliveryTime": "30-45 min"
    },
    "address": {
      "street": "Rua das Flores",
      "number": "123",
      "neighborhood": "Centro",
      "city": "Belo Horizonte"
    }
  }
}
```

**✅ Validar:**
- [ ] Status inicial = `PENDING`
- [ ] Preços capturados no momento do pedido
- [ ] Carrinho foi limpo (vá em `GET /cart` para confirmar)

---

### 7️⃣ VER HISTÓRICO DE PEDIDOS

#### 📋 Listar Pedidos do Usuário
**Endpoint:** `GET /api/orders`  
**Auth:** Bearer Token (CLIENT)

**✅ Resultado Esperado:**
- Lista com pelo menos 1 pedido (o que você acabou de criar)
- Mais os 2 pedidos de exemplo do seed

#### 📋 Filtrar por Status
**Endpoint:** `GET /api/orders?status=PENDING`

**✅ Resultado Esperado:**
- Apenas pedidos com status PENDING

---

### 8️⃣ VER DETALHES DO PEDIDO

#### 🔍 Detalhes Completos
**Endpoint:** `GET /api/orders/{id-do-pedido-criado}`  
**Auth:** Bearer Token (CLIENT)

**✅ Resultado Esperado:**
- Todos os detalhes do pedido
- Itens com produtos
- Endereço completo
- Informações do restaurante

---

### 9️⃣ LOGIN COMO OWNER

#### 🔑 Login RESTAURANT_OWNER
**Endpoint:** `POST /api/auth/login`

```json
{
  "email": "dono.pizzaria@example.com",
  "password": "Pizza@123"
}
```

**⚠️ Copie o novo `access_token` e atualize no "Authorize"**

---

### 🔟 VER PEDIDOS DO RESTAURANTE

#### 📦 Listar Pedidos do Seu Restaurante
**Endpoint:** `GET /api/orders/restaurant/{restaurant-id}`  
**Auth:** Bearer Token (OWNER)

**✅ Resultado Esperado:**
- Lista com todos os pedidos da Pizzaria Bella Napoli
- Incluindo o pedido que você criou como CLIENT
- Informações do cliente visíveis (nome, telefone)

#### 📦 Filtrar Pedidos PENDING
**Endpoint:** `GET /api/orders/restaurant/{restaurant-id}?status=PENDING`

---

### 1️⃣1️⃣ ATUALIZAR STATUS DO PEDIDO

#### ✅ Confirmar Pedido (PENDING → CONFIRMED)
**Endpoint:** `PATCH /api/orders/{order-id}/status`  
**Auth:** Bearer Token (OWNER)

```json
{
  "status": "CONFIRMED"
}
```

**✅ Resultado Esperado:**
```json
{
  "success": true,
  "data": {
    "id": "order-uuid",
    "status": "CONFIRMED",
    // ... resto dos dados
  }
}
```

#### 👨‍🍳 Preparando Pedido (CONFIRMED → PREPARING)
**Endpoint:** `PATCH /api/orders/{order-id}/status`

```json
{
  "status": "PREPARING"
}
```

#### 🚗 Saiu para Entrega (PREPARING → OUT_FOR_DELIVERY)
```json
{
  "status": "OUT_FOR_DELIVERY"
}
```

#### ✅ Pedido Entregue (OUT_FOR_DELIVERY → DELIVERED)
```json
{
  "status": "DELIVERED"
}
```

**✅ Workflow Completo:**
```
PENDING → CONFIRMED → PREPARING → OUT_FOR_DELIVERY → DELIVERED
```

---

## ❌ TESTES DE VALIDAÇÃO (Devem Falhar)

### 🚫 Tentar Adicionar Produtos de Restaurantes Diferentes

**Cenário:** Você tem produtos da Pizzaria no carrinho

**Teste:** Adicionar produto da Burger House

**Endpoint:** `POST /api/cart/items`
```json
{
  "productId": "id-de-produto-da-burger-house",
  "quantity": 1
}
```

**❌ Resultado Esperado:** `400 Bad Request`
```json
{
  "success": false,
  "message": "Todos os produtos devem ser do mesmo restaurante",
  "statusCode": 400
}
```

---

### 🚫 Tentar Criar Pedido Sem Atingir Valor Mínimo

**Cenário:** Pedido mínimo = R$ 20,00

**Teste:** Adicionar apenas 1 refrigerante (R$ 5,00)

**Endpoint:** `POST /api/orders`

**❌ Resultado Esperado:** `400 Bad Request`
```json
{
  "message": "Pedido mínimo de R$ 20.00. Seu pedido: R$ 5.00"
}
```

---

### 🚫 CLIENT Tenta Ver Pedidos de Outro Usuário

**Endpoint:** `GET /api/orders/{id-pedido-de-outro-cliente}`  
**Auth:** Bearer Token (CLIENT)

**❌ Resultado Esperado:** `403 Forbidden`

---

### 🚫 CLIENT Tenta Mudar Status (Exceto Cancelar)

**Endpoint:** `PATCH /api/orders/{order-id}/status`  
**Auth:** Bearer Token (CLIENT)

```json
{
  "status": "CONFIRMED"
}
```

**❌ Resultado Esperado:** `403 Forbidden`
```json
{
  "message": "Você só pode cancelar pedidos"
}
```

---

### ✅ CLIENT Pode Cancelar Pedido PENDING

**Endpoint:** `PATCH /api/orders/{order-id}/status`  
**Auth:** Bearer Token (CLIENT)

```json
{
  "status": "CANCELLED"
}
```

**✅ Resultado Esperado:** `200 OK` (apenas se o pedido estiver PENDING)

---

### 🚫 Transição de Status Inválida

**Cenário:** Pedido está PREPARING

**Teste:** Tentar mudar direto para DELIVERED (pulando OUT_FOR_DELIVERY)

```json
{
  "status": "DELIVERED"
}
```

**❌ Resultado Esperado:** `400 Bad Request`
```json
{
  "message": "Não é possível mudar status de PREPARING para DELIVERED"
}
```

---

## 🎯 ENDPOINTS DE GERENCIAMENTO DO CARRINHO

### ✏️ Atualizar Quantidade
**Endpoint:** `PATCH /api/cart/items/{cart-item-id}`

```json
{
  "quantity": 5
}
```

**✅ Atualiza a quantidade do item no carrinho**

---

### 🗑️ Remover Item Individual
**Endpoint:** `DELETE /api/cart/items/{cart-item-id}`

**✅ Remove apenas esse item do carrinho**

---

### 🧹 Limpar Todo o Carrinho
**Endpoint:** `DELETE /api/cart/clear`

**✅ Remove todos os itens do carrinho**

---

## 📊 CHECKLIST DE VALIDAÇÃO

### Cart (Carrinho)
- [ ] Adicionar produto ao carrinho
- [ ] Adicionar produto já existente (incrementa quantidade)
- [ ] Ver carrinho com cálculo de totais correto
- [ ] Atualizar quantidade de item
- [ ] Remover item individual
- [ ] Limpar carrinho completo
- [ ] Validação: produto indisponível
- [ ] Validação: restaurante inativo

### Orders (Pedidos)
- [ ] Criar pedido a partir do carrinho
- [ ] Carrinho é limpo após criar pedido
- [ ] Preços capturados no momento do pedido
- [ ] Listar pedidos do usuário
- [ ] Filtrar pedidos por status
- [ ] Ver detalhes de um pedido
- [ ] OWNER ver pedidos do seu restaurante
- [ ] Atualizar status do pedido (OWNER/ADMIN)
- [ ] CLIENT cancelar pedido PENDING
- [ ] Validação: produtos de restaurantes diferentes
- [ ] Validação: pedido mínimo não atingido
- [ ] Validação: endereço de outro usuário
- [ ] Validação: transições de status inválidas

### Workflow de Status
- [ ] PENDING → CONFIRMED
- [ ] CONFIRMED → PREPARING
- [ ] PREPARING → OUT_FOR_DELIVERY
- [ ] OUT_FOR_DELIVERY → DELIVERED
- [ ] PENDING → CANCELLED (CLIENT)
- [ ] CONFIRMED → CANCELLED (OWNER/ADMIN)
- [ ] ❌ DELIVERED → qualquer (não permitido)
- [ ] ❌ CANCELLED → qualquer (não permitido)

### Permissões
- [ ] CLIENT cria pedidos
- [ ] CLIENT vê apenas seus pedidos
- [ ] CLIENT cancela apenas PENDING
- [ ] OWNER vê pedidos do seu restaurante
- [ ] OWNER atualiza status dos seus pedidos
- [ ] ADMIN vê todos os pedidos
- [ ] ADMIN deleta pedidos

---

## 🎓 CONCEITOS APRENDIDOS

### 1. **State Machine** (Máquina de Estados)
- Status do pedido segue workflow pré-definido
- Transições válidas configuradas no service
- Não pode voltar de status final (DELIVERED, CANCELLED)

### 2. **Price Capture**
- Preço capturado no momento do pedido
- Mudanças futuras no preço do produto não afetam pedidos antigos
- Integridade financeira garantida

### 3. **Business Rules Validation**
- Pedido mínimo do restaurante
- Produtos do mesmo restaurante
- Disponibilidade de produtos
- Ownership verification

### 4. **Role-Based Access Control**
- Diferentes permissões por role
- CLIENT: cria e vê seus pedidos
- OWNER: gerencia pedidos do seu restaurante
- ADMIN: acesso total

### 5. **Calculated Fields**
- Subtotal, deliveryFee, total calculados dinamicamente
- Summary do carrinho com agregações
- Meets minimum order verification

---

## 🚀 PRÓXIMOS PASSOS

Após validar todos os testes:

1. **Implementar Módulo de Endereços** (se ainda não existe CRUD completo)
2. **Implementar Módulo de Avaliações** (Reviews)
3. **Adicionar Notificações em Tempo Real** (WebSockets para status do pedido)
4. **Implementar Pagamentos** (integração com gateway)
5. **Dashboard de Métricas** (para OWNER/ADMIN)

---

**Documento criado em:** 08/11/2025 14:50  
**Versão:** 1.0  
**Etapa:** 6 - Cart & Orders System ✅
