# 🚀 QUICK START - UAIFOOD

## ⚡ Iniciar em 2 Minutos

### Opção 1: Docker (Recomendado)
```bash
git clone https://github.com/MrTch0o/APPUAIFOOD.git
cd APPUAIFOOD
docker-compose up
```

Acesso:
- Frontend: http://localhost:3001
- Backend: http://localhost:3000
- Swagger: http://localhost:3000/api/docs

### Opção 2: Local
```bash
# Terminal 1 - Backend
cd backend
npm install
npx prisma migrate dev
npm run start:dev

# Terminal 2 - Frontend
cd frontend
npm install
npm run dev
```

---

## 🔑 Credenciais de Teste

### Admin
- Email: `admin@uaifood.com`
- Senha: `Admin@123`

### Restaurante
- Email: `dono.pizzaria@example.com`
- Senha: `Pizza@123`

### Cliente
- Email: `maria@example.com`
- Senha: `Maria@123`

---

## 📝 Variáveis de Ambiente

### Backend (.env)
```env
DATABASE_URL=postgresql://uaifood:uaifood123@localhost:5432/uaifood?schema=public
JWT_SECRET=dev-secret-change-in-production
PORT=3000
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

---

## 📚 Documentação

- **Completa**: [README.md](../README.md)
- **Detalhada**: [docs/REVISAO_COMPLETA_2025.md](./REVISAO_COMPLETA_2025.md)
- **Resumo**: [docs/RESUMO_REVISAO.md](./RESUMO_REVISAO.md)
- **API**: http://localhost:3000/api/docs (Swagger)

---

## 🛠️ Comandos Úteis

### Backend
```bash
npm run start:dev      # Desenvolvimento
npm run test           # Testes
npm run lint:fix       # Lint e formatar
npx prisma studio     # Interface do banco
npm run seed          # Dados iniciais
```

### Frontend
```bash
npm run dev           # Desenvolvimento
npm run build         # Build
npm run lint:fix      # Lint e formatar
```

### Docker
```bash
docker-compose up     # Iniciar
docker-compose down   # Parar
docker-compose logs   # Logs
```

---

## ✅ Status

| Componente | Status |
|-----------|--------|
| Backend | ✅ Completo |
| Frontend | ✅ Completo |
| Banco de Dados | ✅ Completo |
| Autenticação | ✅ Completo (JWT + 2FA) |
| Documentação | ✅ Completo |
| Testes | ✅ Configurado |
| Docker | ✅ Pronto |

---

## 🎯 Próximas Etapas

1. **Desenvolvimento**
   - Ver [README.md](../README.md) para guias completos
   - Adicionar novos features seguindo padrões
   - Escrever testes para novo código

2. **Produção**
   - Configurar HTTPS
   - Implementar rate limiting
   - Adicionar monitoramento
   - Setup CI/CD

3. **Manutenção**
   - Atualizar dependências
   - Revisar logs de erro
   - Otimizar queries lentes
   - Backup automático

---

## 🆘 Problemas Comuns

**Porta já em uso**
```bash
docker-compose down -v
docker-compose up --build
```

**Erro no banco**
```bash
cd backend
npx prisma migrate reset
npx prisma generate
```

**Frontend não carrega**
```bash
rm -rf .next
npm run dev
```

---

Para suporte completo, veja [README.md](../README.md) seção Troubleshooting.

---

*Última atualização: 19 de novembro de 2025*
