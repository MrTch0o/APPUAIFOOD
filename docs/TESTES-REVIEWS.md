# 📋 Roteiro de Testes - Módulo de Avaliações

## 📍 Informações do Módulo
- **Módulo:** Reviews (Avaliações)
- **Total de Endpoints:** 5
- **Tag no Swagger:** `Avaliações`
- **Base URL:** `/api/reviews`

---

## ✅ Pré-requisitos

### 1. Criar dados necessários para testes

#### Passo 1: Criar usuário e autenticar
1. **Registrar usuário**:
   - `POST /api/auth/register`
   ```json
   {
     "name": "Teste Reviews",
     "email": "teste.reviews@test.com",
     "password": "Senha@123",
     "phone": "31988776655"
   }
   ```

2. **Fazer login**:
   - `POST /api/auth/login`
   ```json
   {
     "email": "teste.reviews@test.com",
     "password": "Senha@123"
   }
   ```
   - ✅ **Copie o `accessToken`**
   - 🔐 **Clique em "Authorize" no Swagger e cole o token**

#### Passo 2: Criar restaurante (se não tiver)
- `POST /api/restaurants`
```json
{
  "name": "Restaurante Teste",
  "description": "Restaurante para testes",
  "address": "Rua Teste, 123",
  "phone": "31999887766",
  "category": "BRASILEIRA"
}
```
- 📝 **Anote o `id` do restaurante**

#### Passo 3: Criar produto
- `POST /api/products`
```json
{
  "restaurantId": "ID_DO_RESTAURANTE",
  "name": "Prato Teste",
  "description": "Prato para testes",
  "price": 25.90,
  "category": "PRATO_PRINCIPAL",
  "available": true
}
```
- 📝 **Anote o `id` do produto**

#### Passo 4: Criar endereço
- `POST /api/addresses`
```json
{
  "label": "Casa",
  "street": "Rua das Flores",
  "number": "123",
  "neighborhood": "Centro",
  "city": "Belo Horizonte",
  "state": "MG",
  "zipCode": "30110-000",
  "isDefault": true
}
```
- 📝 **Anote o `id` do endereço**

#### Passo 5: Adicionar produto ao carrinho
- `POST /api/cart/items`
```json
{
  "productId": "ID_DO_PRODUTO",
  "quantity": 2
}
```

#### Passo 6: Criar pedido
- `POST /api/orders`
```json
{
  "addressId": "ID_DO_ENDERECO",
  "paymentMethod": "PIX"
}
```
- 📝 **Anote o `id` do pedido**

#### Passo 7: Atualizar status do pedido para DELIVERED
⚠️ **IMPORTANTE**: Você precisa alterar o status do pedido para DELIVERED antes de avaliar

- `PATCH /api/orders/{orderId}/status`
```json
{
  "status": "DELIVERED"
}
```

---

## 🧪 Testes dos Endpoints

### 1️⃣ POST /api/reviews - Criar Avaliação

#### Teste 1.1: Criar avaliação com sucesso
**Request:**
```json
{
  "orderId": "ID_DO_PEDIDO_ENTREGUE",
  "rating": 5,
  "comment": "Comida excelente! Entrega rápida e comida quentinha."
}
```

**Resultado Esperado:**
- ✅ Status: `201 Created`
- ✅ Resposta contém: `message: "Avaliação criada com sucesso"`
- ✅ Resposta contém: objeto `review` com `id`, `rating`, `comment`, `user`, `order`
- ✅ Rating do restaurante deve ser atualizado
- 📝 **Anote o `id` da avaliação criada**

---

#### Teste 1.2: Tentar avaliar pedido não entregue
- Crie um novo pedido (não mude o status para DELIVERED)
- Tente criar uma avaliação para ele

**Resultado Esperado:**
- ❌ Status: `400 Bad Request`
- ❌ Mensagem: "Você só pode avaliar pedidos que foram entregues"

---

#### Teste 1.3: Tentar avaliar mesmo pedido duas vezes
- Use o mesmo `orderId` do teste 1.1

**Resultado Esperado:**
- ❌ Status: `400 Bad Request`
- ❌ Mensagem: "Você já avaliou este pedido. Use a opção de atualizar avaliação."

---

#### Teste 1.4: Validação de rating (nota inválida)
**Request:**
```json
{
  "orderId": "ID_PEDIDO_ENTREGUE_2",
  "rating": 6,
  "comment": "Teste"
}
```

