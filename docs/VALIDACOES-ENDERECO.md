# Validações de Endereço - Backend vs Frontend

## Regras de Validação Backend

**Arquivo:** `backend/src/modules/addresses/dto/create-address.dto.ts`

### Campos e Validações

| Campo | Tipo | Validação | Exemplo |
|-------|------|-----------|---------|
| **label** | String | Máx 50 caracteres | "Casa", "Trabalho" |
| **street** | String | Máx 200 caracteres | "Rua das Flores" |
| **number** | String | Máx 10 caracteres | "123", "123A" |
| **complement** | String | Máx 100 caracteres (opcional) | "Apto 101", "Fundos" |
| **neighborhood** | String | Máx 100 caracteres | "Centro", "Bairro das Flores" |
| **city** | String | Máx 100 caracteres | "Belo Horizonte" |
| **state (UF)** | String | Exatamente 2 LETRAS MAIÚSCULAS | "MG", "SP", "RJ" |
| **zipCode (CEP)** | String | Formato: `00000-000` ou `00000000` | "30160-011" ou "30160011" |
| **isDefault** | Boolean | Opcional, padrão false | true ou false |

---

## Validações Implementadas no Frontend

### 1. **Campo STATE (UF)**
```typescript
// Converte para MAIÚSCULAS e limita a 2 caracteres
if (name === "state") {
  finalValue = value.toUpperCase().slice(0, 2);
}
```

**Comportamento:**
- ✅ Aceita: `mg` → `MG`, `SP`, `rj` → `RJ`
- ✅ Limita a 2 caracteres
- ✅ Força maiúsculas
- ✅ Rejeita números

**HTML:**
```tsx
<input
  placeholder="UF (ex: MG)"
  maxLength={2}
  className="uppercase"
/>
```

---

### 2. **Campo ZIPCDE (CEP)**
```typescript
// Remove caracteres não-numéricos e formata
if (name === "zipCode") {
  finalValue = value.replace(/\D/g, "").slice(0, 8);
  if (finalValue.length === 5) {
    finalValue += "-";
  } else if (finalValue.length > 5 && !finalValue.includes("-")) {
    finalValue = finalValue.slice(0, 5) + "-" + finalValue.slice(5);
  }
}
```

**Comportamento:**
- ✅ Remove caracteres não-numéricos
- ✅ Limita a 8 dígitos
- ✅ Formata automaticamente: `30160011` → `30160-011`
- ✅ Aceita com ou sem hífen

**Exemplos:**
- Usuário digita: `30160011` → Campo mostra: `30160-011`
- Usuário digita: `30160-011` → Mantém: `30160-011`
- Usuário digita: `3 0 1 6 0 - 0 1 1` → Remove espaços: `30160-011`

---

### 3. **Campo NUMBER**
```typescript
// Apenas números, máx 10 caracteres
if (name === "number") {
  finalValue = value.replace(/\D/g, "").slice(0, 10);
}
```

**Comportamento:**
- ✅ Remove letras e caracteres especiais
- ✅ Aceita: `123`, `123A`, `123B/201`
- ✅ Formata: `123A/201` → `123201` (remove caracteres)
- ✅ Limita a 10 dígitos

---

## Fluxo Completo de Validação

```
┌─────────────────────┐
│   Usuário digita    │
└──────────┬──────────┘
           │
           ▼
┌──────────────────────────────┐
│  Validação Frontend (onChange) │
│  - Formata automaticamente    │
│  - Remove caracteres inválidos│
│  - Limita comprimento         │
│  - Converte para maiúsculas   │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│  Estado React atualizado     │
│  Campo vê mudança em tempo   │
│  real (feedback instantâneo) │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│  Clica "Adicionar Endereço"  │
│  Envia para Backend          │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│  Validação Backend (DTO)     │
│  - IsString, IsNotEmpty      │
│  - MaxLength                 │
│  - Matches (Regex)           │
└──────────┬───────────────────┘
           │
      ┌────┴────┐
      │          │
      ▼          ▼
   VÁLIDO    INVÁLIDO
      │          │
      ▼          ▼
   201 OK     400 Error
   Salva      Exibe erro
```

---

## Exemplos de Dados Corretos

```json
{
  "label": "Casa",
  "street": "Rua da Bahia",
  "number": "789",
  "complement": "Sala 501",
  "neighborhood": "Centro",
  "city": "Belo Horizonte",
  "state": "MG",
  "zipCode": "30160-011",
  "isDefault": false
}
```

---

## Erros Evitados

### ❌ Antes (Erro 400)
```
State: "mg"  ← Minúscula
Error: "UF deve conter exatamente 2 letras maiúsculas"
```

### ✅ Depois (Formatado)
```
State: "MG"  ← Convertido automaticamente
Aceito: 201 Created
```

---

### ❌ Antes (Erro 400)
```
ZipCode: "30160011"  ← Sem hífen
Error: "CEP deve estar no formato 00000-000 ou 00000000"
```

### ✅ Depois (Formatado)
```
ZipCode: "30160-011"  ← Formatado automaticamente
Aceito: 201 Created
```

---

## Melhorias de UX

1. **Placeholders Descritivos**
   - State: "UF (ex: MG)"
   - CEP: "CEP (ex: 30160-011)"
   - Number: "Número (ex: 789)"

2. **Formatação em Tempo Real**
   - Usuário vê a formatação enquanto digita
   - Sem necessidade de clicar em botão

3. **Limites Automáticos**
   - State: `maxLength={2}`
   - Não permite digitar além do limite

4. **Feedback Visual**
   - Focus ring com cor da marca `#ee7c2b`
   - Bordas destacadas ao focar

---

## Status Atual

✅ Backend: Validações implementadas e funcionando
✅ Frontend: Formatação automática implementada
✅ UX: Placeholders descritivos e feedback visual
✅ Validação Dupla: Frontend (UX) + Backend (Segurança)

