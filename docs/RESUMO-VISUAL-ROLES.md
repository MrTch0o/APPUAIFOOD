# 📚 Resumo Visual: Sistema de Roles (Papéis) - UAIFOOD

## 🎯 TL;DR (Resumo Executivo)

**O Problema:**
- Você se registrou como `admin@uaifood.com`
- Sistema criou como `CLIENT` (não `ADMIN`)
- Não pode criar restaurantes porque precisa ser `ADMIN`

**A Causa:**
- Código backend força `role = CLIENT` em todo registro novo
- Não há campo no formulário para escolher role
- Only admins in banco tem `role = ADMIN`

**A Solução:**
- Editar `admin@uaifood.com` no banco para ter `role = ADMIN`
- Usar Prisma Studio ou script SQL fornecido

---

## 🏗️ Arquitetura Simplificada

```
┌─────────────────────────────────────────────────────────────┐
│                    BANCO DE DADOS                          │
│                   (PostgreSQL/Prisma)                      │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ Tabela: users                                       │  │
│  ├─────────────────────────────────────────────────────┤  │
│  │ id      │ email         │ name    │ role            │  │
│  ├─────────────────────────────────────────────────────┤  │
│  │ uuid-1  │ admin@...     │ Admin   │ ADMIN  ✅      │  │
│  │ uuid-2  │ maria@...     │ Maria   │ CLIENT ✅      │  │
│  │ uuid-3  │ dono@...      │ Pedro   │ RESTAURANT... │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ Enum: UserRole                                      │  │
│  ├─────────────────────────────────────────────────────┤  │
│  │ • CLIENT                                            │  │
│  │ • RESTAURANT_OWNER                                  │  │
│  │ • ADMIN                                             │  │
│  └─────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           ▲
                           │
                           │ (1) JWT contém role
                           │ (2) Guard valida role
                           │
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND (NestJS)                        │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ JwtStrategy: Extrai role do banco                   │  │
│  └─────────────────────────────────────────────────────┘  │
│                           │                                │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ JwtAuthGuard: Valida se JWT é válido              │  │
│  └─────────────────────────────────────────────────────┘  │
│                           │                                │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ RolesGuard: Valida se role está autorizado         │  │
│  │ @Roles(UserRole.ADMIN) ← Define quem entra        │  │
│  └─────────────────────────────────────────────────────┘  │
│                           │                                │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ Restaurantes Controller                             │  │
│  │ POST /restaurants @Roles(ADMIN)                     │  │
│  └─────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           ▲
                           │
                           │ Authorization header
                           │ "Bearer <JWT>"
                           │
┌─────────────────────────────────────────────────────────────┐
│                   FRONTEND (Next.js)                       │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ localStorage                                        │  │
│  │ • token: "eyJ0eXAi..."                              │  │
│  │ • user: { id, email, role: "ADMIN" }                │  │
│  └─────────────────────────────────────────────────────┘  │
│                           │                                │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ AuthContext.tsx                                     │  │
│  │ const { user } = useAuth()                          │  │
│  │ user.role = "ADMIN"                                 │  │
│  └─────────────────────────────────────────────────────┘  │
│                           │                                │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ Componentes validam role                            │  │
│  │ if (user?.role === "ADMIN") { <AdminPanel /> }      │  │
│  └─────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔐 Os 3 Roles Disponíveis

| Role | Valor no Banco | Descrição | Pode Fazer |
|------|---|---|---|
| 👤 **CLIENT** | `"CLIENT"` | Usuário comum | Fazer pedidos, avaliar, gerenciar perfil |
| 🏢 **RESTAURANT_OWNER** | `"RESTAURANT_OWNER"` | Dono de restaurante | Gerenciar seu restaurante e produtos |
| 👨‍💼 **ADMIN** | `"ADMIN"` | Administrador | Tudo (criar restaurantes, deletar usuários, etc) |

---

## 🔄 Fluxo Passo a Passo: Registro → Login → Requisição

### PASSO 1: Registro (Frontend)
```
Frontend: /app/login/page.tsx
│
├─ User clica "Registrar"
├─ Preenche: email, password, name, phone
└─ POST http://localhost:3000/api/auth/register
   {
     "email": "admin@uaifood.com",
     "password": "Admin@123",
     "name": "Admin",
     "phone": "31999999999"
   }
