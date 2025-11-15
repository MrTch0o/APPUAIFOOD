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
  if (process.env.NODE_ENV === 'development' || process.env.PRISMA_RESET) {
    console.log('🗑️  Limpando banco de dados...');
    try {
      await prisma.review.deleteMany();
      await prisma.orderItem.deleteMany();
      await prisma.cartItem.deleteMany();
      await prisma.order.deleteMany();
      await prisma.address.deleteMany();
      await prisma.product.deleteMany();
      await prisma.restaurant.deleteMany();
      await prisma.user.deleteMany();
      await prisma.productCategory.deleteMany();
      await prisma.restaurantCategory.deleteMany();
    } catch (e) {
      console.log('ℹ️  Tabelas ainda não existem ou já estão vazias');
    }
  }

  // ===== CATEGORIAS DE RESTAURANTE =====
  console.log('📂 Criando categorias de restaurante...');

  const categoryPizzaria = await prisma.restaurantCategory.create({
    data: {
      name: 'Pizzaria',
      description: 'Restaurantes especializados em pizzas',
      icon: 'local_pizza',
      isActive: true,
    },
  });

  const categoryHamburgueria = await prisma.restaurantCategory.create({
    data: {
      name: 'Hamburgueria',
      description: 'Restaurantes especializados em hambúrgueres',
      icon: 'lunch_dining',
      isActive: true,
    },
  });

  const categoryJaponesa = await prisma.restaurantCategory.create({
    data: {
      name: 'Japonesa',
      description: 'Culinária japonesa - sushi, sashimi, temaki',
      icon: 'restaurant',
      isActive: true,
    },
  });

  const categoryMarmitas = await prisma.restaurantCategory.create({
    data: {
      name: 'Marmitas',
      description: 'Marmitas prontas e saudáveis',
      icon: 'fastfood',
      isActive: true,
    },
  });

  const categoryBrasileira = await prisma.restaurantCategory.create({
    data: {
      name: 'Brasileira',
      description: 'Comida brasileira tradicional',
      icon: 'restaurant',
      isActive: true,
    },
  });

  const categorySobremesas = await prisma.restaurantCategory.create({
    data: {
      name: 'Sobremesas',
      description: 'Sobremesas e doces',
      icon: 'cake',
      isActive: true,
    },
  });

  console.log('✅ Categorias de restaurante criadas!');

  // ===== CATEGORIAS DE PRODUTO =====
  console.log('📂 Criando categorias de produto...');

  const productCategoryPizzas = await prisma.productCategory.create({
    data: {
      name: 'Pizzas Tradicionais',
      description: 'Pizzas clássicas',
      isActive: true,
    },
  });

  const productCategoryBebidas = await prisma.productCategory.create({
    data: {
      name: 'Bebidas',
      description: 'Bebidas diversas',
      isActive: true,
    },
  });

  const productCategoryHamburgueres = await prisma.productCategory.create({
    data: {
      name: 'Hambúrgueres',
      description: 'Hambúrgueres artesanais',
      isActive: true,
    },
  });

  const productCategoryAcompanhamentos = await prisma.productCategory.create({
    data: {
      name: 'Acompanhamentos',
      description: 'Acompanhamentos e extras',
      isActive: true,
    },
  });

  const productCategoryComboJapones = await prisma.productCategory.create({
    data: {
      name: 'Combinados',
      description: 'Combos de sushi e sashimi',
      isActive: true,
    },
  });

  const productCategoryHotRolls = await prisma.productCategory.create({
    data: {
      name: 'Hot Rolls',
      description: 'Hot rolls quentes',
      isActive: true,
    },
  });

  const productCategorySashimi = await prisma.productCategory.create({
    data: {
      name: 'Sashimi',
      description: 'Sashimi fresco',
      isActive: true,
    },
  });

  const productCategoryTemaki = await prisma.productCategory.create({
    data: {
      name: 'Temaki',
      description: 'Temaki hand roll',
      isActive: true,
    },
  });

  const productCategoryMarmitas = await prisma.productCategory.create({
    data: {
      name: 'Marmitas',
      description: 'Marmitas diversas',
      isActive: true,
    },
  });

  const productCategoryPratosPrincipais = await prisma.productCategory.create({
    data: {
      name: 'Pratos Principais',
      description: 'Pratos principais brasileiros',
      isActive: true,
    },
  });

  const productCategoryEntradas = await prisma.productCategory.create({
    data: {
      name: 'Entradas',
      description: 'Entradas e petiscos',
      isActive: true,
    },
  });

  console.log('✅ Categorias de produto criadas!');

  const admin = await prisma.user.create({
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

  const restaurantOwner3 = await prisma.user.create({
    data: {
      email: 'dono.japones@example.com',
      password: await hashPassword('Japones@123'),
      name: 'Yuki Tanaka',
      phone: '31933333333',
      role: UserRole.RESTAURANT_OWNER,
    },
  });

  const restaurantOwner4 = await prisma.user.create({
    data: {
      email: 'dono.marmitas@example.com',
      password: await hashPassword('Marmita@123'),
      name: 'Ana Fitness',
      phone: '31944444444',
      role: UserRole.RESTAURANT_OWNER,
    },
  });

  const restaurantOwner5 = await prisma.user.create({
    data: {
      email: 'dono.brasileira@example.com',
      password: await hashPassword('Brasil@123'),
      name: 'Jorge Mineiro',
      phone: '31955555555',
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

  await prisma.address.create({
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
      restaurantCategoryId: categoryPizzaria.id,
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
      restaurantCategoryId: categoryHamburgueria.id,
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
      restaurantCategoryId: categoryJaponesa.id,
      rating: 4.9,
      deliveryTime: '40-60 min',
      deliveryFee: 8.0,
      minimumOrder: 30.0,
      ownerId: restaurantOwner3.id,
      address: 'Rua Espírito Santo, 200 - Centro, Belo Horizonte - MG',
      phone: '31355555555',
      openingHours: {
        seg: '11:00-15:00, 18:00-23:00',
        ter: '11:00-15:00, 18:00-23:00',
        qua: '11:00-15:00, 18:00-23:00',
        qui: '11:00-15:00, 18:00-23:00',
        sex: '11:00-15:00, 18:00-00:00',
        sab: '12:00-00:00',
        dom: '12:00-23:00',
      },
    },
  });

  const marmitas = await prisma.restaurant.create({
    data: {
      name: 'Fit Marmitas',
      description: 'Marmitas saudáveis e nutritivas',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd',
      restaurantCategoryId: categoryMarmitas.id,
      rating: 4.7,
      deliveryTime: '20-30 min',
      deliveryFee: 4.0,
      minimumOrder: 15.0,
      ownerId: restaurantOwner4.id,
      address: 'Av. Getúlio Vargas, 300 - Funcionários, Belo Horizonte - MG',
      phone: '31366666666',
      openingHours: {
        seg: '11:00-20:00',
        ter: '11:00-20:00',
        qua: '11:00-20:00',
        qui: '11:00-20:00',
        sex: '11:00-20:00',
        sab: '11:00-18:00',
        dom: '11:00-18:00',
      },
    },
  });

  const brasileira = await prisma.restaurant.create({
    data: {
      name: 'Casa do Mineiro',
      description: 'Comida mineira de avó',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
      restaurantCategoryId: categoryBrasileira.id,
      rating: 4.5,
      deliveryTime: '35-50 min',
      deliveryFee: 5.5,
      minimumOrder: 22.0,
      ownerId: restaurantOwner5.id,
      address: 'Rua Santa Catarina, 150 - Centro, Belo Horizonte - MG',
      phone: '31377777777',
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

  console.log('✅ Restaurantes criados!');

  // ===== PRODUTOS =====
  console.log('🍕 Criando produtos...');

  // Produtos da Pizzaria
  await prisma.product.createMany({
    data: [
      {
        name: 'Pizza Margherita',
        description: 'Molho de tomate, mussarela, manjericão e azeite',
        price: 35.0,
        productCategoryId: productCategoryPizzas.id,
        restaurantId: pizzaria.id,
        available: true,
      },
      {
        name: 'Pizza Calabresa',
        description: 'Molho de tomate, mussarela, calabresa e cebola',
        price: 38.0,
        productCategoryId: productCategoryPizzas.id,
        restaurantId: pizzaria.id,
        available: true,
      },
      {
        name: 'Pizza Quatro Queijos',
        description: 'Mussarela, gorgonzola, parmesão e brie',
        price: 42.0,
        productCategoryId: productCategoryPizzas.id,
        restaurantId: pizzaria.id,
        available: true,
      },
      {
        name: 'Pizza Pepperoni',
        description: 'Molho de tomate, pepperoni e mussarela',
        price: 39.0,
        productCategoryId: productCategoryPizzas.id,
        restaurantId: pizzaria.id,
        available: true,
      },
      {
        name: 'Pizza Portuguesa',
        description: 'Ovos, presunto, cebola, azeitona e mussarela',
        price: 40.0,
        productCategoryId: productCategoryPizzas.id,
        restaurantId: pizzaria.id,
        available: true,
      },
      {
        name: 'Refrigerante 2L',
        description: 'Coca-Cola, Guaraná ou Sprite',
        price: 8.0,
        productCategoryId: productCategoryBebidas.id,
        restaurantId: pizzaria.id,
        available: true,
      },
    ],
  });

  // Produtos da Hamburgueria
  await prisma.product.createMany({
    data: [
      {
        name: 'X-Burguer',
        description: 'Pão, hambúrguer, queijo e molho especial',
        price: 18.0,
        productCategoryId: productCategoryHamburgueres.id,
        restaurantId: hamburgueria.id,
        available: true,
      },
      {
        name: 'X-Tudo',
        description: 'Pão, hambúrguer, queijo, bacon, alface, tomate e molho',
        price: 22.0,
        productCategoryId: productCategoryHamburgueres.id,
        restaurantId: hamburgueria.id,
        available: true,
      },
      {
        name: 'X-Bacon',
        description: 'Pão, hambúrguer, queijo, bacon e molho especial',
        price: 20.0,
        productCategoryId: productCategoryHamburgueres.id,
        restaurantId: hamburgueria.id,
        available: true,
      },
      {
        name: 'Double Burguer',
        description: 'Pão, 2 hambúrgueres, 2 queijos e molho especial',
        price: 28.0,
        productCategoryId: productCategoryHamburgueres.id,
        restaurantId: hamburgueria.id,
        available: true,
      },
      {
        name: 'Batata Frita',
        description: 'Porção grande de batata frita',
        price: 12.0,
        productCategoryId: productCategoryAcompanhamentos.id,
        restaurantId: hamburgueria.id,
        available: true,
      },
      {
        name: 'Onion Rings',
        description: 'Cebola empanada crocante',
        price: 13.0,
        productCategoryId: productCategoryAcompanhamentos.id,
        restaurantId: hamburgueria.id,
        available: true,
      },
      {
        name: 'Refrigerante Lata',
        description: 'Coca-Cola, Guaraná ou Sprite lata',
        price: 5.0,
        productCategoryId: productCategoryBebidas.id,
        restaurantId: hamburgueria.id,
        available: true,
      },
    ],
  });

  // Produtos do Sushi Zen
  await prisma.product.createMany({
    data: [
      {
        name: 'Combo Sushi',
        description: '30 peças de sushi variado',
        price: 89.0,
        productCategoryId: productCategoryComboJapones.id,
        restaurantId: japonesa.id,
        available: true,
      },
      {
        name: 'Hot Roll',
        description: 'Arroz, salmão grelhado, cream cheese e maionese',
        price: 26.0,
        productCategoryId: productCategoryHotRolls.id,
        restaurantId: japonesa.id,
        available: true,
      },
      {
        name: 'Sashimi Salmão',
        description: '8 fatias de salmão fresco',
        price: 45.0,
        productCategoryId: productCategorySashimi.id,
        restaurantId: japonesa.id,
        available: true,
      },
      {
        name: 'Temaki Salmão',
        description: 'Alga nori enrolada com salmão, cream cheese e abacate',
        price: 22.0,
        productCategoryId: productCategoryTemaki.id,
        restaurantId: japonesa.id,
        available: true,
      },
      {
        name: 'Temaki Atum',
        description: 'Alga nori enrolada com atum, cream cheese e pepino',
        price: 21.0,
        productCategoryId: productCategoryTemaki.id,
        restaurantId: japonesa.id,
        available: true,
      },
    ],
  });

  // Produtos da Fit Marmitas
  await prisma.product.createMany({
    data: [
      {
        name: 'Marmita Frango com Batata Doce',
        description: 'Frango grelhado, batata doce e brócolis',
        price: 22.0,
        productCategoryId: productCategoryMarmitas.id,
        restaurantId: marmitas.id,
        available: true,
      },
      {
        name: 'Marmita Peixe com Legumes',
        description: 'Filé de peixe, cenoura, abóbora e arroz integral',
        price: 25.0,
        productCategoryId: productCategoryMarmitas.id,
        restaurantId: marmitas.id,
        available: true,
      },
      {
        name: 'Marmita Bife com Abóbora',
        description: 'Bife magro, abóbora, brocólis e arroz',
        price: 24.0,
        productCategoryId: productCategoryMarmitas.id,
        restaurantId: marmitas.id,
        available: true,
      },
      {
        name: 'Marmita Vegetariana',
        description: 'Arroz integral, feijão, cenoura, abóbora e salada',
        price: 18.0,
        productCategoryId: productCategoryMarmitas.id,
        restaurantId: marmitas.id,
        available: true,
      },
    ],
  });

  // Produtos da Casa do Mineiro
  await prisma.product.createMany({
    data: [
      {
        name: 'Frango com Quiabo',
        description: 'Frango caipira cozido com quiabo',
        price: 35.0,
        productCategoryId: productCategoryPratosPrincipais.id,
        restaurantId: brasileira.id,
        available: true,
      },
      {
        name: 'Feijoada Completa',
        description: 'Feijoada com farofa, couve e linguiça',
        price: 42.0,
        productCategoryId: productCategoryPratosPrincipais.id,
        restaurantId: brasileira.id,
        available: true,
      },
      {
        name: 'Caldo de Cana',
        description: 'Caldo de cana fresco',
        price: 6.0,
        productCategoryId: productCategoryBebidas.id,
        restaurantId: brasileira.id,
        available: true,
      },
      {
        name: 'Pão de Queijo',
        description: 'Pão de queijo caseiro',
        price: 8.0,
        productCategoryId: productCategoryEntradas.id,
        restaurantId: brasileira.id,
        available: true,
      },
      {
        name: 'Pamonha',
        description: 'Pamonha doce caseira',
        price: 5.0,
        productCategoryId: productCategoryEntradas.id,
        restaurantId: brasileira.id,
        available: true,
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
      subtotal: 73.0,
      deliveryFee: 5.0,
      total: 78.0,
      paymentMethod: 'Cartão de Crédito',
      items: {
        create: [
          {
            productId: pizzaMargherita!.id,
            quantity: 1,
            price: 35.0,
            subtotal: 35.0,
          },
          {
            productId: pizzaCalabresa!.id,
            quantity: 1,
            price: 38.0,
            subtotal: 38.0,
          },
        ],
      },
    },
  });

  // Pedido 2 - Em preparo
  const xTudo = await prisma.product.findFirst({
    where: { name: 'X-Tudo' },
  });
  const batataFrita = await prisma.product.findFirst({
    where: { name: 'Batata Frita' },
  });

  const order2 = await prisma.order.create({
    data: {
      userId: cliente2.id,
      restaurantId: hamburgueria.id,
      addressId: endereco2.id,
      status: OrderStatus.PREPARING,
      subtotal: 50.0,
      deliveryFee: 6.0,
      total: 56.0,
      paymentMethod: 'Pix',
      items: {
        create: [
          {
            productId: xTudo!.id,
            quantity: 2,
            price: 22.0,
            subtotal: 44.0,
          },
          {
            productId: batataFrita!.id,
            quantity: 1,
            price: 12.0,
            subtotal: 12.0,
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
      comment: 'Excelente pizza! Chegou quente e saborosa.',
    },
  });

  await prisma.review.create({
    data: {
      userId: cliente2.id,
      restaurantId: hamburgueria.id,
      orderId: order2.id,
      rating: 4,
      comment: 'Muito bom! Hambúrguer suculento. Entrega rápida.',
    },
  });

  console.log('✅ Avaliações criadas!');

  console.log('\n✨ Seed concluído com sucesso!\n');
  console.log('📧 Credenciais de teste:');
  console.log('   Admin: admin@uaifood.com / Admin@123');
  console.log('   Cliente: maria@example.com / Maria@123');
  console.log('   Dono Pizzaria: dono.pizzaria@example.com / Pizza@123');
  console.log('   Dono Burger: dono.burger@example.com / Burger@123');
  console.log('   Dono Japonês: dono.japones@example.com / Japones@123');
  console.log('   Dono Marmitas: dono.marmitas@example.com / Marmita@123');
  console.log('   Dono Brasileira: dono.brasileira@example.com / Brasil@123\n');
}

main()
  .catch((e) => {
    console.error('❌ Erro ao executar seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
