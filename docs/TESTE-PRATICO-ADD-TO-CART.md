# INSTRUÇÕES PRÁTICAS DE TESTE - ADD TO CART

## 🚀 INICIAR TESTES

### Pré-requisitos
- Frontend rodando: http://localhost:3001 ✅
- Estar logado no sistema
- Ter acesso a um restaurante com produtos

---

## 📱 TESTE 1: Adicionar produto básico

**URL**: http://localhost:3001/restaurante/[ID-DO-RESTAURANTE]

**Passos**:
1. Navegar para página de um restaurante
2. Ver lista de produtos com botão 🛒 laranja
3. **CLICAR no botão 🛒 de um produto**

**Observar**:
- ⏳ Ícone muda para spinner giratório (⚙️)
- 🔒 Botão fica desabilitado
- 🎉 Toast VERDE aparece no canto inferior direito:
  ```
  ✓ [Nome do Produto] adicionado ao carrinho!
  ```
- ⏱️ Toast desaparece após 4 segundos

**Resultado esperado**: ✅ SUCESSO

---

## 📱 TESTE 2: Visualizar carrinho atualizado

**Passos**:
1. Após adicionar produto, ir para http://localhost:3001/carrinho
2. Observar se o produto aparece na lista

**Resultado esperado**: ✅ Produto no carrinho com quantidade 1

---

## 📱 TESTE 3: Adicionar segundo produto (incremento)

**Pré-requisito**: Produto já no carrinho

**Passos**:
1. Voltar para restaurante: http://localhost:3001/restaurante/[ID]
2. Clicar novamente no MESMO produto 🛒
3. Observar:
   - ⏳ Spinner durante carregamento
   - 🎉 Toast verde com mensagem de sucesso

**Ir para carrinho e verificar**: 
- Quantidade mudou de 1 para 2 (incrementado)

**Resultado esperado**: ✅ Quantidade incremented corretamente

---

## 📱 TESTE 4: ERRO - Restaurante Diferente (SINGLE-RESTAURANT RULE)

**Pré-requisito**: Carrinho com itens do restaurante A

**Passos**:
1. Ir para OUTRO restaurante: http://localhost:3001/restaurante/[ID-DIFERENTE]
2. Clicar no botão 🛒 de um produto deste novo restaurante
3. **Observar**:
   - ⏳ Spinner por alguns segundos
   - ❌ Toast VERMELHO aparece:
   ```
   ⚠️ Já tem itens de outro restaurante no carrinho. 
      Limpe o carrinho para adicionar produtos deste restaurante.
   ```
   - 🔒 Produto NÃO é adicionado

**Resultado esperado**: ❌ ERRO CONTROLADO COM MENSAGEM CLARA

---

## 📱 TESTE 5: Produto indisponível

**Pré-requisito**: Produto com status `available: false`

**Observar na página do restaurante**:
- Produto com overlay "Indisponível"
- Botão 🛒 desabilitado (cinzento, 50% opacidade)
- Cursor muda para "not-allowed" (proibido)
- Clique no botão não faz nada

**Resultado esperado**: ✅ Botão desabilitado visualmente

---

## 📱 TESTE 6: Não autenticado (Redirecionar Login)

**Pré-requisito**: Estar deslogado

**Passos**:
1. Abrir incógnito ou limpar cookies
2. Ir para restaurante: http://localhost:3001/restaurante/[ID]
3. Clicar no botão 🛒

**Observar**:
- 🔄 Redireciona para http://localhost:3001/login
- Não adiciona ao carrinho

**Resultado esperado**: ✅ Redirecionamento para login

---

## 🔍 INSPEÇÃO DO CÓDIGO NO NAVEGADOR

### DevTools > Network
1. Abrir DevTools: `F12`
2. Ir para aba "Network"
3. Clicar no botão 🛒
4. Observar requisição:
   ```
   POST /cart/items
   Status: 201 (sucesso) ou 400 (erro)
   Body: { productId: "uuid", quantity: 1 }
   ```

### DevTools > Console
1. Aba "Console"
2. Ver logs (se houver):
   ```
   Produto adicionado ao carrinho com sucesso { productId, productName }
   ```

---

## 🧪 TESTE MANUAL COMPLETO

### Cenário: Fluxo de compra real

**Passos**:
```
1. [HOME] http://localhost:3001
   └─ Ver lista de restaurantes

2. [CLIQUE] Selecionar um restaurante
   └─ Carregar página de restaurante com produtos

3. [AÇÃO] Clicar 🛒 em 3 produtos diferentes
   └─ Sucesso: 3 toasts verdes aparecem
   └─ Carrinho tem 3 itens

4. [NAVEGAR] Ir para /carrinho
   └─ Ver 3 produtos com quantidades
   └─ Cálculo de total está correto

5. [AÇÃO] Clicar 🛒 em um produto novamente (da mesma lista)
   └─ Toast verde: "Produto adicionado"
   └─ Quantidade muda de 1 para 2

6. [NAVEGAR] Voltar para home
   └─ Clicar em OUTRO restaurante

7. [AÇÃO] Tentar clicar 🛒 em produto deste novo restaurante
   └─ Toast VERMELHO de erro
   └─ Mensagem sobre carrinho com outro restaurante

8. [VOLTAR] Ir para carrinho
   └─ Produtos originais ainda lá (não foram modificados)
```

---

## 📊 CHECKLIST DE VALIDAÇÃO

Marque cada teste como concluído:

- [ ] Teste 1: Adicionar produto básico ✅
- [ ] Teste 2: Carrinho atualizado ✅
- [ ] Teste 3: Incremento de quantidade ✅
- [ ] Teste 4: Erro single-restaurant ✅
- [ ] Teste 5: Produto indisponível ✅
- [ ] Teste 6: Redirecionar login ✅
- [ ] DevTools Network vê POST /cart/items ✅
- [ ] Animações suaves (spinner, toast) ✅
- [ ] Toast auto-fecha após 4s ✅
- [ ] Mensagens em português ✅
- [ ] Sem erros no console ✅
- [ ] Responsivo em mobile ✅

**Todos os testes passando?** → ✅ PRONTO PARA PRODUÇÃO

---

## 🐛 DEBUGGING

### Se algo não funcionar:

**Toast não aparece?**
```
✓ Verificar se componente <Toast> está renderizado
✓ Verificar estado [toast, setToast]
✓ Verificar imports de Toast
```

**Spinner não gira?**
```
✓ F12 > Inspect > verificar se tem classe "animate-spin"
✓ Verificar CSS em globals.css tem @keyframes spin
```

**Produto não é adicionado?**
```
✓ Verificar Network tab - qual é o status da requisição?
✓ Se 400 - ver mensagem de erro do backend
✓ Se erro diferente - ver console para exceções
```

**Botão não desabilita?**
```
✓ Verificar disabled={!product.available || addingToCartId === product.id}
✓ Verificar se addingToCartId está sendo setado
```

---

## 📞 CONTATO DE SUPORTE

Se encontrar problemas:
1. Verificar console do navegador (F12 > Console)
2. Verificar Network (F12 > Network > Filter: xhr/fetch)
3. Verificar backend logs (terminal do backend)
4. Criar issue com:
   - Screenshot
   - Erro do console
   - Request/response do Network
   - Passos para reproduzir

---

**Última atualização**: 2025-01-15
**Versão**: 1.0
**Status**: ✅ PRONTO PARA TESTES
