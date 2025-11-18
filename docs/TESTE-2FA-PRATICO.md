# 🧪 GUIA PRÁTICO DE TESTE - 2FA UAIFOOD

## ⚡ Quick Start

### Pré-requisitos
- [ ] App Google Authenticator instalado no celular
- [ ] Conta de usuário no UAIFOOD
- [ ] Acesso ao código fonte

---

## 🔄 Teste Completo (5-10 minutos)

### ✅ Passo 1: Ativar 2FA
**Tempo esperado**: 2 minutos

```
1. Acesse o UAIFOOD e faça login
2. Clique na sua foto de perfil → Perfil
3. Procure por "Autenticação de Dois Fatores"
4. Clique em "Ativar 2FA com Google Authenticator"
5. Veja a página com 3 cards explicativos
6. Clique em "Próximo: Gerar QR Code"
7. Veja o QR code aparecer
8. Pegue seu celular
9. Abra o Google Authenticator
10. Clique no "+" (adicionar conta)
11. Clique "Escanear código QR"
12. Aponte para o QR code na tela
13. O Authenticator vai gerar um código
14. Copie o código (ex: 123456)
15. Volte para o navegador
16. Clique em "Próximo: Confirmar Código"
17. Cole o código no campo
18. Clique em "Ativar 2FA"
19. Veja "2FA ativado com sucesso!"
20. Será redirecionado para o perfil
   
✅ RESULTADO ESPERADO: Badge verde "2FA Ativado" no perfil
```

### ✅ Passo 2: Fazer Login com 2FA
**Tempo esperado**: 2 minutos

```
1. Clique em "Sair" para fazer logout
2. Vá para a página de login
3. Digite seu email
4. Digite sua senha
5. Clique em "Entrar"
6. ⚡ SERÁ REDIRECIONADO PARA VERIFICAÇÃO 2FA
7. Pegue seu celular
8. Abra o Google Authenticator
9. Procure por "UAIFOOD"
10. Veja um código numérico (ex: 123456)
11. Copie o código (ou memorize)
12. Volte para o navegador
13. Digite o código de 6 dígitos
14. Clique em "Verificar"
15. Veja "2FA verificado com sucesso!"
16. Será redirecionado para a home

✅ RESULTADO ESPERADO: Login completo com 2FA
```

### ✅ Passo 3: Testar Código Inválido
**Tempo esperado**: 1 minuto

```
1. Faça logout novamente
2. Faça login com email + senha
3. Será redirecionado para verificação
4. Digite um código errado (ex: 000000)
5. Clique "Verificar"
6. Veja erro: "Código inválido. Tentativas restantes: 4"
7. Tente mais 4 vezes com códigos errados
8. Na 5ª tentativa veja: "Limite de tentativas excedido"
9. Será redirecionado automaticamente para login

✅ RESULTADO ESPERADO: Sistema bloqueia após 5 tentativas
```

### ✅ Passo 4: Desativar 2FA
**Tempo esperado**: 1 minuto

```
1. Faça login com email + senha + código 2FA
2. Vá para Perfil
3. Procure por "Autenticação de Dois Fatores"
4. Veja badge verde "2FA Ativado"
5. Clique em "Desativar 2FA"
6. Campo de código aparece
7. Pegue seu celular com Google Authenticator
8. Procure por "UAIFOOD"
9. Copie o código
10. Cole no navegador
11. Clique "Confirmar Desativação"
12. Veja "2FA foi desativado com sucesso!"
13. Badge desaparece
14. Botão "Ativar 2FA" reaparece

✅ RESULTADO ESPERADO: 2FA desativado com sucesso
```

### ✅ Passo 5: Verificar que Login Normal Funciona
**Tempo esperado**: 1 minuto

```
1. Faça logout
2. Faça login com email + senha
3. ⚡ DEVE ENTRAR DIRETAMENTE (sem 2FA)
4. Redirecionado para home
5. Vê que está autenticado normalmente

✅ RESULTADO ESPERADO: Login sem 2FA funciona normalmente
```

---

## 📊 Checklist de Teste

### Funcionalidades Básicas
- [ ] 2FA pode ser ativado
- [ ] QR code é exibido corretamente
- [ ] Google Authenticator consegue ler o QR
- [ ] Código gerado é válido
- [ ] 2FA pode ser desativado

### Fluxo de Login
- [ ] Login com 2FA redireciona para verificação
- [ ] Código correto faz login
- [ ] Código inválido mostra erro
- [ ] 5 tentativas inválidas bloqueiam
- [ ] Login sem 2FA funciona normalmente

### Mensagens
- [ ] Mensagens de sucesso são claras
- [ ] Mensagens de erro são descritivas
- [ ] Contador de tentativas é exato
- [ ] Redirecionamentos automáticos funcionam

### UI/UX
- [ ] Página de configuração é intuitiva
- [ ] Input de código é fácil de usar
- [ ] Página de perfil mostra status 2FA
- [ ] Design é consistente

