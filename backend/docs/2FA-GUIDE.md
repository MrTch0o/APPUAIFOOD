# 🔐 Autenticação com 2FA (Two-Factor Authentication)

## 📋 Visão Geral

O sistema UAIFOOD suporta autenticação em dois fatores (2FA) usando TOTP (Time-based One-Time Password), compatível com aplicativos como:
- Google Authenticator
- Microsoft Authenticator
- Authy
- 1Password
- Qualquer app compatível com TOTP

---

## 🚀 Fluxo Completo de Uso

### 1️⃣ **Configurar 2FA (Primeira Vez)**

#### **Passo 1: Gerar QR Code**
```http
POST /api/auth/2fa/generate
Authorization: Bearer {access_token}
```

**Resposta:**
```json
{
  "secret": "JBSWY3DPEHPK3PXP",
  "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANS...",
  "message": "Escaneie o QR code com seu app autenticador..."
}
```

#### **Passo 2: Escanear QR Code**
- Abra seu app autenticador (Google Authenticator, Authy, etc.)
- Escaneie o QR code retornado
- O app começará a gerar códigos de 6 dígitos

#### **Passo 3: Ativar 2FA**
```http
POST /api/auth/2fa/enable
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "token": "123456"  // Código atual do seu app
}
```

**Resposta:**
```json
{
  "message": "2FA ativado com sucesso!",
  "is2FAEnabled": true
}
```

---

### 2️⃣ **Login com 2FA Ativado**

#### **Passo 1: Login Normal**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "SenhaSegura@123"
}
```

**Resposta (quando 2FA está ativado):**
```json
{
  "requires2FA": true,
  "userId": "uuid-do-usuario",
  "message": "Por favor, forneça o código 2FA para completar o login"
}
```

#### **Passo 2: Verificar Código 2FA**
```http
POST /api/auth/2fa/verify
Content-Type: application/json

{
  "userId": "uuid-do-usuario",
  "token": "123456"  // Código atual do app
}
```

**Resposta:**
```json
{
  "user": {
    "id": "uuid",
    "email": "usuario@example.com",
    "name": "Nome do Usuário",
    "role": "CLIENT",
    "is2FAEnabled": true
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 3️⃣ **Desativar 2FA**

```http
POST /api/auth/2fa/disable
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "token": "123456"  // Código atual do app
}
```

**Resposta:**
```json
{
  "message": "2FA desativado com sucesso!",
  "is2FAEnabled": false
}
```

---

## 🔍 Detalhes Técnicos

### **Algoritmo TOTP**
- **Algoritmo**: SHA-1
- **Período**: 30 segundos
- **Dígitos**: 6
- **Window**: ±2 períodos (aceita códigos de até 60s antes/depois)

### **Armazenamento**
- Secret armazenado criptografado no banco de dados
- Campo `twoFASecret` na tabela `users`
- Flag `is2FAEnabled` indica se 2FA está ativo

### **Segurança**
- Secret gerado com 32 caracteres aleatórios
- Validação de código obrigatória para ativar/desativar
- Códigos expiram a cada 30 segundos
- Window de 2 períodos previne problemas de sincronização de relógio

---

## 📱 Apps Recomendados

| App | iOS | Android | Desktop |
|-----|-----|---------|---------|
| Google Authenticator | ✅ | ✅ | ❌ |
| Microsoft Authenticator | ✅ | ✅ | ❌ |
| Authy | ✅ | ✅ | ✅ |
| 1Password | ✅ | ✅ | ✅ |
| Bitwarden | ✅ | ✅ | ✅ |

---

## ⚠️ Avisos Importantes

1. **Backup do Secret**: Guarde o secret em local seguro. Se perder acesso ao app autenticador, você precisará desativar o 2FA pelo suporte.

2. **Sincronização de Relógio**: Certifique-se de que o relógio do dispositivo está sincronizado corretamente.

3. **Códigos de Backup**: Em produção, considere implementar códigos de backup para recuperação.

4. **Rate Limiting**: Implemente rate limiting nas rotas de verificação 2FA para prevenir brute force.

---

## 🧪 Testando Localmente

### **1. Usando o Swagger**
Acesse: `http://localhost:3000/api/docs`

### **2. Usando cURL**

**Gerar QR Code:**
```bash
curl -X POST http://localhost:3000/api/auth/2fa/generate \
  -H "Authorization: Bearer SEU_TOKEN"
```

**Ativar 2FA:**
```bash
curl -X POST http://localhost:3000/api/auth/2fa/enable \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"token":"123456"}'
```

---

## 📚 Referências

- [RFC 6238 - TOTP](https://datatracker.ietf.org/doc/html/rfc6238)
- [Speakeasy Documentation](https://github.com/speakeasyjs/speakeasy)
- [OWASP 2FA Best Practices](https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html)

---

**Desenvolvido para**: UAIFOOD  
**Última atualização**: Novembro 2025
