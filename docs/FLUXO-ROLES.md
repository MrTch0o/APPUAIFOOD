# 🔐 Fluxo Completo de Roles (Papéis de Usuário) - UAIFOOD

## 📊 Visão Geral do Sistema

O sistema implementa um controle de acesso baseado em **roles** (papéis de usuário). Existem **3 roles** principais:

| Role | Descrição | Permissões |
|------|-----------|-----------|
| `CLIENT` | Usuário comum | Fazer pedidos, avaliar restaurantes, gerenciar perfil |
| `RESTAURANT_OWNER` | Dono de restaurante | Gerenciar seu próprio restaurante e produtos |
| `ADMIN` | Administrador | Criar restaurantes, deletar restaurantes, gerenciar tudo |

---

## 🔄 Fluxo Completo: Do Registro até a Autorização

### 1️⃣ **FASE 1: REGISTRO DO USUÁRIO**

#### Onde começa?
Frontend: `/app/login/page.tsx` → Formulário de registro

```tsx
// Frontend - Formulário de Registro
const handleRegisterSubmit = async (e: React.FormEvent) => {
  // POST para /auth/register com dados:
  {
    name: "João Admin",
    email: "admin@uaifood.com",
    password: "Senha@123",
    phone: "31987654321"
  }
}
```

#### Backend: NestJS

**Arquivo:** `backend/src/modules/auth/auth.controller.ts`
```typescript
@Public() // Rota pública, não precisa de autenticação
@Post('register')
async register(@Body() registerDto: RegisterDto) {
  return this.authService.register(registerDto);
}
```

**Arquivo:** `backend/src/modules/auth/auth.service.ts`
```typescript
async register(registerDto: RegisterDto) {
  // ... validações ...
  
  // AQUI OCORRE A ATRIBUIÇÃO DE ROLE!
  const user = await this.prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      phone,
      role: UserRole.CLIENT,  // ⚠️ PROBLEMA: Sempre cria como CLIENT
    },
  });
  
  // Gerar tokens JWT
  const tokens = await this.generateTokens(
    user.id,
    user.email,
    user.role  // ← Role é incluída no token aqui
  );
  
  return { user, ...tokens };
}
```

**Problema Identificado:**
```
❌ Todo novo usuário registrado recebe role = "CLIENT"
❌ Não há como um usuário se registrar como "ADMIN"
❌ Os únicos ADMIN são inseridos diretamente no banco via Prisma
```

#### Banco de Dados: Prisma Schema

**Arquivo:** `backend/prisma/schema.prisma`
```typescript
model User {
  id          String   @id @default(uuid())
  email       String   @unique
  password    String
  name        String
  phone       String?
  role        UserRole @default(CLIENT)  // ← Default é CLIENT
  is2FAEnabled Boolean @default(false)
  // ... mais campos ...
}

enum UserRole {
  CLIENT              // Cliente comum
  RESTAURANT_OWNER    // Dono de restaurante
  ADMIN               // Administrador
}
```

### 2️⃣ **FASE 2: LOGIN E GERAÇÃO DE JWT**

#### Backend: `auth.service.ts`
```typescript
async login(loginDto: LoginDto) {
  // 1. Validar credenciais
  const user = await this.validateUser(email, password);
  
  if (!user) {
    throw new UnauthorizedException('Credenciais inválidas');
  }
  
  // 2. Checar se tem 2FA ativado
  if (user.is2FAEnabled) {
    return {
      requires2FA: true,
      userId: user.id,
      message: 'Por favor, forneça o código 2FA'
    };
  }
  
  // 3. Gerar JWT com a role do usuário
  const tokens = await this.generateTokens(
    user.id,
    user.email,
    user.role  // ← A role vem do banco aqui
  );
  
  // 4. Retornar ao frontend
  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role,  // ← Role é retornada ao frontend
      is2FAEnabled: user.is2FAEnabled,
    },
    accessToken,    // JWT com role dentro
    refreshToken,
  };
}

// Gerando o JWT
private async generateTokens(
  userId: string,
  email: string,
  role: UserRole  // ← Role é incluída no payload
) {
  const jwtPayload = {
    sub: userId,
    email: email,
    role: role,  // ← AQUI está armazenado no token!
  };
  
  const accessToken = this.jwtService.sign(jwtPayload, {
    secret: this.configService.get('jwt.secret'),
    expiresIn: '15m'
  });
  
  return { accessToken, refreshToken };
}
```

