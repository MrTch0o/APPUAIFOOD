# Guia Completo: Autenticação de Dois Fatores (2FA) com Google Authenticator

## O que é 2FA com Authenticator?

A autenticação de dois fatores com Google Authenticator usa o protocolo **TOTP** (Time-based One-Time Password) para gerar códigos de segurança únicos que mudam a cada 30 segundos. É uma forma segura e não requer SMS ou internet após configuração.

## Como Funciona

### 1. **Fluxo de Configuração (Setup)**

```
Usuário acessa Perfil → Clica "Ativar 2FA"
         ↓
Backend gera SECRET (32 caracteres aleatórios em base32)
         ↓
Backend gera QR Code usando a URL otpauth://totp/...
         ↓
Frontend exibe QR Code para usuário escanear
         ↓
Usuário escaneia com Google Authenticator/Authy/Microsoft Authenticator
         ↓
Usuário digita código de 6 dígitos para confirmar
         ↓
Backend valida código com o SECRET gerado
         ↓
Se válido: Ativa 2FA no banco de dados
```

### 2. **Fluxo de Login (Verificação)**

```
Usuário entra email + senha
         ↓
Backend valida credenciais
         ↓
Se 2FA está ATIVADO:
  - Retorna requires2FA: true + userId
  - Redireciona para página de verificação 2FA
         ↓
Usuário abre seu app autenticador
         ↓
Usuário digita código de 6 dígitos
         ↓
Frontend envia código para POST /auth/2fa/verify
         ↓
Backend valida código com o SECRET armazenado
         ↓
Se válido: Gera JWT tokens e faz login completo
```

## Implementação no APPUAIFOOD

### **Backend: O que já existe**

#### 1. **TwoFactorService** (`two-factor.service.ts`)
- ✅ Gera secret (32 chars em base32)
- ✅ Cria URL otpauth e QR code
- ✅ Verifica token TOTP (window: 2 períodos = 60 segundos tolerância)
- ✅ Gera token para testes

#### 2. **Auth Service** (`auth.service.ts`)
- ✅ `generate2FA()` - Gera secret + QR code
- ✅ `enable2FA()` - Ativa após validar código
- ✅ `disable2FA()` - Desativa após validar código
- ✅ `verify2FALogin()` - Verifica código durante login
- ✅ `login()` - Retorna `requires2FA: true` se 2FA está ativo

#### 3. **Auth Controller** (`auth.controller.ts`)
- ✅ `POST /auth/2fa/generate` - Gera QR code
- ✅ `POST /auth/2fa/enable` - Ativa 2FA
- ✅ `POST /auth/2fa/disable` - Desativa 2FA
- ✅ `POST /auth/2fa/verify` - Verifica código no login

#### 4. **DTOs**
- ✅ `Enable2FADto` - Validação para enable (código 6 dígitos)
- ✅ `Disable2FADto` - Validação para disable
- ✅ `Verify2FADto` - Validação para verify login
- ✅ `Login2FADto` - Login com código opcional

### **Database Schema**
```prisma
User {
  twoFASecret   String?      // Secret armazenado (base32)
  is2FAEnabled  Boolean      // Flag se 2FA está ativo
}
```

---

## Frontend: Implementação Necessária

### **1. Página de Configuração 2FA** (`/2fa/configurar`)
Necessário criar/atualizar:

```typescript
// Fluxo:
1. Botão para iniciar config → GET /auth/2fa/generate (requer JWT)
2. Exibir QR code em <img> ou <canvas>
3. Input de 6 dígitos
4. Botão "Confirmar" → POST /auth/2fa/enable + código
5. Sucesso → Redirecionar para /perfil
```

### **2. Página de Verificação 2FA no Login** (`/2fa/verificar`)
Necessário criar:

```typescript
// Fluxo:
1. Receber userId da query param (do login anterior)
2. Input de 6 dígitos
3. Botão "Verificar" → POST /auth/2fa/verify + userId + código
4. Sucesso → Salvar tokens + Redirecionar para /
```

### **3. Página de Perfil** (`/perfil`)
Adicionar seção:

```typescript
// Mostrar status 2FA
// Se desativado:
//   - Botão "Ativar 2FA" → vai para /2fa/configurar
// Se ativado:
//   - Mostrar "2FA Ativado ✓"
//   - Botão "Desativar" → Input código + POST /auth/2fa/disable
```

### **4. Página de Login** (`/login`)
Modificar fluxo:

```typescript
// No handleLoginSubmit:
const response = await login(email, password)

if (response.requires2FA) {
  // Salvar userId em sessionStorage
  sessionStorage.setItem('2faUserId', response.userId)
  // Redirecionar para verificação
  router.push('/2fa/verificar')
} else {
  // Login normal
  router.push('/')
}
```

---

## Fluxo Seguro Recomendado

### ✅ **Segurança Implementada**
- Secret armazenado com hash NO (texto plano, necessário para validar)
- Tolerância de 2 períodos (60s) para sincronização relógio
- Validação de código obrigatória
- JWT token gerado após validação

### ⚠️ **Melhorias Recomendadas**
1. **Recovery Codes**: Gerar 10 códigos de backup (8 dígitos) ao ativar 2FA
2. **Limite de Tentativas**: Max 5 tentativas com cooldown
3. **Audit Log**: Registrar quando 2FA foi ativado/desativado
4. **QR Code Display Seguro**: Mostrar apenas uma vez (não salvar em histórico)
5. **Sessão Temporária**: JWT com TTL curto (5 min) para verificação 2FA

---

## Tecnologias Usadas

- **speakeasy**: Gera/valida TOTP (RFC 6238)
- **qrcode**: Gera imagem QR code
- **Google Authenticator, Authy, Microsoft Authenticator**: Apps cliente

---

## Teste Manual

### Ativar 2FA
```bash
# 1. Login normal
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","password":"senha"}'

# 2. Gerar QR Code (use accessToken do passo 1)
curl -X POST http://localhost:3000/auth/2fa/generate \
  -H "Authorization: Bearer {accessToken}"

# 3. Escanear QR code ou usar secret manualmente
# Abrir Google Authenticator
# Adicionar conta manualmente com o secret

# 4. Ativar com código (código atual do Authenticator)
curl -X POST http://localhost:3000/auth/2fa/enable \
  -H "Authorization: Bearer {accessToken}" \
  -H "Content-Type: application/json" \
  -d '{"token":"123456"}'
```

### Verificar Login com 2FA
```bash
# 1. Login retorna requires2FA: true
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","password":"senha"}'
# Resposta: { requires2FA: true, userId: "..." }

# 2. Verificar código
curl -X POST http://localhost:3000/auth/2fa/verify \
  -H "Content-Type: application/json" \
  -d '{"userId":"...","token":"123456"}'
# Resposta: { user: {...}, accessToken: "...", refreshToken: "..." }
```

---

## Próximos Passos

1. ✅ Backend completo
2. ⏳ Criar página `/2fa/configurar`
3. ⏳ Criar página `/2fa/verificar`
4. ⏳ Adicionar seção 2FA em `/perfil`
5. ⏳ Modificar fluxo de login
6. ⏳ Testes e2e

