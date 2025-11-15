# 🔐 MAPA VISUAL: Fluxo de Roles do UAIFOOD

## ─────────────────────────────────────────────────────────────────────────
## PROBLEMA ATUAL
## ─────────────────────────────────────────────────────────────────────────

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                         FLUXO DO REGISTRO                            ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

  [1] FRONTEND                      [2] BACKEND                    [3] BANCO
      
  Usuário clica              POST /auth/register        Cria usuário
  "Registrar"                                            no PostgreSQL
      │                              │                        │
      ├─────────────────────────────>│                        │
      │  {                           │                        │
      │    email,                    ├──────────────────────>│
      │    password,                 │  Cria user com         │
      │    name,                     │  role = "CLIENT"   ❌  │
      │    phone                     │                        │
      │  }                           │                        │
      │                              │  {                     │
      │                              │    id: "uuid",         │
      │                              │    role: "CLIENT" ❌   │
      │                              │  }                     │
      │                              │                        │
      │<─────────────────────────────┤<──────────────────────│
      │  {                           │                        │
      │    user: {                   │                        │
      │      role: "CLIENT" ❌       │                        │
      │    },                        │                        │
      │    accessToken: "eyJ...",    │                        │
      │    refreshToken: "..."       │                        │
      │  }                           │                        │
      │                              │                        │
      └──────────────────────────────────────────────────────────
         localStorage:
         • user.role = "CLIENT" ❌
         • token = "eyJ..." (contém role: "CLIENT")


  [4] USUÁRIO TENTA ACESSAR /admin/restaurante
      
      const { user } = useAuth()
      │
      if (user?.role !== "ADMIN") {  ❌ BLOQUEADO!
        return "Acesso Negado"
      }
      │
      └─ user.role = "CLIENT" ≠ "ADMIN"


  [5] BACKEND REJEITA REQUISIÇÃO
      
      POST /restaurants
      Authorization: Bearer eyJ0eXAi...
      │
      ├─ JwtStrategy: Extrai role = "CLIENT" do JWT
      ├─ JwtAuthGuard: Token válido ✅
      ├─ RolesGuard: Checa @Roles(UserRole.ADMIN)
      │  └─ "CLIENT" === "ADMIN"? ❌ NÃO!
      │
      └─ 403 Forbidden: Acesso negado
```

---

## ─────────────────────────────────────────────────────────────────────────
## A CORREÇÃO
## ─────────────────────────────────────────────────────────────────────────

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                      CORRIGIR ROLE NO BANCO                         ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

┌─────────────────────┐
│   Antes (❌ Errado) │
├─────────────────────┤
│ email: admin@...    │
│ role: CLIENT    ❌  │
└─────────────────────┘
         │
         │ Execute um dos scripts:
         │ • Prisma Studio
         │ • SQL direto
         │ • fix-admin-roles.ts
         │
         ▼
┌─────────────────────┐
│  Depois (✅ Certo)  │
├─────────────────────┤
│ email: admin@...    │
│ role: ADMIN     ✅  │
└─────────────────────┘
```

---

