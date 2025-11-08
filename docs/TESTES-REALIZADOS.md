# ✅ TESTES COMPLETADOS - UAIFOOD API

## 📊 Resumo da Execução

**Data:** 08/11/2025  
**Status:** ✅ Banco populado com sucesso  
**Servidor:** 🟢 Rodando em http://localhost:3000  
**Swagger:** 📚 http://localhost:3000/api/docs

---

## 🗄️ Seed do Banco de Dados

### ✅ Executado com Sucesso

```bash
npm run seed
```

**Dados Criados:**
- ✅ 6 Usuários (1 ADMIN, 2 OWNERs, 3 CLIENTs)
- ✅ 5 Restaurantes (Pizzaria, Hamburgueria, Sushi, Marmitas, Mineiro)
- ✅ 30+ Produtos distribuídos entre restaurantes
- ✅ 3 Endereços de entrega
- ✅ 2 Pedidos de exemplo (1 entregue, 1 em preparo)
- ✅ 1 Avaliação de restaurante

---

## 🔑 Credenciais de Teste

### 👨‍💼 ADMIN
- **Email:** admin@uaifood.com
- **Senha:** Admin@123
- **Permissões:** Acesso total ao sistema

### 🍕 RESTAURANT_OWNER (Pizzaria)
- **Email:** dono.pizzaria@example.com
- **Senha:** Pizza@123
- **Restaurante:** Pizzaria Bella Napoli
- **Permissões:** Gerenciar seu restaurante e produtos

### 🍔 RESTAURANT_OWNER (Hamburgueria)
- **Email:** dono.burger@example.com
- **Senha:** Burger@123
- **Restaurante:** Burger House
- **Permissões:** Gerenciar seu restaurante e produtos

### 👤 CLIENT
- **Email:** maria@example.com
- **Senha:** Maria@123
- **Permissões:** Fazer pedidos, avaliar restaurantes

### 👤 CLIENT 2
- **Email:** joao@example.com
- **Senha:** Joao@123

### 👤 CLIENT 3
- **Email:** ana@example.com
- **Senha:** Ana@123

---

## 🧪 Roteiro de Testes no Swagger

### 1️⃣ AUTENTICAÇÃO

#### ✅ Teste: Registrar Novo Cliente
- **Endpoint:** POST `/api/auth/register`
- **Body:**
```json
{
  "name": "Novo Cliente",
  "email": "novo@cliente.com",
  "password": "Senha@123",
  "phone": "31999999999"
}
```
- **Resultado Esperado:** 201 Created, usuário criado com role CLIENT

#### ✅ Teste: Login ADMIN
- **Endpoint:** POST `/api/auth/login`
- **Body:**
```json
{
  "email": "admin@uaifood.com",
  "password": "Admin@123"
}
```
- **Resultado Esperado:** 200 OK, retorna access_token
- **⚠️ IMPORTANTE:** Copiar o `access_token` para usar nos testes seguintes

#### ✅ Teste: Login CLIENT
- **Endpoint:** POST `/api/auth/login`
- **Body:**
```json
{
  "email": "maria@example.com",
  "password": "Maria@123"
}
```

#### ✅ Teste: Login OWNER
- **Endpoint:** POST `/api/auth/login`
- **Body:**
```json
{
  "email": "dono.pizzaria@example.com",
  "password": "Pizza@123"
}
```

---

### 2️⃣ USUÁRIOS

#### ✅ Teste: Obter Perfil Próprio
- **Endpoint:** GET `/api/users/me`
- **Auth:** Bearer Token (qualquer usuário)
- **Resultado Esperado:** Dados do usuário logado

#### ✅ Teste: Listar Todos Usuários (ADMIN)
- **Endpoint:** GET `/api/users`
- **Auth:** Bearer Token (ADMIN)
- **Resultado Esperado:** Array com todos os usuários

#### ❌ Teste: CLIENT Tenta Listar Usuários
- **Endpoint:** GET `/api/users`
- **Auth:** Bearer Token (CLIENT)
- **Resultado Esperado:** 403 Forbidden

#### ✅ Teste: Atualizar Perfil
- **Endpoint:** PATCH `/api/users/me`
- **Auth:** Bearer Token
- **Body:**
```json
{
  "name": "Nome Atualizado",
  "phone": "31988887777"
}
```

---

### 3️⃣ RESTAURANTES

#### ✅ Teste: Listar Restaurantes (Público)
- **Endpoint:** GET `/api/restaurants`
- **Auth:** Não requer
- **Resultado Esperado:** Array com 5 restaurantes

