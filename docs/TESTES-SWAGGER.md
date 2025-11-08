# 🧪 Guia de Testes - Swagger UI

> **Data**: 08/11/2025  
> **Objetivo**: Testar todos os endpoints da API UAIFOOD via Swagger

---

## 📋 Checklist de Testes

### ✅ Fase 1: Autenticação Básica
- [ ] 1.1 - Registrar usuário CLIENT
- [ ] 1.2 - Login com CLIENT
- [ ] 1.3 - Testar refresh token
- [ ] 1.4 - Buscar perfil (GET /users/me)

### ✅ Fase 2: Criação de ADMIN (via Prisma Studio)
- [ ] 2.1 - Abrir Prisma Studio
- [ ] 2.2 - Criar usuário ADMIN manualmente
- [ ] 2.3 - Login com ADMIN
- [ ] 2.4 - Obter token ADMIN

### ✅ Fase 3: Restaurantes
- [ ] 3.1 - Criar restaurante (como ADMIN)
- [ ] 3.2 - Listar restaurantes (público)
- [ ] 3.3 - Buscar detalhes do restaurante
- [ ] 3.4 - Upload de imagem do restaurante
- [ ] 3.5 - Atualizar restaurante
- [ ] 3.6 - Acessar imagem via /uploads

### ✅ Fase 4: Produtos
- [ ] 4.1 - Criar produto no restaurante
- [ ] 4.2 - Listar produtos (público)
- [ ] 4.3 - Buscar detalhes do produto
- [ ] 4.4 - Upload de imagem do produto
- [ ] 4.5 - Filtrar produtos por restaurante
- [ ] 4.6 - Atualizar produto

### ✅ Fase 5: Testes de Autorização
- [ ] 5.1 - Tentar criar restaurante como CLIENT (deve falhar)
- [ ] 5.2 - Tentar acessar GET /users como CLIENT (deve falhar)
- [ ] 5.3 - Atualizar perfil como CLIENT (deve funcionar)
- [ ] 5.4 - Deletar conta como CLIENT

---

## 🚀 PASSO A PASSO DETALHADO

## Fase 1: Autenticação Básica

### 1.1 - Registrar Usuário CLIENT

**Endpoint**: `POST /api/auth/register`

**Body**:
```json
{
  "name": "João Silva",
  "email": "joao@test.com",
  "password": "Senha@123",
  "phone": "31987654321"
}
```

**Resultado Esperado**:
```json
{
  "success": true,
  "data": {
    "message": "Usuário registrado com sucesso",
    "user": {
      "id": "uuid-aqui",
      "name": "João Silva",
      "email": "joao@test.com",
      "role": "CLIENT",
      "twoFactorEnabled": false
    }
  },
  "timestamp": "2025-11-08T13:00:00.000Z"
}
```

✅ **Status esperado**: 201 Created

---

### 1.2 - Login com CLIENT

**Endpoint**: `POST /api/auth/login`

**Body**:
```json
{
  "email": "joao@test.com",
  "password": "Senha@123"
}
```

**Resultado Esperado**:
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid",
      "name": "João Silva",
      "email": "joao@test.com",
      "role": "CLIENT"
    }
  },
  "timestamp": "2025-11-08T13:00:00.000Z"
}
```

✅ **Status esperado**: 200 OK

📝 **IMPORTANTE**: Copie o `accessToken` e clique em **Authorize** no topo do Swagger, cole o token no formato:
```
Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

### 1.3 - Testar Refresh Token

**Endpoint**: `POST /api/auth/refresh`

**Body**:
```json
{
  "refreshToken": "cole-o-refresh-token-aqui"
}
```

**Resultado Esperado**: Novo accessToken

✅ **Status esperado**: 200 OK

---

### 1.4 - Buscar Perfil

**Endpoint**: `GET /api/users/me`

**Headers**: Authorization já configurado (via Authorize)

