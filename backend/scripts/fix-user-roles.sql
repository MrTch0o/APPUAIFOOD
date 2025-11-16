-- Script para corrigir roles de usuários que são proprietários de restaurantes
-- Atualizar usuários que possuem restaurantes para RESTAURANT_OWNER

-- Primeiro, identificar todos os usuários que são proprietários
SELECT u.id, u.email, u.name, u.role, COUNT(r.id) as restaurant_count
FROM users u
LEFT JOIN restaurants r ON r.owner_id = u.id
WHERE r.id IS NOT NULL
GROUP BY u.id, u.email, u.name, u.role;

-- Atualizar todos os proprietários de restaurante para RESTAURANT_OWNER
UPDATE users u
SET role = 'RESTAURANT_OWNER'
WHERE id IN (
  SELECT DISTINCT owner_id
  FROM restaurants
  WHERE owner_id IS NOT NULL
);

-- Verificar o resultado
SELECT id, email, name, role
FROM users
WHERE role = 'RESTAURANT_OWNER';