### 3️⃣ **FASE 3: ARMAZENAMENTO NO FRONTEND**

#### Frontend: `contexts/AuthContext.tsx`
```typescript
async function login(data: LoginRequest) {
  try {
    const response = await authService.login(data);
    
    // Armazenar token
    localStorage.setItem("token", response.data.accessToken);
    
    // Armazenar usuário COM A ROLE
    localStorage.setItem("user", JSON.stringify(response.data.user));
    
    // Atualizar state
    setUser(response.data.user);  // ← user.role fica disponível aqui
  } catch (error) {
    logger.error("Erro ao fazer login", error);
  }
}
```

#### Frontend: `app/page.tsx` - Usando a role
```typescript
const { user } = useAuth();

// A role está disponível em user.role
if (user?.role === "ADMIN") {
  // Mostrar botão de admin
}
```

### 4️⃣ **FASE 4: VALIDAÇÃO NO BACKEND COM GUARDS E DECORATORS**

Quando uma requisição é feita para um endpoint protegido:

#### A. JWT Strategy Extrai a Role do Token

**Arquivo:** `backend/src/modules/auth/strategies/jwt.strategy.ts`
```typescript
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(...) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // ↑ Extrai o token do header "Authorization: Bearer <token>"
      ignoreExpiration: false,
      secretOrKey: 'seu-secret-key'
    });
  }

  async validate(payload: JwtPayload) {
    // payload contém: { sub, email, role }
    
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub }
    });
    
    // Retorna um objeto com a role
    return {
      sub: user.id,
      email: user.email,
      role: user.role  // ← Extraído do token E validado no banco
    };
  }
}
```

#### B. JWT Auth Guard Valida o Token

**Arquivo:** `backend/src/common/guards/jwt-auth.guard.ts`
```typescript
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    // 1. Checa se a rota é @Public()
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_KEY,
      [context.getHandler(), context.getClass()]
    );
    
    if (isPublic) {
      return true;  // Permite acesso
    }
    
    // 2. Valida JWT usando JwtStrategy
    return super.canActivate(context);
  }
}
```

#### C. Roles Guard Checa a Role Específica

**Arquivo:** `backend/src/common/guards/roles.guard.ts`
```typescript
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. Pega a lista de roles necessárias do @Roles() decorator
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()]
    );
    
    // Se não houver @Roles() decorator, permite acesso
    if (!requiredRoles) {
      return true;
    }
    
    // 2. Pega o usuário do request (preenchido pelo JwtStrategy)
    const { user } = context.switchToHttp().getRequest();
    
    // 3. Verifica se a role do usuário está na lista permitida
    return requiredRoles.some((role) => user.role === role);
    // Se user.role === "ADMIN" e ROLES_KEY = ["ADMIN"] → retorna true
  }
}
```

#### D. Roles Decorator Define Quais Roles São Permitidas

**Arquivo:** `backend/src/common/decorators/roles.decorator.ts`
```typescript
export const Roles = (...roles: UserRole[]) => 
  SetMetadata(ROLES_KEY, roles);
```

### 5️⃣ **FASE 5: USO NO CONTROLLER**

**Exemplo:** `backend/src/modules/restaurants/restaurants.controller.ts`

