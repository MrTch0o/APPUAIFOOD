# 🗃️ Modelagem do Banco de Dados - UAIFOOD

## Visão Geral

O banco de dados do UAIFOOD foi projetado seguindo os princípios de normalização e boas práticas de modelagem relacional. Utilizamos PostgreSQL como SGBD e Prisma como ORM.

## Diagrama ER (Entidade-Relacionamento)

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│    User     │         │  Restaurant  │         │   Product   │
├─────────────┤         ├──────────────┤         ├─────────────┤
│ id          │────┐    │ id           │────┐    │ id          │
│ email       │    │    │ name         │    │    │ name        │
│ password    │    │    │ description  │    │    │ description │
│ name        │    │    │ image        │    │    │ price       │
│ phone       │    │    │ category     │    │    │ image       │
│ role        │    │    │ rating       │    │    │ category    │
│ is2FAEnabled│    │    │ ownerId      │────┘    │ restaurantId│
│ twoFASecret │    │    │ createdAt    │         │ available   │
│ createdAt   │    │    │ updatedAt    │         │ createdAt   │
│ updatedAt   │    │    └──────────────┘         │ updatedAt   │
└─────────────┘    │                             └─────────────┘
       │           │                                    │
       │           │                                    │
       ├───────────┼────────────────────────────────────┤
       │           │                                    │
       ▼           ▼                                    ▼
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   Address   │         │    Order     │         │  OrderItem  │
├─────────────┤         ├──────────────┤         ├─────────────┤
│ id          │         │ id           │         │ id          │
│ userId      │────┐    │ userId       │────┐    │ orderId     │
│ street      │    │    │ restaurantId │    │    │ productId   │
│ number      │    │    │ status       │    │    │ quantity    │
│ complement  │    │    │ total        │    │    │ price       │
│ neighborhood│    │    │ deliveryFee  │    │    │ subtotal    │
│ city        │    │    │ addressId    │    │    │ createdAt   │
│ state       │    │    │ paymentMethod│    │    └─────────────┘
│ zipCode     │    │    │ createdAt    │    │
│ isDefault   │    │    │ updatedAt    │    │
│ createdAt   │    │    └──────────────┘    │
└─────────────┘    │                        │
                   │                        │
                   │                        │
                   │    ┌──────────────┐    │
                   └───▶│    Review    │◀───┘
                        ├──────────────┤
                        │ id           │
                        │ userId       │
                        │ restaurantId │
                        │ orderId      │
                        │ rating       │
                        │ comment      │
                        │ createdAt    │
                        └──────────────┘