### Segurança
- [ ] SessionStorage limpo após sucesso
- [ ] Tokens em localStorage após login
- [ ] Códigos expiram a cada 30 segundos
- [ ] Backend valida todos os códigos

---

## 🐛 Possíveis Problemas e Soluções

### Problema: QR Code não aparece
**Solução**: 
- Verifique se o navegador permite pop-ups
- Limpe o cache do navegador
- Tente em outro navegador

### Problema: Google Authenticator não consegue ler QR
**Solução**:
- Aumente o zoom da página
- Use a entrada manual (código base32 aparece abaixo)
- Teste com outro app (Authy, Microsoft Authenticator)

### Problema: Código não valida
**Solução**:
- Verifique se copou o código inteiro
- Cheque se está digitando número correto
- Sincronize hora do celular com servidor
- Aguarde 1-2 segundos antes de tentar (código está prestes a expirar)

### Problema: Limite de tentativas atingido muito rápido
**Solução**:
- Aguarde alguns segundos e tente novo código
- O código muda a cada 30 segundos
- Verifique se digitou corretamente

### Problema: Não consegue desativar 2FA
**Solução**:
- Digite exatamente 6 dígitos
- Não copie espaços
- Use código atual (muda a cada 30s)

---

## 🎯 Casos de Teste Automáticos (Se Houver Test Suite)

```javascript
// Exemplo de testes que poderiam ser adicionados

describe("2FA Flow", () => {
  test("should generate QR code on /2fa/configurar", () => {
    // GET /auth/2fa/generate deve retornar QR code
  });

  test("should enable 2FA with valid code", () => {
    // POST /auth/2fa/enable com código válido
  });

  test("should disable 2FA with valid code", () => {
    // POST /auth/2fa/disable com código válido
  });

  test("should require 2FA on login if enabled", () => {
    // POST /auth/login deve retornar requires2FA: true
  });

  test("should verify 2FA code and return tokens", () => {
    // POST /auth/2fa/verify com código válido
  });

  test("should reject invalid 2FA code", () => {
    // POST /auth/2fa/verify com código inválido
  });

  test("should block after 5 failed attempts", () => {
    // 5x POST /auth/2fa/verify com código inválido
  });
});
```

---

## 📱 Testado em

### Navegadores
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

### Dispositivos
- [ ] Desktop Windows
- [ ] Desktop Mac
- [ ] Tablet
- [ ] Mobile

### Apps Autenticadores
- [ ] Google Authenticator
- [ ] Authy
- [ ] Microsoft Authenticator

---

## ✅ Checklist Final

Antes de colocar em produção:

- [ ] Todos os 5 passos principais funcionam
- [ ] Nenhum erro no console do navegador
- [ ] Nenhum erro no log do backend
- [ ] Mensagens são claras e corretas
- [ ] Redirecionamentos funcionam
- [ ] SessionStorage/localStorage limpam corretamente
- [ ] Mobile responsivo
- [ ] Teclado mobile aparece (inputMode="numeric")
- [ ] 2FA funciona em múltiplos navegadores
- [ ] 2FA funciona com múltiplos apps

---

## 📞 Debug Tips

### Ver SessionStorage
```javascript
// No console do navegador:
sessionStorage.getItem("2faUserId")  // Deve ter userId durante verificação
```

### Ver LocalStorage
```javascript
// No console do navegador:
localStorage.getItem("token")        // JWT após login bem-sucedido
localStorage.getItem("refreshToken") // Refresh token
```

### Ver Requisições
```
1. Abra DevTools (F12)
2. Vá para aba "Network"
3. Filtre por "2fa"
4. Veja as requisições POST
5. Clique em cada uma para ver Response
```

### Ver Logs
```
1. Abra DevTools (F12)
2. Vá para aba "Console"
3. Procure por "Verificando código 2FA" ou "2FA ativado"
4. Veja os logs com detalhes
```

---

## 🎓 Aprendizados

### Como funciona TOTP
1. Secret é gerado aleatoriamente (32 chars)
2. Algoritmo HMAC-SHA1 usa secret + timestamp
3. Divide resultado em períodos de 30 segundos
4. Último dígito de cada período é o código
5. Código muda a cada 30 segundos

### Por que sessão é armazenada em sessionStorage?
- Dados temporários apenas durante login
- Não precisa persistir entre abas
- Limpa automaticamente ao fechar aba
- Seguro para userId (não é credencial)

### Por que tokens em localStorage?
- Tokens precisam persistir entre refreshes
- Necessários para todas as requisições
- httpOnly cookies seria ideal (melhor prática)
- localStorage é prático para JWT em SPA

---

## 📚 Documentação Completa

Para mais detalhes, consulte:
- `/docs/2FA-IMPLEMENTACAO-COMPLETA.md` - Implementação técnica
- `/docs/CHECKLIST-2FA-COMPLETO.md` - Checklist detalhado
- `/docs/2FA-AUTHENTICATOR-GUIDE.md` - Guia arquitetura

---

**Tempo total estimado**: 10-15 minutos para teste completo

Boa sorte com os testes! 🚀