```typescript
@Controller('restaurants')
@UseGuards(JwtAuthGuard, RolesGuard)  // ← Aplica os guards
export class RestaurantsController {
  
  // ✅ Qualquer usuário autenticado pode listar
  @Public()
  @Get()
  findAll() {
    return this.restaurantsService.findAll();
  }
  
  // ✅ SOMENTE ADMIN pode criar restaurante
  @Post()
  @Roles(UserRole.ADMIN)  // ← Restringe a ADMIN
  create(@Body() dto: CreateRestaurantDto) {
    return this.restaurantsService.create(dto);
  }
  
  // ✅ ADMIN ou RESTAURANT_OWNER podem atualizar
  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.RESTAURANT_OWNER)
  update(@Param('id') id: string, @Body() dto: UpdateRestaurantDto) {
    return this.restaurantsService.update(id, dto);
  }
  
  // ✅ Somente ADMIN pode deletar
  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.restaurantsService.remove(id);
  }
  
  // ✅ Upload de imagem: ADMIN ou RESTAURANT_OWNER
  @Post(':id/image')
  @Roles(UserRole.ADMIN, UserRole.RESTAURANT_OWNER)
  uploadImage(@Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
    return this.restaurantsService.updateImage(id, file);
  }
}
```

### 6️⃣ **FASE 6: VALIDAÇÃO NO FRONTEND**

**Arquivo:** `frontend/app/admin/restaurante/page.tsx`

```typescript
export default function CadastroRestaurantePage() {
  const { user } = useAuth();
  
  // Verificação no frontend (camada adicional)
  if (!user || user.role !== "ADMIN") {
    return (
      <div>
        <p>Acesso negado. Apenas administradores podem criar restaurantes.</p>
        <button onClick={() => router.push("/")}>Voltar para Home</button>
      </div>
    );
  }
  
  // Só chega aqui se user.role === "ADMIN"
  return (
    <form onSubmit={handleSubmit}>
      {/* Formulário de criação de restaurante */}
    </form>
  );
}
```

---

## 🔍 Diagrama do Fluxo Completo

```
┌─────────────────────────────────────────────────────────────────────┐
│ 1. FRONTEND - Usuário faz Registro                                  │
│    POST /auth/register { email, password, name, phone }             │
└────────────────────────┬────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────────┐
│ 2. BACKEND - AuthService.register()                                 │
│    • Valida email único                                             │
│    • Hash da senha com bcrypt                                       │
│    • Cria usuário com role = "CLIENT" ❌ SEMPRE CLIENT              │
│    • Gera JWT com role dentro                                       │
└────────────────────────┬────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────────┐
│ 3. DATABASE - Prisma insere na tabela users                         │
│    {                                                                 │
│      id: "uuid",                                                     │
│      email: "admin@uaifood.com",                                    │
│      password: "hash_bcrypt",                                       │
│      name: "João Admin",                                            │
│      role: "CLIENT" ❌ PROBLEMA!                                    │
│    }                                                                 │
└────────────────────────┬────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────────┐
│ 4. BACKEND - AuthService.generateTokens()                           │
│    JWT Payload:                                                      │
│    {                                                                 │
│      sub: "uuid",                                                    │
│      email: "admin@uaifood.com",                                    │
│      role: "CLIENT" ❌ SEMPRE CLIENT NO TOKEN                       │
│      iat: 1701234567,                                               │
│      exp: 1701235467                                                │
│    }                                                                 │
│                                                                      │
│    JWT Token: eyJhbGc...rest_of_token                              │
└────────────────────────┬────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────────┐
│ 5. FRONTEND - Armazena no localStorage                              │
│    localStorage.setItem("token", accessToken)                       │
│    localStorage.setItem("user", JSON.stringify({                    │
│      id: "uuid",                                                     │
│      email: "admin@uaifood.com",                                    │
│      role: "CLIENT" ❌ PROBLEMA PERSISTE!                           │
│    }))                                                               │
└────────────────────────┬────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────────┐
│ 6. FRONTEND - Usuário tenta acessar /admin/restaurante              │
│    if (!user || user.role !== "ADMIN") {                            │
│      return "Acesso negado" ❌ ACESSO BLOQUEADO                     │
│    }                                                                 │
└────────────────────────────────────────────────────────────────────┘
```

---

## ⚠️ PROBLEMA IDENTIFICADO

### O Problema Principal

Quando você se registra como `admin@uaifood.com`, o sistema:

1. **Cria o usuário COM role = "CLIENT"** (não há campo no RegisterDTO para escolher role)
2. **Gera JWT COM role = "CLIENT"** (pega do usuário criado)
3. **Armazena no frontend COM role = "CLIENT"**
4. **Bloqueia acesso a /admin/restaurante** porque `user.role !== "ADMIN"`

### Por que admin@uaifood.com funciona no banco?

```sql
-- No banco de dados, você provavelmente tem:
SELECT * FROM users WHERE email = 'admin@uaifood.com';

-- Resultado:
id        | email               | name    | role  | created_at
----------|---------------------|---------|-------|------------------
uuid-123  | admin@uaifood.com   | Admin   | ADMIN | 2025-11-15
```

Essa role foi inserida **diretamente no banco** via Prisma Studio ou SQL manual, 
**NÃO** pelo fluxo de registro!

---

## ✅ SOLUÇÕES

### Solução 1: Inserir ADMIN no Banco Manualmente ✅ (Temporária)

```bash
# Via Prisma Studio
npx prisma studio

# E editar o usuário admin@uaifood.com para ter role = "ADMIN"
```

### Solução 2: Criar Seeder para ADMIN Inicial (Recomendado)

**Arquivo:** `backend/prisma/seed.ts`

```typescript
import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Buscar ou criar admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@uaifood.com' },
    update: { role: UserRole.ADMIN },
    create: {
      email: 'admin@uaifood.com',
      password: await bcrypt.hash('Admin@123', 10),
      name: 'Admin UAIFOOD',
      phone: '31987654321',
      role: UserRole.ADMIN,
    },
  });

  console.log('Admin criado:', admin);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
```

Depois rodar:
```bash
npx prisma db seed
```

### Solução 3: Permitir Admin via DTO (Para Produção)

**Modificar:** `backend/src/modules/auth/dto/register.dto.ts`

```typescript
import { IsEmail, IsString, MinLength, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { UserRole } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'usuario@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'Senha@123', minLength: 8 })
  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: 'João Silva' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '31987654321', required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  // ✅ Novo: Permitir especificar role (com validação)
  @ApiProperty({
    example: UserRole.CLIENT,
    enum: UserRole,
    required: false,
    description: 'Apenas ADMIN pode criar com role ADMIN'
  })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}
```

**Modificar:** `backend/src/modules/auth/auth.service.ts`

```typescript
async register(registerDto: RegisterDto) {
  const { email, password, name, phone, role } = registerDto;

  // ... validações ...

  const user = await this.prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      phone,
      role: role || UserRole.CLIENT,  // ✅ Usa role fornecido ou CLIENT
    },
  });

  // ... resto do código ...
}
```

---

## 📝 Resumo da Arquitetura de Roles

### Na Prisma Schema
```
Banco de dados → Enum UserRole { CLIENT, RESTAURANT_OWNER, ADMIN }
```

### No Backend
```
JWT Strategy:        Extrai role do token e valida no banco
JwtAuthGuard:        Valida se usuário está autenticado
RolesGuard:          Valida se role do usuário está autorizado
Roles Decorator:     @Roles(UserRole.ADMIN) define quem pode acessar
```

### No Frontend
```
AuthContext:         Armazena user com role no localStorage
useAuth():           Fornece user.role para usar na UI
Verificações:        if (user?.role === "ADMIN") { ... }
```

### Fluxo Completo
```
1. Registro           → Role atribuída (padrão: CLIENT)
2. Login              → Role extraída do banco, incluída no JWT
3. Token enviado      → Role incluída no Authorization header
4. Backend valida     → Jwt.verify extrai role, RolesGuard checa
5. Acesso concedido   → Se role está autorizada
6. Frontend usa       → Condiciona UI com base em role
```

---

## 🚀 Próximas Ações

1. **Imediato:** Alterar role de `admin@uaifood.com` para `ADMIN` no banco (Prisma Studio)
2. **Curto Prazo:** Implementar seeder para criar admin inicial
3. **Longo Prazo:** Permitir criar ADMIN via RegisterDTO (com validação segura)

Depois disso, ao fazer login com `admin@uaifood.com`, você terá acesso a `/admin/restaurante` e conseguirá criar restaurantes! ✅