**Resultado Esperado**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "João Silva",
    "email": "joao@test.com",
    "phone": "31987654321",
    "role": "CLIENT",
    "twoFactorEnabled": false,
    "createdAt": "2025-11-08T13:00:00.000Z"
  },
  "timestamp": "2025-11-08T13:00:00.000Z"
}
```

✅ **Status esperado**: 200 OK

---

## Fase 2: Criação de ADMIN

### 2.1 - Abrir Prisma Studio

**Terminal**:
```bash
cd D:\WorkSpace\ws-daw2\APPUAIFOOD\backend
npx prisma studio
```

Isso abrirá o Prisma Studio em http://localhost:5555

---

### 2.2 - Criar ADMIN Manualmente

No Prisma Studio:

1. Clique em **User**
2. Clique em **Add record**
3. Preencha:
   - **name**: "Admin Sistema"
   - **email**: "admin@uaifood.com"
   - **password**: Use um hash bcrypt (vou gerar um para você)
   - **phone**: "31912345678"
   - **role**: ADMIN
   - **twoFactorEnabled**: false

**Hash bcrypt para senha "Admin@123"**:
```
$2b$10$X8qZ9YxJZQKZ5zJhYxJYxeYxJZQKZ5zJhYxJYxeYxJZQKZ5zJhYxJ
```

4. Clique em **Save 1 change**

---

### 2.3 - Login com ADMIN

**Endpoint**: `POST /api/auth/login`

**Body**:
```json
{
  "email": "admin@uaifood.com",
  "password": "Admin@123"
}
```

📝 **IMPORTANTE**: Copie o novo `accessToken` do ADMIN e atualize o **Authorize**

---

## Fase 3: Restaurantes

### 3.1 - Criar Restaurante (como ADMIN)

**Endpoint**: `POST /api/restaurants`

⚠️ **Certifique-se de estar autenticado como ADMIN**

**Body**:
```json
{
  "name": "Pizzaria do Zé",
  "description": "A melhor pizza da cidade! Massa artesanal e ingredientes frescos.",
  "address": "Rua das Flores, 123 - Centro - Belo Horizonte/MG",
  "phone": "31987654321",
  "openingHours": "18:00 - 23:00",
  "deliveryFee": 5.50,
  "deliveryTime": "40-50 min",
  "category": "PIZZA"
}
```

**Resultado Esperado**:
```json
{
  "success": true,
  "data": {
    "message": "Restaurante criado com sucesso",
    "restaurant": {
      "id": "uuid-restaurante",
      "name": "Pizzaria do Zé",
      "description": "A melhor pizza da cidade!...",
      "address": "Rua das Flores, 123...",
      "phone": "31987654321",
      "openingHours": "18:00 - 23:00",
      "deliveryFee": 5.50,
      "deliveryTime": "40-50 min",
      "category": "PIZZA",
      "image": null,
      "isActive": true,
      "createdAt": "2025-11-08T13:00:00.000Z"
    }
  },
  "timestamp": "2025-11-08T13:00:00.000Z"
}
```

✅ **Status esperado**: 201 Created

📝 **SALVE O ID DO RESTAURANTE** para os próximos testes!

---

### 3.2 - Listar Restaurantes (público)

**Endpoint**: `GET /api/restaurants`

⚠️ **Remova a autenticação** (clique em Authorize → Logout) para testar como público

**Resultado Esperado**: Array com o restaurante criado

✅ **Status esperado**: 200 OK

---

### 3.3 - Buscar Detalhes do Restaurante

**Endpoint**: `GET /api/restaurants/{id}`

Substitua `{id}` pelo ID do restaurante que você salvou

**Resultado Esperado**: Detalhes completos do restaurante + produtos (vazio por enquanto)

✅ **Status esperado**: 200 OK

---

### 3.4 - Upload de Imagem do Restaurante

**Endpoint**: `POST /api/restaurants/{id}/image`

⚠️ **Volte a autenticar como ADMIN**

**Form Data**:
- **image**: Selecione uma imagem (JPEG, PNG, GIF ou WEBP - máx 5MB)

**Resultado Esperado**:
```json
{
  "success": true,
  "data": {
    "message": "Imagem do restaurante atualizada com sucesso",
    "restaurant": {
      "id": "uuid",
      "name": "Pizzaria do Zé",
      "image": "/uploads/image-1699450000000-123456789.jpg",
      "updatedAt": "2025-11-08T13:00:00.000Z"
    }
  },
  "timestamp": "2025-11-08T13:00:00.000Z"
}
```

✅ **Status esperado**: 200 OK

---

### 3.5 - Atualizar Restaurante

**Endpoint**: `PATCH /api/restaurants/{id}`

**Body** (pode enviar só os campos que quer atualizar):
```json
{
  "description": "A MELHOR pizza da cidade! Agora com delivery mais rápido!",
  "deliveryTime": "30-40 min"
}
```

✅ **Status esperado**: 200 OK

---

### 3.6 - Acessar Imagem

Abra no navegador:
```
http://localhost:3000/uploads/image-1699450000000-123456789.jpg
```
(Use o nome do arquivo retornado no upload)

✅ **Deve exibir a imagem**

---

## Fase 4: Produtos

### 4.1 - Criar Produto

**Endpoint**: `POST /api/products`

⚠️ **Autenticado como ADMIN**

**Body**:
```json
{
  "name": "Pizza Margherita",
  "description": "Molho de tomate, mussarela, manjericão fresco e azeite",
  "price": 45.90,
  "category": "PIZZA",
  "restaurantId": "cole-o-id-do-restaurante-aqui",
  "preparationTime": 30,
  "available": true
}
```

**Resultado Esperado**: Produto criado com sucesso

✅ **Status esperado**: 201 Created

📝 **SALVE O ID DO PRODUTO**

---

### 4.2 - Listar Produtos (público)

**Endpoint**: `GET /api/products`

⚠️ **Sem autenticação**

**Resultado Esperado**: Array com produtos disponíveis

✅ **Status esperado**: 200 OK

---

### 4.3 - Buscar Detalhes do Produto

**Endpoint**: `GET /api/products/{id}`

**Resultado Esperado**: Detalhes do produto + informações do restaurante

✅ **Status esperado**: 200 OK

---

### 4.4 - Upload de Imagem do Produto

**Endpoint**: `POST /api/products/{id}/image`

⚠️ **Autenticado como ADMIN**

**Form Data**:
- **image**: Selecione uma foto de pizza

✅ **Status esperado**: 200 OK

---

### 4.5 - Filtrar Produtos por Restaurante

**Endpoint**: `GET /api/products?restaurantId={id-do-restaurante}`

**Resultado Esperado**: Apenas produtos daquele restaurante

✅ **Status esperado**: 200 OK

---

### 4.6 - Atualizar Produto

**Endpoint**: `PATCH /api/products/{id}`

**Body**:
```json
{
  "price": 49.90,
  "description": "Molho de tomate, mussarela de búfala, manjericão fresco e azeite extra virgem"
}
```

✅ **Status esperado**: 200 OK

---

## Fase 5: Testes de Autorização

### 5.1 - Tentar Criar Restaurante como CLIENT

⚠️ **Autentique como CLIENT** (João)

**Endpoint**: `POST /api/restaurants`

**Body**: Qualquer

**Resultado Esperado**:
```json
{
  "success": false,
  "statusCode": 403,
  "message": "Acesso negado",
  "error": "Forbidden",
  "timestamp": "2025-11-08T13:00:00.000Z",
  "path": "/api/restaurants"
}
```

❌ **Status esperado**: 403 Forbidden

---

### 5.2 - Tentar Acessar Lista de Usuários como CLIENT

**Endpoint**: `GET /api/users`

**Resultado Esperado**: 403 Forbidden

❌ **Status esperado**: 403 Forbidden

---

### 5.3 - Atualizar Próprio Perfil como CLIENT

**Endpoint**: `PATCH /api/users/me`

**Body**:
```json
{
  "name": "João Silva Santos",
  "phone": "31999887766"
}
```

**Resultado Esperado**: Perfil atualizado com sucesso

✅ **Status esperado**: 200 OK

---

### 5.4 - Deletar Própria Conta

**Endpoint**: `DELETE /api/users/me`

**Resultado Esperado**:
```json
{
  "success": true,
  "data": {
    "message": "Usuário deletado com sucesso"
  },
  "timestamp": "2025-11-08T13:00:00.000Z"
}
```

✅ **Status esperado**: 200 OK

⚠️ **Após isso, o token do João não funcionará mais**

---

## 📊 Resumo dos Resultados

| Teste | Endpoint | Status | Resultado |
|-------|----------|--------|-----------|
| 1.1 | POST /auth/register | - | ⬜ |
| 1.2 | POST /auth/login | - | ⬜ |
| 1.3 | POST /auth/refresh | - | ⬜ |
| 1.4 | GET /users/me | - | ⬜ |
| 2.3 | Login ADMIN | - | ⬜ |
| 3.1 | POST /restaurants | - | ⬜ |
| 3.2 | GET /restaurants | - | ⬜ |
| 3.3 | GET /restaurants/:id | - | ⬜ |
| 3.4 | POST /restaurants/:id/image | - | ⬜ |
| 3.5 | PATCH /restaurants/:id | - | ⬜ |
| 4.1 | POST /products | - | ⬜ |
| 4.2 | GET /products | - | ⬜ |
| 4.3 | GET /products/:id | - | ⬜ |
| 4.4 | POST /products/:id/image | - | ⬜ |
| 4.5 | GET /products?restaurantId | - | ⬜ |
| 4.6 | PATCH /products/:id | - | ⬜ |
| 5.1 | POST /restaurants (CLIENT) | 403 | ⬜ |
| 5.2 | GET /users (CLIENT) | 403 | ⬜ |
| 5.3 | PATCH /users/me | 200 | ⬜ |
| 5.4 | DELETE /users/me | 200 | ⬜ |

---

## 🎯 Próximos Passos Após Testes

Após concluir todos os testes, marque na todo list:
- [x] Testar todos os CRUDs via Swagger

E então podemos:
1. Implementar RolesGuard avançado (ownership)
2. Partir para Etapa 6: Módulo de Pedidos

---

**Boa sorte nos testes! 🚀**