**Resultado Esperado:**
- ❌ Status: `400 Bad Request`
- ❌ Mensagem de validação: "A nota máxima é 5 estrelas"

---

#### Teste 1.5: Validação de rating (nota mínima)
**Request:**
```json
{
  "orderId": "ID_PEDIDO_ENTREGUE_2",
  "rating": 0,
  "comment": "Teste"
}
```

**Resultado Esperado:**
- ❌ Status: `400 Bad Request`
- ❌ Mensagem de validação: "A nota mínima é 1 estrela"

---

#### Teste 1.6: Criar avaliação sem comentário (opcional)
**Request:**
```json
{
  "orderId": "ID_PEDIDO_ENTREGUE_2",
  "rating": 4
}
```

**Resultado Esperado:**
- ✅ Status: `201 Created`
- ✅ Campo `comment` deve ser `null` ou ausente

---

#### Teste 1.7: Criar sem autenticação
- 🔓 Remova a autenticação
- Tente criar uma avaliação

**Resultado Esperado:**
- ❌ Status: `401 Unauthorized`

🔐 **Autentique-se novamente!**

---

### 2️⃣ GET /api/reviews/restaurant/:restaurantId - Listar Avaliações do Restaurante

#### Teste 2.1: Listar avaliações de um restaurante
- Use o `id` do restaurante criado

**Resultado Esperado:**
- ✅ Status: `200 OK`
- ✅ Retorna array de avaliações
- ✅ Cada avaliação contém: `id`, `rating`, `comment`, `user` (name), `createdAt`
- ✅ Ordenação: mais recentes primeiro

---

#### Teste 2.2: Listar avaliações de restaurante sem avaliações
- Use um restaurante que não tenha avaliações

**Resultado Esperado:**
- ✅ Status: `200 OK`
- ✅ Retorna array vazio `[]`

---

#### Teste 2.3: Listar avaliações de restaurante inexistente
- Use UUID inválido: `00000000-0000-0000-0000-000000000000`

**Resultado Esperado:**
- ❌ Status: `404 Not Found`
- ❌ Mensagem: "Restaurante não encontrado"

---

### 3️⃣ GET /api/reviews/:id - Buscar Avaliação Específica

#### Teste 3.1: Buscar avaliação existente
- Use o `id` da avaliação criada no teste 1.1

**Resultado Esperado:**
- ✅ Status: `200 OK`
- ✅ Retorna avaliação completa com `user`, `order`
- ✅ Todos os campos devem estar corretos

---

#### Teste 3.2: Buscar avaliação inexistente
- Use UUID inválido: `00000000-0000-0000-0000-000000000000`

**Resultado Esperado:**
- ❌ Status: `404 Not Found`
- ❌ Mensagem: "Avaliação não encontrada"

---

#### Teste 3.3: Buscar sem autenticação
- 🔓 Remova a autenticação

**Resultado Esperado:**
- ❌ Status: `401 Unauthorized`

🔐 **Autentique-se novamente!**

---

### 4️⃣ PATCH /api/reviews/:id - Atualizar Avaliação

#### Teste 4.1: Atualizar nota e comentário
- Use o `id` da avaliação criada

**Request:**
```json
{
  "rating": 4,
  "comment": "Atualizando minha avaliação: a comida estava boa, mas a entrega demorou um pouco."
}
```

**Resultado Esperado:**
- ✅ Status: `200 OK`
- ✅ Mensagem: "Avaliação atualizada com sucesso"
- ✅ Campos atualizados corretamente
- ✅ Rating do restaurante deve ser recalculado

---

#### Teste 4.2: Atualizar apenas o comentário
**Request:**
```json
{
  "comment": "Editando apenas o comentário"
}
```

**Resultado Esperado:**
- ✅ Status: `200 OK`
- ✅ Apenas comentário alterado
- ✅ Rating permanece o mesmo

---

#### Teste 4.3: Atualizar avaliação inexistente
- Use UUID inválido

**Resultado Esperado:**
- ❌ Status: `404 Not Found`

---

### 5️⃣ DELETE /api/reviews/:id - Remover Avaliação

#### Teste 5.1: Remover avaliação com sucesso
- Use o `id` da avaliação criada

**Resultado Esperado:**
- ✅ Status: `200 OK`
- ✅ Mensagem: "Avaliação removida com sucesso"
- ✅ Rating do restaurante deve ser recalculado
- ✅ Buscar a avaliação novamente deve retornar 404

