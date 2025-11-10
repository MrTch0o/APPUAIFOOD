# 📋 Roteiro de Testes - Módulo de Endereços

## 📍 Informações do Módulo
- **Módulo:** Addresses (Endereços)
- **Total de Endpoints:** 6
- **Tag no Swagger:** `Endereços`
- **Base URL:** `/api/addresses`

---

## ✅ Pré-requisitos

### 1. Usuário para Testes
Antes de testar os endereços, você precisa estar autenticado:

1. **Registrar usuário** (se não tiver):
   - `POST /api/auth/register`
   - Body:
     ```json
     {
       "name": "Teste Endereços",
       "email": "teste.enderecos@test.com",
       "password": "Senha@123",
       "phone": "31999887766"
     }
     ```

2. **Fazer login**:
   - `POST /api/auth/login`
   - Body:
     ```json
     {
       "email": "teste.enderecos@test.com",
       "password": "Senha@123"
     }
     ```
   - ✅ **Copie o `accessToken` retornado**
   - 🔐 **Clique em "Authorize" no topo do Swagger e cole o token**

---

## 🧪 Testes dos Endpoints

### 1️⃣ POST /api/addresses - Criar Endereço

#### Teste 1.1: Criar primeiro endereço (padrão)
**Request:**
```json
{
  "label": "Casa",
  "street": "Rua das Flores",
  "number": "123",
  "complement": "Apto 101",
  "neighborhood": "Centro",
  "city": "Belo Horizonte",
  "state": "MG",
  "zipCode": "30110-000",
  "isDefault": true
}
```

**Resultado Esperado:**
- ✅ Status: `201 Created`
- ✅ Resposta contém: `message: "Endereço criado com sucesso"`
- ✅ Resposta contém: objeto `address` com `id`, todos os campos preenchidos
- ✅ Campo `isDefault` deve ser `true`
- 📝 **Anote o `id` do endereço criado**

---

#### Teste 1.2: Criar segundo endereço (não padrão)
**Request:**
```json
{
  "label": "Trabalho",
  "street": "Av. Afonso Pena",
  "number": "1000",
  "neighborhood": "Funcionários",
  "city": "Belo Horizonte",
  "state": "MG",
  "zipCode": "30130-001",
  "isDefault": false
}
```

**Resultado Esperado:**
- ✅ Status: `201 Created`
- ✅ Campo `isDefault` deve ser `false`
- ✅ Endereço anterior ("Casa") ainda deve estar como padrão

---

#### Teste 1.3: Criar terceiro endereço (marcar como padrão)
**Request:**
```json
{
  "label": "Casa dos Pais",
  "street": "Rua Amazonas",
  "number": "456",
  "neighborhood": "Savassi",
  "city": "Belo Horizonte",
  "state": "MG",
  "zipCode": "30150-100",
  "isDefault": true
}
```

**Resultado Esperado:**
- ✅ Status: `201 Created`
- ✅ Este endereço deve ser marcado como padrão
- ✅ Os outros 2 endereços NÃO devem mais estar como padrão (automático)

---

#### Teste 1.4: Validação de CEP inválido
**Request:**
```json
{
  "label": "Teste CEP",
  "street": "Rua Teste",
  "number": "1",
  "neighborhood": "Centro",
  "city": "BH",
  "state": "MG",
  "zipCode": "123"
}
```

**Resultado Esperado:**
- ❌ Status: `400 Bad Request`
- ❌ Mensagem de erro sobre formato de CEP inválido

---

#### Teste 1.5: Validação de UF inválida
**Request:**
```json
{
  "label": "Teste UF",
  "street": "Rua Teste",
  "number": "1",
  "neighborhood": "Centro",
  "city": "BH",
  "state": "ABC",
  "zipCode": "30000-000"
}
```

**Resultado Esperado:**
- ❌ Status: `400 Bad Request`
- ❌ Mensagem de erro sobre UF inválida

---

#### Teste 1.6: Criar sem autenticação
- 🔓 **Remova a autenticação** (clique no cadeado e "Logout")
- Tente criar um endereço qualquer

**Resultado Esperado:**
- ❌ Status: `401 Unauthorized`

🔐 **Autentique-se novamente antes de continuar!**

---

### 2️⃣ GET /api/addresses - Listar Endereços

#### Teste 2.1: Listar todos os endereços
**Request:** Sem body, apenas GET

**Resultado Esperado:**
- ✅ Status: `200 OK`
- ✅ Retorna array com **3 endereços**
- ✅ Primeiro endereço deve ser o padrão ("Casa dos Pais")
- ✅ Ordenação: padrão primeiro, depois por data de criação (mais recente primeiro)

---

#### Teste 2.2: Listar sem autenticação
- 🔓 Remova a autenticação
- Tente listar

**Resultado Esperado:**
- ❌ Status: `401 Unauthorized`

🔐 **Autentique-se novamente!**

---

### 3️⃣ GET /api/addresses/:id - Buscar Endereço Específico

#### Teste 3.1: Buscar endereço existente
- Use o `id` do primeiro endereço criado ("Casa")

**Resultado Esperado:**
- ✅ Status: `200 OK`
- ✅ Retorna o endereço completo com todos os campos
- ✅ `label` deve ser "Casa"

---

#### Teste 3.2: Buscar endereço inexistente
- Use um UUID inválido: `00000000-0000-0000-0000-000000000000`