```

### PASSO 2: Backend Processa Registro
```
Backend: auth.service.ts → register()
│
├─ Valida email único
├─ Hash da senha (bcrypt)
├─ Cria usuário COM role = "CLIENT" ❌ SEMPRE CLIENT!
│  {
│    id: "uuid-xxx",
│    email: "admin@uaifood.com",
│    role: "CLIENT"  ← PROBLEMA AQUI!
│  }
└─ Gera JWT com role = "CLIENT"
   {
     "sub": "uuid-xxx",
     "email": "admin@uaifood.com",
     "role": "CLIENT"  ← JWT COM CLIENT!
   }
```

### PASSO 3: Resposta Retorna
```
Response:
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "...",
    "user": {
      "id": "uuid-xxx",
      "email": "admin@uaifood.com",
      "role": "CLIENT"  ← USER.ROLE = CLIENT
    }
  }
}
```

### PASSO 4: Frontend Armazena
```
Frontend: contexts/AuthContext.tsx
│
├─ localStorage.setItem("token", accessToken)
├─ localStorage.setItem("user", JSON.stringify(user))
│  {
│    id: "uuid-xxx",
│    email: "admin@uaifood.com",
│    role: "CLIENT"  ← ARMAZENADO COM CLIENT
│  }
└─ setUser(user) → user.role = "CLIENT"
```

### PASSO 5: Tentar Acessar Admin
```
Frontend: /admin/restaurante
│
├─ const { user } = useAuth()
├─ if (!user || user.role !== "ADMIN") {
│    return "Acesso negado"  ← BLOQUEADO!
│  }
└─ ❌ user.role = "CLIENT", não é "ADMIN"
```

---

## ✅ A Solução: Editar no Banco

### Opção 1: Prisma Studio (Mais Fácil)

```bash
# Terminal
cd backend
npx prisma studio

# Abre no navegador:
# http://localhost:5555

# 1. Clique em "users" na tabela
# 2. Encontre admin@uaifood.com
# 3. Clique para editar
# 4. Mude role de "CLIENT" para "ADMIN"
# 5. Salve
```

### Opção 2: Script SQL

```sql
-- Execute no seu banco PostgreSQL
UPDATE "users" 
SET role = 'ADMIN' 
WHERE email = 'admin@uaifood.com';
```

### Opção 3: Script TypeScript

```bash
cd backend
npx ts-node scripts/fix-admin-roles.ts
```

---

## 🔐 Fluxo APÓS Corrigir o Banco

```
Banco: admin@uaifood.com role = "ADMIN" ✅
                           ▲
                           │
Login Request
│
├─ POST /auth/login
│  {
│    "email": "admin@uaifood.com",
│    "password": "Admin@123"
│  }
└─ Backend busca no banco
   └─ Encontra role = "ADMIN" ✅
      └─ Gera JWT COM role = "ADMIN"
         {
           "sub": "uuid-xxx",
           "email": "admin@uaifood.com",
           "role": "ADMIN" ✅ AGORA É ADMIN!
         }

Response:
{
  "user": {
    "email": "admin@uaifood.com",
    "role": "ADMIN" ✅
  },
  "accessToken": "eyJ..."
}
        │
        ▼

Frontend Storage:
localStorage.user.role = "ADMIN" ✅
        │
        ▼

Tentar Acessar /admin/restaurante:
if (!user || user.role !== "ADMIN") { ... }
│
└─ user.role = "ADMIN" ✅
   └─ Permite acesso! ✅
      └─ POST http://localhost:3000/api/restaurants
         @Roles(UserRole.ADMIN)
         └─ Backend checa: user.role === "ADMIN" ✅
            └─ Permite criar restaurante! ✅