---

#### Teste 5.2: Tentar remover avaliação já removida
- Use o mesmo `id` do teste anterior

**Resultado Esperado:**
- ❌ Status: `404 Not Found`

---

#### Teste 5.3: Remover avaliação inexistente
- Use UUID inválido

**Resultado Esperado:**
- ❌ Status: `404 Not Found`

---

## 🎯 Testes de Proteção de Ownership

### Teste 6.1: Criar segundo usuário
1. **Logout** do usuário atual
2. **Registrar novo usuário**:
   ```json
   {
     "name": "Outro Usuario Reviews",
     "email": "outro.reviews@test.com",
     "password": "Senha@123",
     "phone": "31987776655"
   }
   ```
3. **Fazer login** com o novo usuário
4. 🔐 **Atualizar token no Authorize**
5. Criar um pedido e marcar como DELIVERED
6. Criar uma avaliação com esse pedido

---

### Teste 6.2: Tentar acessar avaliação de outro usuário
- Use o `id` de uma avaliação do primeiro usuário
- Faça GET /api/reviews/:id

**Resultado Esperado:**
- ❌ Status: `403 Forbidden`
- ❌ Mensagem: "Você não tem permissão para acessar esta avaliação"

---

### Teste 6.3: Tentar atualizar avaliação de outro usuário
- Use o `id` de uma avaliação do primeiro usuário
- Tente fazer PATCH

**Resultado Esperado:**
- ❌ Status: `403 Forbidden`

---

### Teste 6.4: Tentar deletar avaliação de outro usuário
- Use o `id` de uma avaliação do primeiro usuário
- Tente fazer DELETE

**Resultado Esperado:**
- ❌ Status: `403 Forbidden`

---

## 🔄 Teste de Cálculo de Rating Médio

### Teste 7.1: Verificar atualização do rating do restaurante
1. Crie 3 avaliações para o mesmo restaurante:
   - Avaliação 1: 5 estrelas
   - Avaliação 2: 4 estrelas
   - Avaliação 3: 3 estrelas

2. Busque o restaurante: `GET /api/restaurants/{restaurantId}`

**Resultado Esperado:**
- ✅ Campo `rating` do restaurante deve ser: `4.0` (média de 5+4+3 = 12/3)

---

### Teste 7.2: Verificar recálculo após atualização
1. Atualize uma avaliação de 3 estrelas para 5 estrelas
2. Busque o restaurante novamente

**Resultado Esperado:**
- ✅ Campo `rating` deve ser recalculado: `4.7` (média de 5+4+5 = 14/3)

---

### Teste 7.3: Verificar recálculo após remoção
1. Delete uma avaliação
2. Busque o restaurante novamente

**Resultado Esperado:**
- ✅ Campo `rating` deve ser recalculado com base nas avaliações restantes

---

## 📊 Resumo dos Testes

| Endpoint | Testes | Status |
|----------|--------|--------|
| POST /reviews | 7 | ⬜ |
| GET /reviews/restaurant/:id | 3 | ⬜ |
| GET /reviews/:id | 3 | ⬜ |
| PATCH /reviews/:id | 3 | ⬜ |
| DELETE /reviews/:id | 3 | ⬜ |
| Ownership Protection | 4 | ⬜ |
| Rating Calculation | 3 | ⬜ |
| **TOTAL** | **26 testes** | **0/26** |

---

## ✅ Checklist Final

- [ ] Apenas pedidos DELIVERED podem ser avaliados
- [ ] Usuário só pode avaliar cada pedido uma vez
- [ ] Rating entre 1-5 estrelas validado
- [ ] Comentário é opcional
- [ ] Rating do restaurante é calculado automaticamente
- [ ] Rating é recalculado ao atualizar/deletar avaliação
- [ ] Proteção de ownership funciona (403 para avaliações de outros)
- [ ] Autenticação obrigatória funciona (401 sem token)
- [ ] Não é possível acessar/editar/deletar avaliações de outros usuários

---

## 🐛 Problemas Encontrados

_(Anote aqui qualquer bug ou comportamento inesperado)_

1. 
2. 
3. 

---

**Data do Teste:** ___/___/______  
**Testador:** _________________  
**Resultado:** ⬜ Aprovado | ⬜ Reprovado  

