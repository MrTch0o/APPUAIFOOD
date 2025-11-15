import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

async function fixAdminRoles() {
  try {
    console.log('🔧 Iniciando correção de roles...\n');

    // 1. Verificar usuários admin
    const adminUsers = await prisma.user.findMany({
      where: {
        email: {
          contains: 'admin',
          mode: 'insensitive',
        },
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    console.log('📋 Usuários encontrados com "admin" no email:\n');
    adminUsers.forEach((user) => {
      console.log(`  • ${user.email} (${user.name}) - Role: ${user.role}`);
    });

    if (adminUsers.length === 0) {
      console.log('❌ Nenhum usuário com "admin" no email encontrado.\n');
      return;
    }

    // 2. Atualizar role para ADMIN
    console.log('\n🔄 Atualizando roles para ADMIN...\n');

    const updated = await prisma.user.updateMany({
      where: {
        email: {
          contains: 'admin',
          mode: 'insensitive',
        },
      },
      data: {
        role: UserRole.ADMIN,
      },
    });

    console.log(`✅ ${updated.count} usuário(s) atualizado(s) para ADMIN\n`);

    // 3. Verificar resultado
    const updatedUsers = await prisma.user.findMany({
      where: {
        email: {
          contains: 'admin',
          mode: 'insensitive',
        },
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    console.log('✔️ Estado final dos usuários admin:\n');
    updatedUsers.forEach((user) => {
      console.log(`  • ${user.email} (${user.name}) - Role: ${user.role}`);
    });

    // 4. Estatísticas gerais
    console.log('\n📊 Distribuição de roles no sistema:\n');
    const roleStats = await prisma.user.groupBy({
      by: ['role'],
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
    });

    roleStats.forEach((stat) => {
      console.log(`  • ${stat.role}: ${stat._count.id} usuário(s)`);
    });

    console.log('\n✨ Operação concluída com sucesso!\n');
  } catch (error) {
    console.error('❌ Erro ao corrigir roles:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

void fixAdminRoles();