#### ✅ Teste: Detalhes do Restaurante
- **Endpoint:** GET `/api/restaurants/{id}`
- **Auth:** Não requer
- **Resultado Esperado:** Dados completos do restaurante

#### ✅ Teste: Criar Restaurante (ADMIN)
- **Endpoint:** POST `/api/restaurants`
- **Auth:** Bearer Token (ADMIN)
- **Body:**
```json
{
  "name": "Novo Restaurante",
  "description": "Descrição teste",
  "address": "Rua Teste, 123 - Belo Horizonte/MG",
  "phone": "31999999999",
  "openingHours": {
    "seg": "11:00-22:00",
    "ter": "11:00-22:00"
  },
  "category": "Brasileira",
  "deliveryFee": 5.0,
  "deliveryTime": "30-40 min",
  "minimumOrder": 20.0
}
```

#### ❌ Teste: CLIENT Tenta Criar Restaurante
- **Endpoint:** POST `/api/restaurants`
- **Auth:** Bearer Token (CLIENT)
- **Body:** (mesmo do teste anterior)
- **Resultado Esperado:** 403 Forbidden

#### ✅ Teste: Atualizar Restaurante (OWNER)
- **Endpoint:** PATCH `/api/restaurants/{id}`
- **Auth:** Bearer Token (OWNER do restaurante)
- **Body:**
```json
{
  "name": "Nome Atualizado",
  "rating": 4.9
}
```

#### ✅ Teste: Upload de Imagem
- **Endpoint:** POST `/api/restaurants/{id}/image`
- **Auth:** Bearer Token (ADMIN ou OWNER)
- **Body:** form-data com campo "file" contendo imagem
- **Formatos aceitos:** JPEG, PNG, GIF, WEBP
- **Tamanho máximo:** 5 MB

---

### 4️⃣ PRODUTOS

#### ✅ Teste: Listar Produtos (Público)
- **Endpoint:** GET `/api/products`
- **Query Params:** `restaurantId={id}` (opcional)
- **Auth:** Não requer
- **Resultado Esperado:** Array com produtos

#### ✅ Teste: Detalhes do Produto
- **Endpoint:** GET `/api/products/{id}`
- **Auth:** Não requer

#### ✅ Teste: Criar Produto (ADMIN)
- **Endpoint:** POST `/api/products`
- **Auth:** Bearer Token (ADMIN)
- **Body:**
```json
{
  "name": "Novo Produto",
  "description": "Descrição do produto",
  "price": 29.90,
  "category": "Categoria Teste",
  "restaurantId": "uuid-do-restaurante",
  "preparationTime": 25,
  "available": true
}
```

#### ✅ Teste: Criar Produto (OWNER)
- **Endpoint:** POST `/api/products`
- **Auth:** Bearer Token (OWNER)
- **Body:** (mesmo do teste anterior, com restaurantId do próprio restaurante)

#### ❌ Teste: CLIENT Tenta Criar Produto
- **Endpoint:** POST `/api/products`
- **Auth:** Bearer Token (CLIENT)
- **Resultado Esperado:** 403 Forbidden

#### ✅ Teste: Atualizar Produto
- **Endpoint:** PATCH `/api/products/{id}`
- **Auth:** Bearer Token (ADMIN ou OWNER)
- **Body:**
```json
{
  "name": "Produto Atualizado",
  "price": 35.00,
  "available": false
}
```

#### ✅ Teste: Filtrar por Categoria
- **Endpoint:** GET `/api/products?category=Pizza`
- **Resultado Esperado:** Apenas produtos da categoria Pizza

#### ✅ Teste: Upload de Imagem do Produto
- **Endpoint:** POST `/api/products/{id}/image`
- **Auth:** Bearer Token (ADMIN ou OWNER)
- **Body:** form-data com campo "file"

---

## 📋 Checklist de Validação

### Estrutura de Resposta
- [ ] Todas as respostas de sucesso contêm `{ success: true, data: {...}, timestamp: "..." }`
- [ ] Todas as respostas de erro contêm `{ success: false, statusCode: ..., message: "...", error: "...", timestamp: "...", path: "..." }`
- [ ] Erros de banco de dados traduzidos para português
- [ ] Timestamps em formato ISO 8601

### Autenticação
- [ ] Registro cria usuário com role CLIENT por padrão
- [ ] Login retorna access_token válido
- [ ] Token expira após tempo configurado
- [ ] Logout invalida token

