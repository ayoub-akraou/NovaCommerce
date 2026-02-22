import {
  OrderStatus,
  PaymentProvider,
  PaymentStatus,
  PrismaClient,
  UserRole,
} from '@prisma/client';

const prisma = new PrismaClient();

const DEFAULT_PASSWORD_HASH =
  '$2b$12$3qAzf5aQ53GH3Ik2N08qduLSdA35J5IhXCTITVEWilR92pT9XyM3m';

async function seedUsers() {
  const admin = await prisma.user.upsert({
    where: { email: 'admin@novacommerce.local' },
    update: {
      name: 'Nova Admin',
      role: UserRole.ADMIN,
    },
    create: {
      name: 'Nova Admin',
      email: 'admin@novacommerce.local',
      passwordHash: DEFAULT_PASSWORD_HASH,
      role: UserRole.ADMIN,
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: 'customer@novacommerce.local' },
    update: {
      name: 'Nova Customer',
      role: UserRole.CUSTOMER,
    },
    create: {
      name: 'Nova Customer',
      email: 'customer@novacommerce.local',
      passwordHash: DEFAULT_PASSWORD_HASH,
      role: UserRole.CUSTOMER,
    },
  });

  return { admin, customer };
}

async function seedCatalog() {
  const electronics = await prisma.category.upsert({
    where: { slug: 'electronics' },
    update: { name: 'Electronics' },
    create: {
      name: 'Electronics',
      slug: 'electronics',
    },
  });

  const fashion = await prisma.category.upsert({
    where: { slug: 'fashion' },
    update: { name: 'Fashion' },
    create: {
      name: 'Fashion',
      slug: 'fashion',
    },
  });

  await prisma.product.upsert({
    where: { slug: 'nova-wireless-headphones' },
    update: {
      title: 'Nova Wireless Headphones',
      description: 'Bluetooth headphones with 30h battery life.',
      price: '79.90',
      stock: 42,
      images: [
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
        'https://images.unsplash.com/photo-1583394838336-acd977736f90',
      ],
      categoryId: electronics.id,
    },
    create: {
      title: 'Nova Wireless Headphones',
      slug: 'nova-wireless-headphones',
      description: 'Bluetooth headphones with 30h battery life.',
      price: '79.90',
      stock: 42,
      images: [
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
        'https://images.unsplash.com/photo-1583394838336-acd977736f90',
      ],
      categoryId: electronics.id,
    },
  });

  await prisma.product.upsert({
    where: { slug: 'nova-essential-hoodie' },
    update: {
      title: 'Nova Essential Hoodie',
      description: 'Premium cotton hoodie for everyday comfort.',
      price: '49.00',
      stock: 58,
      images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab'],
      categoryId: fashion.id,
    },
    create: {
      title: 'Nova Essential Hoodie',
      slug: 'nova-essential-hoodie',
      description: 'Premium cotton hoodie for everyday comfort.',
      price: '49.00',
      stock: 58,
      images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab'],
      categoryId: fashion.id,
    },
  });
}

async function seedCartAndOrder(customerId) {
  await prisma.payment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();

  const featuredProduct = await prisma.product.findUnique({
    where: { slug: 'nova-wireless-headphones' },
    select: {
      id: true,
      price: true,
    },
  });

  if (!featuredProduct) {
    throw new Error('Expected featured product to exist after catalog seeding.');
  }

  await prisma.cart.create({
    data: {
      userId: customerId,
      items: {
        create: {
          productId: featuredProduct.id,
          quantity: 1,
        },
      },
    },
  });

  const order = await prisma.order.create({
    data: {
      userId: customerId,
      total: '85.90',
      status: OrderStatus.PENDING,
      address: '123 Demo Street, Casablanca, MA',
      items: {
        create: {
          productId: featuredProduct.id,
          quantity: 1,
          priceAtPurchase: featuredProduct.price,
        },
      },
    },
    select: { id: true },
  });

  await prisma.payment.create({
    data: {
      orderId: order.id,
      amount: '85.90',
      provider: PaymentProvider.MOCK,
      status: PaymentStatus.PENDING,
      transactionId: 'seed-mock-payment-ref',
    },
  });
}

async function main() {
  const { customer } = await seedUsers();
  await seedCatalog();
  await seedCartAndOrder(customer.id);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