## ─────────────────────────────────────────────────────────────────────────
## FLUXO APÓS CORRIGIR
## ─────────────────────────────────────────────────────────────────────────

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                          LOGIN COM ADMIN                            ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

  [1] FRONTEND LOGIN
      
      const handleLogin = async (email, password) => {
        POST /auth/login
        │
        └─ email: "admin@uaifood.com"
           password: "Admin@123"


  [2] BACKEND AUTH SERVICE
      
      async login(loginDto) {
        const user = await validateUser(email, password)
        │
        └─ Busca no banco
           └─ Encontra:
              {
                id: "uuid-xxx",
                email: "admin@uaifood.com",
                name: "Admin",
                role: "ADMIN" ✅ CORRIGIDO!
              }

        const tokens = await generateTokens(
          user.id,
          user.email,
          user.role  ← role = "ADMIN" ✅
        )
        │
        └─ JWT Payload:
           {
             sub: "uuid-xxx",
             email: "admin@uaifood.com",
             role: "ADMIN" ✅
           }

        return {
          user: { role: "ADMIN" ✅ },
          accessToken: "eyJ...",
          refreshToken: "..."
        }
      }


  [3] FRONTEND ARMAZENA
      
      localStorage.setItem("user", JSON.stringify({
        id: "uuid-xxx",
        email: "admin@uaifood.com",
        role: "ADMIN" ✅
      }))


  [4] USUÁRIO ACESSA /admin/restaurante
      
      const { user } = useAuth()
      │
      if (!user || user.role !== "ADMIN") {
        return "Acesso negado"
      } else {
        return <FormCriarRestaurante />  ✅ PERMITIDO!
      }


  [5] CRIA RESTAURANTE
      
      const handleSubmit = async (formData) => {
        POST /restaurants
        Authorization: Bearer eyJ0eXAi...  ✅ role = ADMIN no JWT
        Body: { name, description, ... }


  [6] BACKEND PROCESSA
      
      @Controller('restaurants')
      @UseGuards(JwtAuthGuard, RolesGuard)
      export class RestaurantsController {
        
        @Post()
        @Roles(UserRole.ADMIN)  ← Exige ADMIN
        create(@Body() dto, @CurrentUser() user) {
          │
          ├─ JwtStrategy:
          │  Extrai JWT
          │  Busca user no banco
          │  Retorna { sub, email, role: "ADMIN" } ✅
          │
          ├─ JwtAuthGuard:
          │  JWT válido? ✅ SIM
          │
          ├─ RolesGuard:
          │  requiredRoles = [UserRole.ADMIN]
          │  user.role = "ADMIN"
          │  "ADMIN" in [ADMIN]? ✅ SIM
          │
          └─ Chama restaurantsService.create(dto, user.sub)
             └─ Insere no banco com ownerId = user.sub
                └─ 201 Created ✅ SUCESSO!
        }
      }


  [7] BANCO REGISTRA RESTAURANTE
      
      INSERT INTO restaurants (
        id, name, description, owner_id, ...
      ) VALUES (
        uuid, "Meu Restaurante", "...", uuid-admin, ...
      )


  [8] RESPOSTA
      
      {
        "success": true,
        "data": {
          "id": "uuid-rest",
          "name": "Meu Restaurante",
          "ownerId": "uuid-admin",
          "role": "ADMIN" ✅
        }
      }
```

---

## ─────────────────────────────────────────────────────────────────────────
## ARQUITETURA DE GUARDSGUARDS
## ─────────────────────────────────────────────────────────────────────────

```
                        Requisição HTTP
                             │
                             ▼
                    ┌─────────────────────┐
                    │  JwtAuthGuard       │
                    ├─────────────────────┤
                    │ Valida JWT sigla:   │
                    │ • Extrae token do   │
                    │   Authorization     │
                    │ • Verifica signature│
                    │ • Checa expiração   │
                    └─────────────────────┘
                             │
                    ✅ Token válido?
                    └─ Se NÃO → 401 Unauthorized
                    └─ Se SIM → Continua
                             ▼
                    ┌─────────────────────┐
                    │  RolesGuard         │
                    ├─────────────────────┤
                    │ Valida role:        │
                    │ • Lê @Roles()       │
                    │   decorator         │
                    │ • Pega role do user │
                    │   (preenchido por   │
                    │   JwtStrategy)      │
                    │ • Checa se role     │
                    │   está autorizado   │
                    └─────────────────────┘
                             │
                    ✅ Role permitida?
                    └─ Se NÃO → 403 Forbidden
                    └─ Se SIM → Continua
                             ▼
                    ┌─────────────────────┐
                    │   Controller        │
                    │   Método Handler    │
                    └─────────────────────┘
                             │
                             ▼
                        Requisição Processada
```

---

## ─────────────────────────────────────────────────────────────────────────
## MAPA DE PERMISSÕES
## ─────────────────────────────────────────────────────────────────────────

```
┏━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━┳━━━━━━━━━━━━━━━┳━━━━━━━┓
┃ Ação                 ┃ CLIENT ┃ RESTAURANT_OWN┃ ADMIN ┃
┡━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━╇━━━━━━━━━━━━━━━╇━━━━━━━┩
│                      │        │                │       │
│ GET /restaurants     │   ✅   │       ✅       │  ✅   │
│ GET /restaurants/:id │   ✅   │       ✅       │  ✅   │
│                      │        │                │       │
│ POST /restaurants    │   ❌   │       ❌       │  ✅   │
│ PATCH /restaurants/: │   ❌   │  ✅ (seu)      │  ✅   │
│ DELETE /restaurants/ │   ❌   │       ❌       │  ✅   │
│                      │        │                │       │
│ GET /products        │   ✅   │       ✅       │  ✅   │
│ POST /products       │   ❌   │  ✅ (seu rest) │  ✅   │
│                      │        │                │       │
│ POST /orders         │   ✅   │       ✅       │  ✅   │
│ GET /orders/me       │   ✅   │       ✅       │  ✅   │
│                      │        │                │       │
│ POST /users/me/2fa   │   ✅   │       ✅       │  ✅   │
│ GET /users (lista)   │   ❌   │       ❌       │  ✅   │
│                      │        │                │       │
└──────────────────────┴────────┴────────────────┴───────┘
```

---

## ─────────────────────────────────────────────────────────────────────────
## 3 SOLUÇÕES PARA CORRIGIR
## ─────────────────────────────────────────────────────────────────────────

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ SOLUÇÃO 1: Prisma Studio (Recomendado para testes)      ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

Terminal:
$ cd backend
$ npx prisma studio

Abre no navegador:
http://localhost:5555

Passos:
1. Clique em "users" na tabela à esquerda
2. Encontre admin@uaifood.com
3. Clique na linha para editar
4. Mude role de "CLIENT" para "ADMIN"
5. Clique save/confirmar
6. Pronto! ✅

Vantagem: Visual, fácil de entender
Desvantagem: Precisa deixar rodando
```

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ SOLUÇÃO 2: SQL Direto (Rápido, sem dependências)        ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

Use seu cliente PostgreSQL preferido (DBeaver, pgAdmin, etc):

UPDATE "users" 
SET role = 'ADMIN' 
WHERE email = 'admin@uaifood.com';

Verificar resultado:
SELECT id, email, name, role FROM "users" WHERE email = 'admin@uaifood.com';

Vantagem: Uma linha, sem código
Desvantagem: Precisa acessar o banco diretamente
```

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ SOLUÇÃO 3: Script TypeScript (Profissional)             ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

Terminal:
$ cd backend
$ npx ts-node scripts/fix-admin-roles.ts

Script faz:
✓ Lista todos os usuários com "admin" no email
✓ Muda role para "ADMIN"
✓ Mostra estatísticas finais
✓ Valida mudanças

Output:
🔧 Iniciando correção de roles...

📋 Usuários encontrados com "admin" no email:
  • admin@uaifood.com (Administrador UAIFOOD) - Role: CLIENT

🔄 Atualizando roles para ADMIN...

✅ 1 usuário(s) atualizado(s) para ADMIN

✔️ Estado final dos usuários admin:
  • admin@uaifood.com (Administrador UAIFOOD) - Role: ADMIN

📊 Distribuição de roles no sistema:
  • CLIENT: 3 usuários
  • ADMIN: 1 usuário

Vantagem: Automático, exibe feedback
Desvantagem: Precisa ter Node.js instalado
```

---

## ─────────────────────────────────────────────────────────────────────────
## FLUXO DE DADOS SIMPLIFICADO
## ─────────────────────────────────────────────────────────────────────────

```
[Usuário]
   │
   ├─────── Login com email/password
   │
   ▼
[Backend: auth.service.ts]
   │
   ├─ Validar email/password ✓
   │
   ├─ Buscar no banco → Encontra role
   │     │
   │     └─ role = "ADMIN" ✅ (após correção)
   │
   ├─ Gerar JWT com role
   │     │
   │     └─ {
   │       sub: "uuid",
   │       email: "admin@uaifood.com",
   │       role: "ADMIN" ✅
   │     }
   │
   └─ Retornar accessToken + user
         │
         └─ user.role = "ADMIN" ✅

[Frontend: localStorage]
   │
   ├─ Salvar token
   │
   ├─ Salvar user.role = "ADMIN" ✅
   │
   └─ AuthContext disponibiliza { user }

[useAuth Hook]
   │
   ├─ const { user } = useAuth()
   │
   ├─ user.role = "ADMIN" ✅
   │
   └─ Componentes acessam user.role

[Validação na UI]
   │
   ├─ if (user?.role === "ADMIN") {
   │    → Mostrar painel admin
   │  }
   │
   └─ ✅ Pagina /admin/restaurante liberada!

[Requisição para API]
   │
   ├─ POST /restaurants
   ├─ Authorization: Bearer eyJ0eXA...
   │  (JWT contém role: "ADMIN")
   │
   └─ Backend valida:
      ├─ JwtStrategy: Extrai role = "ADMIN" ✅
      ├─ JwtAuthGuard: Token válido ✅
      ├─ RolesGuard: @Roles(ADMIN) → user.role === "ADMIN" ✅
      └─ Cria restaurante com sucesso ✅
```

---

## ─────────────────────────────────────────────────────────────────────────
## RESUMO DA SOLUÇÃO
## ─────────────────────────────────────────────────────────────────────────

```
╔════════════════════════════════════════════════════════════════════════╗
║                          O PROBLEMA                                   ║
├────────────────────────────────────────────────────────────────────────┤
║                                                                        ║
║  admin@uaifood.com foi criado com role = "CLIENT"                     ║
║                                                                        ║
║  Sistema cria todos os registros com role = "CLIENT" por padrão       ║
║  (apenas admins no banco têm role = "ADMIN")                          ║
║                                                                        ║
╚════════════════════════════════════════════════════════════════════════╝

                              ▼

╔════════════════════════════════════════════════════════════════════════╗
║                       A SOLUÇÃO RÁPIDA                                ║
├────────────────────────────────────────────────────────────────────────┤
║                                                                        ║
║  1️⃣  Escolha uma das 3 opções:                                        ║
║     • Prisma Studio (visual)                                          ║
║     • SQL direto (rápido)                                             ║
║     • Script TypeScript (profissional)                                ║
║                                                                        ║
║  2️⃣  Execute para mudar admin@uaifood.com:                            ║
║     role: "CLIENT" → role: "ADMIN"                                    ║
║                                                                        ║
║  3️⃣  Faça logout e login novamente                                    ║
║                                                                        ║
║  4️⃣  Agora consegue acessar /admin/restaurante ✅                     ║
║                                                                        ║
╚════════════════════════════════════════════════════════════════════════╝

                              ▼

╔════════════════════════════════════════════════════════════════════════╗
║                    COMO FUNCIONA DEPOIS                               ║
├────────────────────────────────────────────────────────────────────────┤
║                                                                        ║
║  1. Login                                                              ║
║     └─ Busca admin@uaifood.com no banco                               ║
║        └─ role = "ADMIN" (agora está certo!)                          ║
║           └─ Gera JWT com role = "ADMIN"                              ║
║                                                                        ║
║  2. Frontend Armazena                                                  ║
║     └─ localStorage.user.role = "ADMIN"                               ║
║        └─ useAuth() retorna user com role = "ADMIN"                   ║
║                                                                        ║
║  3. Acessar /admin/restaurante                                         ║
║     └─ if (user?.role === "ADMIN") ✅ SIM                             ║
║        └─ Mostra formulário de criar restaurante                      ║
║                                                                        ║
║  4. Criar Restaurante                                                  ║
║     └─ POST /restaurants com JWT                                      ║
║        └─ Backend valida: role === "ADMIN" ✅                         ║
║           └─ Insere restaurante no banco com sucesso                  ║
║                                                                        ║
╚════════════════════════════════════════════════════════════════════════╝
```

---

**Próximo passo:** Execute uma das 3 soluções acima! 🚀
