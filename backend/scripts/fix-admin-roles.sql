-- Script para corrigir roles de usuários ADMIN
-- Execute este script diretamente no seu banco de dados

-- 1. Verificar usuários com email admin
SELECT id, email, name, role, created_at 
FROM "users" 
WHERE email LIKE '%admin%'
ORDER BY created_at DESC;

-- 2. Atualizar role do admin@uaifood.com para ADMIN
UPDATE "users" 
SET role = 'ADMIN' 
WHERE email = 'admin@uaifood.com';

-- 3. Verificar resultado (execute depois do UPDATE)
SELECT id, email, name, role, created_at 
FROM "users" 
WHERE email = 'admin@uaifood.com';

-- 4. Ver distribuição de roles no sistema
SELECT role, COUNT(*) as total_users 
FROM "users" 
GROUP BY role;
