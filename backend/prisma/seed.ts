import { PrismaClient, UserRole, OrderStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Hash password helper
  const hashPassword = async (password: string) => {
    return bcrypt.hash(password, 10);
  };

  // Limpar banco (apenas em desenvolvimento)
  if (process.env.NODE_ENV === 'development') {
    console.log('🗑️  Limpando banco de dados...');
    await prisma.review.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.address.deleteMany();
    await prisma.product.deleteMany();
    await prisma.restaurant.deleteMany();
    await prisma.user.deleteMany();
  }

  // ===== USUÁRIOS =====
  console.log('👥 Criando usuários...');

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@uaifood.com',
      password: await hashPassword('Admin@123'),
      name: 'Administrador UAIFOOD',
      phone: '31999999999',
      role: UserRole.ADMIN,
    },
  });

  const cliente1 = await prisma.user.create({
    data: {
      email: 'maria@example.com',
      password: await hashPassword('Maria@123'),
      name: 'Maria Silva',
      phone: '31987654321',
      role: UserRole.CLIENT,
    },
  });

  const cliente2 = await prisma.user.create({
    data: {
      email: 'joao@example.com',
      password: await hashPassword('Joao@123'),
      name: 'João Santos',
      phone: '31912345678',
      role: UserRole.CLIENT,
    },
  });

  const cliente3 = await prisma.user.create({
    data: {
      email: 'ana@example.com',
      password: await hashPassword('Ana@123'),
      name: 'Ana Costa',
      phone: '31998765432',
      role: UserRole.CLIENT,
    },
  });

  const restaurantOwner1 = await prisma.user.create({
    data: {
      email: 'dono.pizzaria@example.com',
      password: await hashPassword('Pizza@123'),
      name: 'Carlos Pizzaiolo',
      phone: '31911111111',
      role: UserRole.RESTAURANT_OWNER,
    },
  });

  const restaurantOwner2 = await prisma.user.create({
    data: {
      email: 'dono.burger@example.com',
      password: await hashPassword('Burger@123'),
      name: 'Pedro Burguer',
      phone: '31922222222',
      role: UserRole.RESTAURANT_OWNER,
    },
  });

  console.log('✅ Usuários criados!');

  // ===== ENDEREÇOS =====
  console.log('🏠 Criando endereços...');

  const endereco1 = await prisma.address.create({
    data: {
      userId: cliente1.id,
      label: 'Casa',
      street: 'Rua das Flores',
      number: '123',
      complement: 'Apto 101',
      neighborhood: 'Centro',
      city: 'Belo Horizonte',
      state: 'MG',
      zipCode: '30110-000',
      isDefault: true,
    },
  });

  const endereco2 = await prisma.address.create({
    data: {
      userId: cliente2.id,
      label: 'Casa',
      street: 'Av. Afonso Pena',
      number: '456',
      neighborhood: 'Funcionários',
      city: 'Belo Horizonte',
      state: 'MG',
      zipCode: '30130-001',
      isDefault: true,
    },
  });

  const endereco3 = await prisma.address.create({
    data: {
      userId: cliente3.id,
      label: 'Trabalho',
      street: 'Rua da Bahia',
      number: '789',
      complement: 'Sala 501',
      neighborhood: 'Centro',
      city: 'Belo Horizonte',
      state: 'MG',
      zipCode: '30160-011',
      isDefault: true,
    },
  });

  console.log('✅ Endereços criados!');

  // ===== RESTAURANTES =====
  console.log('🍽️  Criando restaurantes...');

  const pizzaria = await prisma.restaurant.create({
    data: {
      name: 'Pizzaria Bella Napoli',
      description: 'As melhores pizzas artesanais da cidade',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38',
      category: 'Pizzaria',
      rating: 4.8,
      deliveryTime: '30-45 min',
      deliveryFee: 5.0,
      minimumOrder: 20.0,
      ownerId: restaurantOwner1.id,
      address: 'Rua Itália, 100 - Savassi, Belo Horizonte - MG',
      phone: '31333333333',
      openingHours: {
        seg: '18:00-23:00',
        ter: '18:00-23:00',
        qua: '18:00-23:00',
        qui: '18:00-23:00',
        sex: '18:00-00:00',
        sab: '18:00-00:00',
        dom: '18:00-23:00',
      },
    },
  });

  const hamburgueria = await prisma.restaurant.create({
    data: {
      name: 'Burger House',
      description: 'Hambúrgueres artesanais e suculentos',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd',
      category: 'Hamburgueria',
      rating: 4.6,
      deliveryTime: '25-40 min',
      deliveryFee: 6.0,
      minimumOrder: 25.0,
      ownerId: restaurantOwner2.id,
      address: 'Av. Raja Gabaglia, 500 - Luxemburgo, Belo Horizonte - MG',
      phone: '31344444444',
      openingHours: {
        seg: '11:00-15:00, 18:00-23:00',
        ter: '11:00-15:00, 18:00-23:00',
        qua: '11:00-15:00, 18:00-23:00',
        qui: '11:00-15:00, 18:00-23:00',
        sex: '11:00-15:00, 18:00-00:00',
        sab: '11:00-00:00',
        dom: '11:00-23:00',
      },
    },
  });

  const japonesa = await prisma.restaurant.create({
    data: {
      name: 'Sushi Zen',
      description: 'Culinária japonesa autêntica',
      image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351',
      category: 'Japonesa',
      rating: 4.9,
      deliveryTime: '40-60 min',
      deliveryFee: 8.0,
      minimumOrder: 40.0,
      ownerId: restaurantOwner1.id,
      address: 'Rua Pernambuco, 1000 - Savassi, Belo Horizonte - MG',
      phone: '31355555555',
      openingHours: {
        seg: 'Fechado',
        ter: '12:00-15:00, 18:00-23:00',
        qua: '12:00-15:00, 18:00-23:00',
        qui: '12:00-15:00, 18:00-23:00',
        sex: '12:00-15:00, 18:00-00:00',
        sab: '12:00-00:00',
        dom: '12:00-23:00',
      },
    },
  });

  const marmitaria = await prisma.restaurant.create({
    data: {
      name: 'Marmitex do Chefe',
      description: 'Marmitas caseiras e saudáveis',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
      category: 'Marmitas',
      rating: 4.5,
      deliveryTime: '20-30 min',
      deliveryFee: 3.0,
      minimumOrder: 15.0,
      ownerId: restaurantOwner2.id,
      address: 'Rua São Paulo, 200 - Centro, Belo Horizonte - MG',
      phone: '31366666666',
      openingHours: {
        seg: '11:00-15:00',
        ter: '11:00-15:00',
        qua: '11:00-15:00',
        qui: '11:00-15:00',
        sex: '11:00-15:00',
        sab: '11:00-14:00',
        dom: 'Fechado',
      },
    },
  });

  const brasileira = await prisma.restaurant.create({
    data: {
      name: 'Sabor Mineiro',
      description: 'Comida mineira tradicional',
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1',
      category: 'Brasileira',
      rating: 4.7,
      deliveryTime: '35-50 min',
      deliveryFee: 7.0,
      minimumOrder: 30.0,
      ownerId: restaurantOwner1.id,
      address: 'Av. Getúlio Vargas, 300 - Funcionários, Belo Horizonte - MG',
      phone: '31377777777',
      openingHours: {
        seg: '11:00-15:00, 18:00-22:00',
        ter: '11:00-15:00, 18:00-22:00',
        qua: '11:00-15:00, 18:00-22:00',
        qui: '11:00-15:00, 18:00-22:00',
        sex: '11:00-15:00, 18:00-23:00',
        sab: '11:00-23:00',
        dom: '11:00-22:00',
      },
    },
  });

  console.log('✅ Restaurantes criados!');

  // ===== PRODUTOS =====
  console.log('🍕 Criando produtos...');

  // Produtos da Pizzaria
  await prisma.product.createMany({
    data: [
      {
        name: 'Pizza Margherita',
        description: 'Molho de tomate, mussarela, manjericão e azeite',
        price: 45.0,
        category: 'Pizzas Tradicionais',
        restaurantId: pizzaria.id,
        image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002',
        preparationTime: 30,
      },
      {
        name: 'Pizza Calabresa',
        description: 'Molho de tomate, mussarela, calabresa e cebola',
        price: 48.0,
        category: 'Pizzas Tradicionais',
        restaurantId: pizzaria.id,
        preparationTime: 30,
      },
      {
        name: 'Pizza Quatro Queijos',
        description: 'Mussarela, gorgonzola, parmesão e provolone',
        price: 52.0,
        category: 'Pizzas Tradicionais',
        restaurantId: pizzaria.id,
        preparationTime: 30,
      },
      {
        name: 'Pizza Pepperoni',
        description: 'Molho de tomate, mussarela e pepperoni',
        price: 50.0,
        category: 'Pizzas Tradicionais',
        restaurantId: pizzaria.id,
        preparationTime: 30,
      },
      {
        name: 'Pizza Portuguesa',
        description: 'Molho, mussarela, presunto, ovo, cebola e azeitona',
        price: 49.0,
        category: 'Pizzas Tradicionais',
        restaurantId: pizzaria.id,
        preparationTime: 30,
      },
      {
        name: 'Refrigerante Lata',
        description: 'Coca-Cola, Guaraná, Sprite ou Fanta',
        price: 5.0,
        category: 'Bebidas',
        restaurantId: pizzaria.id,
        preparationTime: 0,
      },
    ],
  });

  // Produtos da Hamburgueria
  await prisma.product.createMany({
    data: [
      {
        name: 'Classic Burger',
        description: 'Hambúrguer 180g, queijo, alface, tomate e molho especial',
        price: 28.0,
        category: 'Hambúrgueres',
        restaurantId: hamburgueria.id,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd',
        preparationTime: 25,
      },
      {
        name: 'Bacon Burger',
        description: 'Hambúrguer 180g, queijo, bacon, cebola caramelizada',
        price: 32.0,
        category: 'Hambúrgueres',
        restaurantId: hamburgueria.id,
        preparationTime: 25,
      },
      {
        name: 'Double Burger',
        description: 'Dois hambúrgueres 180g, queijo duplo, picles e molho',
        price: 38.0,
        category: 'Hambúrgueres',
        restaurantId: hamburgueria.id,
        preparationTime: 30,
      },
      {
        name: 'Veggie Burger',
        description: 'Hambúrguer vegetariano, queijo, cogumelos grelhados',
        price: 30.0,
        category: 'Hambúrgueres',
        restaurantId: hamburgueria.id,
        preparationTime: 25,
      },
      {
        name: 'Batata Frita Grande',
        description: 'Porção grande de batatas fritas crocantes',
        price: 15.0,
        category: 'Acompanhamentos',
        restaurantId: hamburgueria.id,
        preparationTime: 10,
      },
      {
        name: 'Onion Rings',
        description: 'Anéis de cebola empanados e fritos',
        price: 18.0,
        category: 'Acompanhamentos',
        restaurantId: hamburgueria.id,
        preparationTime: 10,
      },
      {
        name: 'Milkshake',
        description: 'Chocolate, Morango ou Baunilha',
        price: 12.0,
        category: 'Bebidas',
        restaurantId: hamburgueria.id,
        preparationTime: 5,
      },
    ],
  });

  // Produtos do Sushi
  await prisma.product.createMany({
    data: [
      {
        name: 'Combinado 20 peças',
        description: '10 sashimis, 5 niguiris e 5 hot rolls',
        price: 80.0,
        category: 'Combinados',
        restaurantId: japonesa.id,
        image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351',
        preparationTime: 40,
      },
      {
        name: 'Combinado 40 peças',
        description: '20 sashimis, 10 niguiris, 10 hot rolls',
        price: 140.0,
        category: 'Combinados',
        restaurantId: japonesa.id,
        preparationTime: 50,
      },
      {
        name: 'Hot Roll Salmão',
        description: '8 peças empanadas com salmão e cream cheese',
        price: 38.0,
        category: 'Hot Rolls',
        restaurantId: japonesa.id,
        preparationTime: 20,
      },
      {
        name: 'Sashimi Salmão',
        description: '10 fatias de salmão fresco',
        price: 42.0,
        category: 'Sashimi',
        restaurantId: japonesa.id,
        preparationTime: 15,
      },
      {
        name: 'Temaki Salmão',
        description: 'Cone de alga com salmão, arroz e gergelim',
        price: 22.0,
        category: 'Temaki',
        restaurantId: japonesa.id,
        preparationTime: 10,
      },
    ],
  });

  // Produtos da Marmitaria
  await prisma.product.createMany({
    data: [
      {
        name: 'Marmita Fit',
        description: 'Frango grelhado, arroz integral, legumes',
        price: 18.0,
        category: 'Marmitas',
        restaurantId: marmitaria.id,
        preparationTime: 15,
      },
      {
        name: 'Marmita Executiva',
        description: 'Arroz, feijão, carne, salada e farofa',
        price: 22.0,
        category: 'Marmitas',
        restaurantId: marmitaria.id,
        preparationTime: 15,
      },
      {
        name: 'Marmita Vegetariana',
        description: 'Arroz, feijão, legumes grelhados e salada',
        price: 20.0,
        category: 'Marmitas',
        restaurantId: marmitaria.id,
        preparationTime: 15,
      },
      {
        name: 'Marmita Low Carb',
        description: 'Frango, ovos, salada e legumes sem arroz',
        price: 24.0,
        category: 'Marmitas',
        restaurantId: marmitaria.id,
        preparationTime: 15,
      },
    ],
  });

  // Produtos do Sabor Mineiro
  await prisma.product.createMany({
    data: [
      {
        name: 'Feijão Tropeiro',
        description: 'Feijão com linguiça, bacon, couve e torresmo',
        price: 35.0,
        category: 'Pratos Principais',
        restaurantId: brasileira.id,
        preparationTime: 30,
      },
      {
        name: 'Frango com Quiabo',
        description: 'Frango caipira refogado com quiabo',
        price: 32.0,
        category: 'Pratos Principais',
        restaurantId: brasileira.id,
        preparationTime: 35,
      },
      {
        name: 'Tutu à Mineira',
        description: 'Tutu de feijão com costelinha e linguiça',
        price: 38.0,
        category: 'Pratos Principais',
        restaurantId: brasileira.id,
        preparationTime: 30,
      },
      {
        name: 'Pão de Queijo (6 unid)',
        description: 'Autêntico pão de queijo mineiro',
        price: 12.0,
        category: 'Entradas',
        restaurantId: brasileira.id,
        preparationTime: 10,
      },
      {
        name: 'Torresmo',
        description: 'Porção de torresmo crocante',
        price: 18.0,
        category: 'Entradas',
        restaurantId: brasileira.id,
        preparationTime: 10,
      },
    ],
  });

  console.log('✅ Produtos criados!');

  // ===== PEDIDOS =====
  console.log('📦 Criando pedidos de exemplo...');

  // Pedido 1 - Entregue
  const pizzaMargherita = await prisma.product.findFirst({
    where: { name: 'Pizza Margherita' },
  });
  const pizzaCalabresa = await prisma.product.findFirst({
    where: { name: 'Pizza Calabresa' },
  });

  const order1 = await prisma.order.create({
    data: {
      userId: cliente1.id,
      restaurantId: pizzaria.id,
      addressId: endereco1.id,
      status: OrderStatus.DELIVERED,
      subtotal: 93.0,
      deliveryFee: 5.0,
      total: 98.0,
      paymentMethod: 'Cartão de Crédito',
      items: {
        create: [
          {
            productId: pizzaMargherita!.id,
            quantity: 1,
            price: 45.0,
            subtotal: 45.0,
          },
          {
            productId: pizzaCalabresa!.id,
            quantity: 1,
            price: 48.0,
            subtotal: 48.0,
          },
        ],
      },
    },
  });

  // Pedido 2 - Em preparo
  const baconBurger = await prisma.product.findFirst({
    where: { name: 'Bacon Burger' },
  });
  const batataFrita = await prisma.product.findFirst({
    where: { name: 'Batata Frita Grande' },
  });

  const order2 = await prisma.order.create({
    data: {
      userId: cliente2.id,
      restaurantId: hamburgueria.id,
      addressId: endereco2.id,
      status: OrderStatus.PREPARING,
      subtotal: 60.0,
      deliveryFee: 6.0,
      total: 66.0,
      paymentMethod: 'Pix',
      items: {
        create: [
          {
            productId: baconBurger!.id,
            quantity: 2,
            price: 32.0,
            subtotal: 64.0,
          },
          {
            productId: batataFrita!.id,
            quantity: 1,
            price: 15.0,
            subtotal: 15.0,
          },
        ],
      },
    },
  });

  console.log('✅ Pedidos criados!');

  // ===== AVALIAÇÕES =====
  console.log('⭐ Criando avaliações...');

  await prisma.review.create({
    data: {
      userId: cliente1.id,
      restaurantId: pizzaria.id,
      orderId: order1.id,
      rating: 5,
      comment: 'Pizza maravilhosa! Massa fininha e ingredientes de qualidade.',
    },
  });

  console.log('✅ Avaliações criadas!');

  console.log('\n✨ Seed concluído com sucesso!\n');
  console.log('📧 Credenciais de teste:');
  console.log('   Admin: admin@uaifood.com / Admin@123');
  console.log('   Cliente: maria@example.com / Maria@123');
  console.log('   Dono: dono.pizzaria@example.com / Pizza@123\n');
}

main()
  .catch((e) => {
    console.error('❌ Erro ao executar seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