**Resultado Esperado:**
- ❌ Status: `404 Not Found`
- ❌ Mensagem: "Endereço não encontrado"

---

#### Teste 3.3: Buscar sem autenticação
- 🔓 Remova a autenticação
- Tente buscar qualquer endereço

**Resultado Esperado:**
- ❌ Status: `401 Unauthorized`

🔐 **Autentique-se novamente!**

---

### 4️⃣ PATCH /api/addresses/:id - Atualizar Endereço

#### Teste 4.1: Atualizar campos do endereço
- Use o `id` do endereço "Trabalho"

**Request:**
```json
{
  "label": "Trabalho - Matriz",
  "complement": "Sala 302",
  "number": "1500"
}
```

**Resultado Esperado:**
- ✅ Status: `200 OK`
- ✅ Mensagem: "Endereço atualizado com sucesso"
- ✅ Campos atualizados corretamente
- ✅ Outros campos (street, city, etc.) não devem mudar

---

#### Teste 4.2: Atualizar e marcar como padrão
- Use o `id` do endereço "Trabalho - Matriz"

**Request:**
```json
{
  "isDefault": true
}
```

**Resultado Esperado:**
- ✅ Status: `200 OK`
- ✅ Este endereço agora é o padrão
- ✅ "Casa dos Pais" não deve mais ser o padrão (verificar com GET /api/addresses)

---

#### Teste 4.3: Atualizar endereço inexistente
- Use UUID inválido: `00000000-0000-0000-0000-000000000000`

**Resultado Esperado:**
- ❌ Status: `404 Not Found`

---

### 5️⃣ PATCH /api/addresses/:id/default - Marcar como Padrão

#### Teste 5.1: Marcar "Casa" como padrão
- Use o `id` do endereço "Casa"

**Request:** Sem body

**Resultado Esperado:**
- ✅ Status: `200 OK`
- ✅ Mensagem: "Endereço marcado como padrão"
- ✅ `isDefault` deve ser `true` na resposta
- ✅ Verificar com GET /api/addresses que apenas "Casa" está como padrão

---

#### Teste 5.2: Verificar exclusividade do padrão
- Liste todos os endereços (GET /api/addresses)

**Resultado Esperado:**
- ✅ Apenas 1 endereço deve ter `isDefault: true`
- ✅ Os outros 2 devem ter `isDefault: false`

---

### 6️⃣ DELETE /api/addresses/:id - Remover Endereço

#### Teste 6.1: Remover endereço "Trabalho"
- Use o `id` do endereço "Trabalho - Matriz"

**Resultado Esperado:**
- ✅ Status: `200 OK`
- ✅ Mensagem: "Endereço removido com sucesso"
- ✅ Listar endereços (GET) deve retornar apenas 2 endereços

---

#### Teste 6.2: Tentar remover endereço já removido
- Use o mesmo `id` do teste anterior

**Resultado Esperado:**
- ❌ Status: `404 Not Found`

---

#### Teste 6.3: Remover endereço inexistente
- Use UUID inválido: `00000000-0000-0000-0000-000000000000`

**Resultado Esperado:**
- ❌ Status: `404 Not Found`

---

## 🎯 Testes de Proteção de Ownership

### Teste 7.1: Criar segundo usuário
1. **Logout** do usuário atual
2. **Registrar novo usuário**:
   ```json
   {
     "name": "Outro Usuario",
     "email": "outro@test.com",
     "password": "Senha@123",
     "phone": "31988887777"
   }
   ```
3. **Fazer login** com o novo usuário
4. 🔐 **Atualizar token no Authorize**

---

### Teste 7.2: Tentar acessar endereço de outro usuário
- Use o `id` de um endereço do primeiro usuário

**Resultado Esperado:**
- ❌ Status: `403 Forbidden`
- ❌ Mensagem: "Você não tem permissão para acessar este endereço"

---

### Teste 7.3: Tentar atualizar endereço de outro usuário
- Use o `id` de um endereço do primeiro usuário
- Tente fazer PATCH

**Resultado Esperado:**
- ❌ Status: `403 Forbidden`

---

### Teste 7.4: Tentar deletar endereço de outro usuário
- Use o `id` de um endereço do primeiro usuário
- Tente fazer DELETE

**Resultado Esperado:**
- ❌ Status: `403 Forbidden`

---

## 📊 Resumo dos Testes

| Endpoint | Testes | Status |
|----------|--------|--------|
| POST /addresses | 6 | ⬜ |
| GET /addresses | 2 | ⬜ |
| GET /addresses/:id | 3 | ⬜ |
| PATCH /addresses/:id | 3 | ⬜ |
| PATCH /addresses/:id/default | 2 | ⬜ |
| DELETE /addresses/:id | 3 | ⬜ |
| Ownership Protection | 4 | ⬜ |
| **TOTAL** | **23 testes** | **0/23** |

---

## ✅ Checklist Final

- [ ] Todos os endpoints respondem corretamente
- [ ] Validações de CEP e UF funcionam
- [ ] Sistema de endereço padrão funciona (apenas 1 por vez)
- [ ] Proteção de ownership funciona (403 para endereços de outros)
- [ ] Autenticação obrigatória funciona (401 sem token)
- [ ] Não é possível acessar/editar/deletar endereços de outros usuários

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