```

---

## 🗂️ Arquivos Principais Envolvidos

### Backend

**Banco de Dados:**
```
backend/prisma/schema.prisma
├─ Enum UserRole { CLIENT, RESTAURANT_OWNER, ADMIN }
├─ model User { role UserRole @default(CLIENT) }
└─ model Restaurant { ownerId, owner User }
```

**Autenticação:**
```
backend/src/modules/auth/
├─ auth.service.ts          ← Cria usuario com role = CLIENT
├─ auth.controller.ts       ← Endpoints de auth
└─ strategies/
   └─ jwt.strategy.ts       ← Extrai role do JWT
```

**Autorização:**
```
backend/src/common/
├─ guards/
│  ├─ jwt-auth.guard.ts     ← Valida JWT
│  └─ roles.guard.ts        ← Valida role específico
└─ decorators/
   ├─ roles.decorator.ts    ← @Roles(ADMIN)
   └─ current-user.decorator.ts ← @CurrentUser()
```

**Recursos Protegidos:**
```
backend/src/modules/restaurants/
├─ restaurants.controller.ts
│  ├─ GET /                 ← @Public()
│  ├─ POST /                ← @Roles(ADMIN)
│  ├─ PATCH /:id            ← @Roles(ADMIN, RESTAURANT_OWNER)
│  └─ DELETE /:id           ← @Roles(ADMIN)
└─ restaurants.service.ts
```

### Frontend

**Contexto:**
```
frontend/contexts/
└─ AuthContext.tsx         ← Armazena user com role
```

**Páginas:**
```
frontend/app/
├─ page.tsx                ← Home (público)
├─ admin/restaurante/
│  ├─ page.tsx             ← Criar restaurante (role check)
│  └─ editar/page.tsx      ← Editar restaurante (role check)
└─ login/page.tsx          ← Autenticação
```

**Tipos:**
```
frontend/types/
└─ index.ts                ← interface User { role?: string }
```

---

## 🚨 Por Que Acontece Assim?

### Razão 1: Segurança
```
Nunca confiar em dados do usuário!

❌ Perigoso:
POST /register { email, password, role: "ADMIN" }
└─ Usuario poderia enviar role = "ADMIN" na requisição

✅ Seguro:
POST /register { email, password }
├─ Sempre cria como CLIENT
└─ Apenas admins no banco podem ser ADMIN
```

### Razão 2: Fluxo Administrativo
```
Usuários normais → Registram como CLIENT
Admins → Inseridos no banco manualmente ou via seed
```

---

## 📊 Comparação de Permissões por Role

| Ação | CLIENT | RESTAURANT_OWNER | ADMIN |
|------|:------:|:----------------:|:-----:|
| Listar restaurantes | ✅ | ✅ | ✅ |
| Fazer pedidos | ✅ | ✅ | ✅ |
| Avaliar restaurante | ✅ | ✅ | ✅ |
| **Criar restaurante** | ❌ | ❌ | ✅ |
| **Editar restaurante** | ❌ | ✅ (seu) | ✅ |
| **Deletar restaurante** | ❌ | ❌ | ✅ |
| **Gerenciar usuários** | ❌ | ❌ | ✅ |

---

## 🎯 Próximos Passos

1. **Imediato (Agora):**
   - Execute um dos 3 scripts para editar `admin@uaifood.com` para `role = ADMIN`

2. **Próximo Login:**
   - Faça logout
   - Faça login com `admin@uaifood.com` novamente
   - Agora verá o menu Admin e conseguirá criar restaurantes

3. **Futuro (Produção):**
   - Implementar seeder automático
   - Considerar painel admin para gerenciar roles
   - Adicionar validações mais rigorosas

---

## 🧪 Teste Rápido

Depois de corrigir:

```
1. Logout (ou abra incognito)
2. Faça login com: admin@uaifood.com / Admin@123
3. Vá para /admin/restaurante
4. Deveria permitir criar restaurante agora ✅
```

---

**Status:** 📍 Aguardando você executar um dos 3 scripts para corrigir!
