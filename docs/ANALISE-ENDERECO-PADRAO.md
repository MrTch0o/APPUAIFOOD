# Análise de Endereço Padrão - Backend

## Regra de Negócio Implementada

### 📋 Princípio
Um usuário pode ter **apenas UM endereço marcado como padrão**. Quando um novo endereço é marcado como padrão, todos os outros são automaticamente desmarcados.

---

## Implementação no Backend

### 1. **Criação de Endereço com isDefault**
**Arquivo:** `backend/src/modules/addresses/addresses.service.ts` → `create()`

```typescript
async create(userId: string, createAddressDto: CreateAddressDto) {
  const { isDefault, ...addressData } = createAddressDto;

  // Se for marcar como padrão, desmarcar os outros
  if (isDefault) {
    await this.prisma.address.updateMany({
      where: { userId },
      data: { isDefault: false },
    });
  }

  const address = await this.prisma.address.create({
    data: {
      ...addressData,
      isDefault: isDefault ?? false,
      userId,
    },
  });

  return {
    message: 'Endereço criado com sucesso',
    address,
  };
}
```

**Fluxo:**
1. Extrai `isDefault` do DTO
2. Se `isDefault = true`:
   - ✅ Desativa todos os endereços anteriores do usuário (`updateMany`)
3. Cria o novo endereço com o valor de `isDefault`
4. Retorna resposta estruturada: `{ message, address }`

---

### 2. **Atualização de Endereço**
**Arquivo:** `backend/src/modules/addresses/addresses.service.ts` → `update()`

```typescript
async update(id: string, userId: string, updateAddressDto: UpdateAddressDto) {
  // Verificar ownership...
  const { isDefault, ...addressData } = updateAddressDto;

  // Se marcar como padrão, desmarcar os outros
  if (isDefault === true) {
    await this.prisma.address.updateMany({
      where: { userId, id: { not: id } },
      data: { isDefault: false },
    });
  }

  const address = await this.prisma.address.update({
    where: { id },
    data: {
      ...addressData,
      ...(isDefault !== undefined && { isDefault }),
    },
  });

  return {
    message: 'Endereço atualizado com sucesso',
    address,
  };
}
```

**Fluxo:**
1. Verifica se o endereço pertence ao usuário (ownership check)
2. Se `isDefault = true`:
   - ✅ Desativa todos os outros endereços **EXCETO** o endereço sendo atualizado (`id: { not: id }`)
3. Atualiza o endereço com novos dados
4. Retorna resposta estruturada

---

### 3. **Endpoint Dedicado: Marcar como Padrão**
**Arquivo:** `backend/src/modules/addresses/addresses.controller.ts`

**Rota:** `PATCH /addresses/:id/default`

```typescript
async setDefault(id: string, userId: string) {
  // Verificar se o endereço existe e pertence ao usuário
  await this.findOne(id, userId);

  // Desmarcar todos como padrão
  await this.prisma.address.updateMany({
    where: { userId },
    data: { isDefault: false },
  });

  // Marcar o endereço como padrão
  const address = await this.prisma.address.update({
    where: { id },
    data: { isDefault: true },
  });

  return {
    message: 'Endereço marcado como padrão',
    address,
  };
}
```

**Fluxo:**
1. Desativa todos os endereços do usuário
2. Ativa apenas o endereço especificado
3. Resposta estruturada

---

### 4. **Listagem com Ordenação**
**Arquivo:** `backend/src/modules/addresses/addresses.service.ts` → `findAll()`

```typescript
async findAll(userId: string) {
  return this.prisma.address.findMany({
    where: { userId },
    orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
  });
}
```

**Resultado:**
- Endereço padrão aparece **primeiro** na lista
- Depois ordenados por data de criação (mais recentes primeiro)

---

### 5. **Proteção ao Deletar**
**Arquivo:** `backend/src/modules/addresses/addresses.service.ts` → `remove()`

```typescript
async remove(id: string, userId: string) {
  // Verificar ownership...

  // Verificar se há pedidos em andamento usando este endereço
  const activeOrders = await this.prisma.order.count({
    where: {
      addressId: id,
      status: {
        in: ['PENDING', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY'],
      },
    },
  });

  if (activeOrders > 0) {
    throw new BadRequestException(
      'Não é possível remover este endereço pois há pedidos ativos usando-o',
    );
  }

  await this.prisma.address.delete({ where: { id } });

  return { message: 'Endereço removido com sucesso' };
}
```

**Proteção:**
- ❌ Não permite deletar endereço com pedidos ativos
- Estados considerados "ativos": `PENDING`, `CONFIRMED`, `PREPARING`, `OUT_FOR_DELIVERY`

---

## Endpoints de Endereço

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/addresses` | Criar novo endereço |
| GET | `/addresses` | Listar todos (com padrão primeiro) |
| GET | `/addresses/:id` | Buscar endereço específico |
| PATCH | `/addresses/:id` | Atualizar endereço |
| **PATCH** | **`/addresses/:id/default`** | **Marcar como padrão** |
| DELETE | `/addresses/:id` | Remover endereço |

---

## Segurança

✅ **Ownership Check:** Todas as operações verificam se o endereço pertence ao usuário autenticado
✅ **Integridade de Dados:** Apenas um endereço padrão por usuário
✅ **Proteção de Integridade Referencial:** Não permite deletar se há pedidos ativos
✅ **Autenticação:** JWT obrigatório em todos os endpoints

---

## Fluxo Frontend Esperado

### Ao criar endereço com `isDefault: true`:
1. Frontend envia `POST /addresses` com `isDefault: true`
2. Backend desativa todos os outros endereços
3. Novo endereço criado como padrão
4. Frontend recebe `{ message, address }`
5. Endereço é selecionado automaticamente no checkout

### Ao marcar existente como padrão:
1. Frontend envia `PATCH /addresses/:id` com `isDefault: true`
2. OU envia `PATCH /addresses/:id/default` (endpoint dedicado)
3. Backend desativa todos os outros
4. Endereço atualizado como padrão
5. Frontend atualiza lista de endereços

---

## Status Atual

✅ **Backend:** Implementado e funcionando corretamente
✅ **Regra de Negócio:** Um endereço padrão por usuário
✅ **Proteções:** Ownership, integridade referencial
⚠️ **Frontend:** Corrigido para processar resposta corretamente