```

## Entidades

### 1. User (Usuário)

Armazena informações dos usuários do sistema (clientes e donos de restaurantes).

**Campos:**
- `id` (UUID): Identificador único
- `email` (String): E-mail único do usuário
- `password` (String): Senha criptografada (bcrypt)
- `name` (String): Nome completo
- `phone` (String?): Telefone (opcional)
- `role` (Enum): Papel do usuário (CLIENT, RESTAURANT_OWNER, ADMIN)
- `is2FAEnabled` (Boolean): Se 2FA está ativado
- `twoFASecret` (String?): Secret para geração de códigos 2FA
- `refreshToken` (String?): Token de refresh JWT
- `createdAt` (DateTime): Data de criação
- `updatedAt` (DateTime): Data de atualização

**Relacionamentos:**
- `addresses`: 1:N com Address
- `orders`: 1:N com Order
- `ownedRestaurants`: 1:N com Restaurant
- `reviews`: 1:N com Review

**Regras de Negócio:**
- Email deve ser único
- Senha deve ter no mínimo 8 caracteres
- Role define as permissões do usuário
- 2FA é opcional mas recomendado

---

### 2. Restaurant (Restaurante)

Armazena informações dos restaurantes cadastrados.

**Campos:**
- `id` (UUID): Identificador único
- `name` (String): Nome do restaurante
- `description` (String?): Descrição
- `image` (String?): URL da imagem
- `category` (String): Categoria (ex: "Pizza", "Hambúrguer")
- `rating` (Float): Nota média (0-5)
- `deliveryTime` (String): Tempo estimado de entrega
- `deliveryFee` (Float): Taxa de entrega
- `minimumOrder` (Float?): Pedido mínimo
- `ownerId` (UUID): ID do dono (User)
- `isActive` (Boolean): Se está ativo
- `address` (String): Endereço completo
- `phone` (String): Telefone
- `openingHours` (JSON?): Horários de funcionamento
- `createdAt` (DateTime): Data de criação
- `updatedAt` (DateTime): Data de atualização

**Relacionamentos:**
- `owner`: N:1 com User
- `products`: 1:N com Product
- `orders`: 1:N com Order
- `reviews`: 1:N com Review

**Regras de Negócio:**
- Apenas usuários com role RESTAURANT_OWNER podem criar restaurantes
- Rating é calculado automaticamente com base nas avaliações
- Restaurante pode ser desativado (soft delete)

---

### 3. Product (Produto/Item do Menu)

Armazena os produtos/itens do menu de cada restaurante.

**Campos:**
- `id` (UUID): Identificador único
- `name` (String): Nome do produto
- `description` (String?): Descrição
- `price` (Float): Preço
- `image` (String?): URL da imagem
- `category` (String): Categoria (ex: "Entrada", "Prato Principal")
- `restaurantId` (UUID): ID do restaurante
- `available` (Boolean): Se está disponível
- `preparationTime` (Int?): Tempo de preparo em minutos
- `createdAt` (DateTime): Data de criação
- `updatedAt` (DateTime): Data de atualização

**Relacionamentos:**
- `restaurant`: N:1 com Restaurant
- `orderItems`: 1:N com OrderItem

**Regras de Negócio:**
- Apenas o dono do restaurante pode gerenciar produtos
- Preço deve ser maior que zero
- Produtos indisponíveis não podem ser pedidos

---

### 4. Order (Pedido)

Armazena os pedidos realizados.

**Campos:**
- `id` (UUID): Identificador único
- `userId` (UUID): ID do cliente
- `restaurantId` (UUID): ID do restaurante
- `status` (Enum): Status do pedido (PENDING, CONFIRMED, PREPARING, OUT_FOR_DELIVERY, DELIVERED, CANCELLED)
- `subtotal` (Float): Subtotal dos itens
- `deliveryFee` (Float): Taxa de entrega
- `total` (Float): Total (subtotal + taxas)
- `addressId` (UUID): ID do endereço de entrega
- `paymentMethod` (String): Método de pagamento
- `notes` (String?): Observações
- `createdAt` (DateTime): Data de criação
- `updatedAt` (DateTime): Data de atualização

**Relacionamentos:**
- `user`: N:1 com User
- `restaurant`: N:1 com Restaurant
- `address`: N:1 com Address
- `items`: 1:N com OrderItem
- `review`: 1:1 com Review

**Regras de Negócio:**
- Status deve seguir fluxo lógico (não pode voltar estados)
- Total calculado automaticamente
- Apenas pedidos DELIVERED podem ser avaliados
- Pedidos podem ser cancelados apenas em estados iniciais

---

### 5. OrderItem (Item do Pedido)

Armazena os itens de cada pedido.

**Campos:**
- `id` (UUID): Identificador único
- `orderId` (UUID): ID do pedido
- `productId` (UUID): ID do produto
- `quantity` (Int): Quantidade
- `price` (Float): Preço unitário no momento da compra
- `subtotal` (Float): Subtotal (price * quantity)
- `notes` (String?): Observações do item
- `createdAt` (DateTime): Data de criação

**Relacionamentos:**
- `order`: N:1 com Order
- `product`: N:1 com Product

**Regras de Negócio:**
- Quantidade deve ser maior que zero
- Preço é fixado no momento da compra (histórico)
- Subtotal calculado automaticamente

---

### 6. Address (Endereço)

Armazena os endereços de entrega dos usuários.

**Campos:**
- `id` (UUID): Identificador único
- `userId` (UUID): ID do usuário
- `label` (String): Rótulo (ex: "Casa", "Trabalho")
- `street` (String): Rua
- `number` (String): Número
- `complement` (String?): Complemento
- `neighborhood` (String): Bairro
- `city` (String): Cidade
- `state` (String): Estado (UF)
- `zipCode` (String): CEP
- `isDefault` (Boolean): Se é o endereço padrão
- `createdAt` (DateTime): Data de criação
- `updatedAt` (DateTime): Data de atualização

**Relacionamentos:**
- `user`: N:1 com User
- `orders`: 1:N com Order

**Regras de Negócio:**
- Usuário pode ter apenas um endereço padrão
- CEP deve ser válido (formato: 00000-000)

---

### 7. Review (Avaliação)

Armazena as avaliações de restaurantes e pedidos.

**Campos:**
- `id` (UUID): Identificador único
- `userId` (UUID): ID do usuário avaliador
- `restaurantId` (UUID): ID do restaurante avaliado
- `orderId` (UUID): ID do pedido relacionado
- `rating` (Int): Nota (1-5 estrelas)
- `comment` (String?): Comentário
- `createdAt` (DateTime): Data de criação
- `updatedAt` (DateTime): Data de atualização

**Relacionamentos:**
- `user`: N:1 com User
- `restaurant`: N:1 com Restaurant
- `order`: 1:1 com Order

**Regras de Negócio:**
- Apenas pedidos DELIVERED podem ser avaliados
- Usuário pode avaliar apenas uma vez por pedido
- Rating deve ser entre 1 e 5
- Rating do restaurante é recalculado a cada nova avaliação

---

## Enums

### UserRole
```typescript
enum UserRole {
  CLIENT           // Cliente comum
  RESTAURANT_OWNER // Dono de restaurante
  ADMIN           // Administrador do sistema
}
```

### OrderStatus
```typescript
enum OrderStatus {
  PENDING          // Aguardando confirmação
  CONFIRMED        // Confirmado pelo restaurante
  PREPARING        // Em preparo
  OUT_FOR_DELIVERY // Saiu para entrega
  DELIVERED        // Entregue
  CANCELLED        // Cancelado
}
```

## Índices

Para otimizar consultas frequentes:

- `User.email` - Único
- `Restaurant.ownerId` - Index
- `Product.restaurantId` - Index
- `Order.userId` - Index
- `Order.restaurantId` - Index
- `Order.status` - Index
- `OrderItem.orderId` - Index
- `OrderItem.productId` - Index
- `Address.userId` - Index
- `Review.restaurantId` - Index
- `Review.orderId` - Único

## Considerações de Segurança

1. **Senhas**: Sempre criptografadas com bcrypt (salt rounds >= 10)
2. **2FA**: Secrets armazenados de forma segura
3. **Tokens**: Refresh tokens hasheados no banco
4. **Dados Sensíveis**: Nunca retornar password ou secrets nas queries
5. **Soft Delete**: Usuários e restaurantes não são deletados fisicamente

## Migrations

As migrations são gerenciadas pelo Prisma e versionadas no Git:

```bash
# Criar migration
npx prisma migrate dev --name nome_da_migration

# Aplicar migrations em produção
npx prisma migrate deploy

# Reset do banco (apenas desenvolvimento)
npx prisma migrate reset
```

## Seed

Dados iniciais para desenvolvimento:

- 1 usuário admin
- 3 usuários clientes de teste
- 2 usuários donos de restaurante
- 5 restaurantes de categorias variadas
- 30+ produtos distribuídos nos restaurantes
- Endereços de exemplo
- Pedidos de exemplo com diferentes status

```bash
npm run seed
```

---

**Última atualização**: Novembro 2025