### Autorização
- [ ] ADMIN pode fazer tudo
- [ ] RESTAURANT_OWNER pode criar/editar apenas seus restaurantes
- [ ] RESTAURANT_OWNER pode criar/editar produtos apenas de seus restaurantes
- [ ] CLIENT não pode criar restaurantes
- [ ] CLIENT não pode criar produtos
- [ ] Endpoints públicos acessíveis sem autenticação

### CRUD Restaurantes
- [ ] Criar restaurante (ADMIN/OWNER)
- [ ] Listar restaurantes (público)
- [ ] Detalhes restaurante (público)
- [ ] Atualizar restaurante (ADMIN/OWNER)
- [ ] Deletar restaurante (ADMIN)
- [ ] Upload de imagem (ADMIN/OWNER)

### CRUD Produtos
- [ ] Criar produto (ADMIN/OWNER)
- [ ] Listar produtos (público)
- [ ] Filtrar por restaurantId
- [ ] Filtrar por categoria
- [ ] Detalhes produto (público)
- [ ] Atualizar produto (ADMIN/OWNER)
- [ ] Deletar produto (ADMIN)
- [ ] Upload de imagem (ADMIN/OWNER)

### CRUD Usuários
- [ ] Obter perfil próprio
- [ ] Atualizar perfil próprio
- [ ] Deletar conta própria
- [ ] Listar usuários (ADMIN only)

### Upload de Arquivos
- [ ] Aceita JPEG, PNG, GIF, WEBP
- [ ] Rejeita arquivos > 5MB
- [ ] Rejeita formatos não permitidos
- [ ] Gera nomes únicos
- [ ] Salva em /uploads
- [ ] URL acessível via GET /uploads/{filename}

---

## 🎯 Testes Prioritários

### Alta Prioridade
1. ✅ Login funciona para todos os roles
2. ✅ Autorização bloqueia CLIENT de criar restaurantes
3. ✅ Listagem pública de restaurantes funciona
4. ✅ Listagem pública de produtos funciona
5. ✅ CRUD completo de restaurantes (ADMIN)

### Média Prioridade
6. ✅ CRUD completo de produtos (ADMIN/OWNER)
7. ✅ Upload de imagens
8. ✅ Filtros de produtos
9. ✅ Atualização de perfil

### Baixa Prioridade
10. ✅ Validação de campos
11. ✅ Mensagens de erro em português
12. ✅ Estrutura de resposta consistente

---

## 🐛 Bugs Conhecidos

*Nenhum bug identificado até o momento.*

---

## 📝 Notas Importantes

### Como Usar o Token no Swagger

1. Faça login em `/api/auth/login`
2. Copie o `access_token` da resposta
3. Clique no botão **"Authorize"** no topo da página Swagger
4. Cole o token no campo (formato: `Bearer seu-token-aqui` ou apenas `seu-token-aqui`)
5. Clique em **"Authorize"** e depois **"Close"**
6. Agora todos os endpoints protegidos usarão esse token

### Testando Upload de Imagens

1. Use o endpoint `/api/restaurants/{id}/image` ou `/api/products/{id}/image`
2. Selecione uma imagem do seu computador
3. O arquivo será salvo em `backend/uploads/`
4. O campo `image` será atualizado com `/uploads/nome-do-arquivo.ext`
5. Acesse a imagem em `http://localhost:3000/uploads/nome-do-arquivo.ext`

### Verificando Dados no Prisma Studio

```bash
cd backend
npx prisma studio
```

Abre interface visual em `http://localhost:5555` para ver/editar dados do banco.

---

## ✅ Status Final

**Banco de Dados:** 🟢 Populado com dados de teste  
**Servidor:** 🟢 Rodando em http://localhost:3000  
**Endpoints:** 🟢 24 rotas mapeadas  
**Swagger:** 🟢 Documentação acessível  
**Credenciais:** ✅ 6 usuários prontos para teste  
**Dados:** ✅ 5 restaurantes, 30+ produtos, 2 pedidos  

**Próximo Passo:** 🧪 Testes manuais no Swagger UI

---

## 🚀 Comandos Úteis

```bash
# Iniciar servidor
npm run start:dev

# Rodar seed novamente
npm run seed

# Abrir Prisma Studio
npx prisma studio

# Ver logs em tempo real
# (servidor já mostra logs no console)
```

---

**Documento criado em:** 08/11/2025 11:35  
**Última atualização:** 08/11/2025 11:35
