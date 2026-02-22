import {
  CartStatus,
  OrderStatus,
  PaymentProvider,
  PaymentStatus,
  PrismaClient,
  UserRole,
} from '@prisma/client';

const prisma = new PrismaClient();

const DEFAULT_PASSWORD_HASH =
  '$2b$12$3qAzf5aQ53GH3Ik2N08qduLSdA35J5IhXCTITVEWilR92pT9XyM3m';

const categoriesSeed = [
  {
    slug: 'electronics',
    name: 'Electronics',
    description: 'Devices, accessories, and smart home products.',
  },
  {
    slug: 'fashion',
    name: 'Fashion',
    description: 'Daily wear and seasonal collections.',
  },
  {
    slug: 'home',
    name: 'Home',
    description: 'Decor, comfort, and household essentials.',
  },
];

const tagsSeed = [
  { slug: 'new', name: 'new' },
  { slug: 'popular', name: 'popular' },
  { slug: 'gift', name: 'gift' },
];

const productsSeed = [
  {
    slug: 'nova-wireless-headphones',
    title: 'Nova Wireless Headphones',
    description: 'Bluetooth headphones with 30h battery life.',
    categorySlug: 'electronics',
    price: '79.90',
    compareAtPrice: '99.90',
    stock: 42,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90',
    ],
    tagSlugs: ['new', 'popular'],
  },
  {
    slug: 'nova-essential-hoodie',
    title: 'Nova Essential Hoodie',
    description: 'Premium cotton hoodie for everyday comfort.',
    categorySlug: 'fashion',
    price: '49.00',
    compareAtPrice: null,
    stock: 58,
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab',
      'https://images.unsplash.com/photo-1571945153237-4929e783af4a',
    ],
    tagSlugs: ['popular'],
  },
  {
    slug: 'nova-ceramic-lamp',
    title: 'Nova Ceramic Lamp',
    description: 'Minimal ceramic lamp for desk or bedside.',
    categorySlug: 'home',
    price: '34.50',
    compareAtPrice: null,
    stock: 27,
    images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c'],
    tagSlugs: ['gift'],
  },
];

async function seedUsers() {
  const admin = await prisma.user.upsert({
    where: { email: 'admin@novacommerce.local' },
    update: {
      firstName: 'Nova',
      lastName: 'Admin',
      role: UserRole.ADMIN,
      isActive: true,
    },
    create: {
      email: 'admin@novacommerce.local',
      firstName: 'Nova',
      lastName: 'Admin',
      passwordHash: DEFAULT_PASSWORD_HASH,
      role: UserRole.ADMIN,
      isActive: true,
    },
  });

  const manager = await prisma.user.upsert({
    where: { email: 'manager@novacommerce.local' },
    update: {
      firstName: 'Nova',
      lastName: 'Manager',
      role: UserRole.MANAGER,
      isActive: true,
    },
    create: {
      email: 'manager@novacommerce.local',
      firstName: 'Nova',
      lastName: 'Manager',
      passwordHash: DEFAULT_PASSWORD_HASH,
      role: UserRole.MANAGER,
      isActive: true,
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: 'customer@novacommerce.local' },
    update: {
      firstName: 'Nova',
      lastName: 'Customer',
      role: UserRole.CUSTOMER,
      isActive: true,
    },
    create: {
      email: 'customer@novacommerce.local',
      firstName: 'Nova',
      lastName: 'Customer',
      passwordHash: DEFAULT_PASSWORD_HASH,
      role: UserRole.CUSTOMER,
      isActive: true,
    },
  });

  return { admin, manager, customer };
}

async function seedCatalog() {
  const categoriesBySlug = {};
  for (const category of categoriesSeed) {
    const savedCategory = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        description: category.description,
      },
      create: category,
    });
    categoriesBySlug[savedCategory.slug] = savedCategory;
  }

  const tagsBySlug = {};
  for (const tag of tagsSeed) {
    const savedTag = await prisma.tag.upsert({
      where: { slug: tag.slug },
      update: { name: tag.name },
      create: tag,
    });
    tagsBySlug[savedTag.slug] = savedTag;
  }

  for (const product of productsSeed) {
    const category = categoriesBySlug[product.categorySlug];
    if (!category) {
      throw new Error(`Category not found for slug: ${product.categorySlug}`);
    }

    const imageRows = product.images.map((url, index) => ({
      url,
      alt: `${product.title} image ${index + 1}`,
      position: index,
    }));

    const productTagRows = product.tagSlugs.map((tagSlug) => {
      const tag = tagsBySlug[tagSlug];
      if (!tag) {
        throw new Error(`Tag not found for slug: ${tagSlug}`);
      }

      return { tagId: tag.id };
    });

    const existing = await prisma.product.findUnique({
      where: { slug: product.slug },
      select: { id: true },
    });

    if (existing) {
      await prisma.product.update({
        where: { slug: product.slug },
        data: {
          categoryId: category.id,
          title: product.title,
          description: product.description,
          price: product.price,
          compareAtPrice: product.compareAtPrice,
          stock: product.stock,
          isActive: true,
          images: {
            deleteMany: {},
            create: imageRows,
          },
          tags: {
            deleteMany: {},
            create: productTagRows,
          },
        },
      });
    } else {
      await prisma.product.create({
        data: {
          categoryId: category.id,
          title: product.title,
          slug: product.slug,
          description: product.description,
          price: product.price,
          compareAtPrice: product.compareAtPrice,
          stock: product.stock,
          isActive: true,
          images: {
            create: imageRows,
          },
          tags: {
            create: productTagRows,
          },
        },
      });
    }
  }
}

async function seedCommerceData(customerId) {
  await prisma.payment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();

  const customerAddressInput = {
    label: 'seed-home',
    fullName: 'Nova Customer',
    phone: '+212600000000',
    line1: '123 Demo Street',
    line2: null,
    city: 'Casablanca',
    state: null,
    postalCode: '20000',
    country: 'MA',
    isDefault: true,
  };

  const existingAddress = await prisma.address.findFirst({
    where: { userId: customerId, label: customerAddressInput.label },
    select: { id: true },
  });

  let customerAddressId;
  if (existingAddress) {
    const updatedAddress = await prisma.address.update({
      where: { id: existingAddress.id },
      data: customerAddressInput,
      select: { id: true },
    });
    customerAddressId = updatedAddress.id;
  } else {
    const createdAddress = await prisma.address.create({
      data: {
        userId: customerId,
        ...customerAddressInput,
      },
      select: { id: true },
    });
    customerAddressId = createdAddress.id;
  }

  const featuredProduct = await prisma.product.findUnique({
    where: { slug: 'nova-wireless-headphones' },
    select: {
      id: true,
      title: true,
      slug: true,
      price: true,
    },
  });

  if (!featuredProduct) {
    throw new Error('Expected featured product to exist after catalog seeding.');
  }

  await prisma.cart.create({
    data: {
      userId: customerId,
      status: CartStatus.ACTIVE,
      items: {
        create: {
          productId: featuredProduct.id,
          quantity: 1,
          unitPrice: featuredProduct.price,
        },
      },
    },
  });

  const order = await prisma.order.create({
    data: {
      userId: customerId,
      status: OrderStatus.PENDING,
      subtotal: featuredProduct.price,
      shippingFee: '6.00',
      taxTotal: '0.00',
      discountTotal: '0.00',
      total: '85.90',
      currency: 'EUR',
      shippingAddressId: customerAddressId,
      billingAddressId: customerAddressId,
      items: {
        create: {
          productId: featuredProduct.id,
          quantity: 1,
          unitPrice: featuredProduct.price,
          priceAtPurchase: featuredProduct.price,
          titleSnapshot: featuredProduct.title,
          slugSnapshot: featuredProduct.slug,
        },
      },
    },
    select: { id: true },
  });

  await prisma.payment.create({
    data: {
      orderId: order.id,
      provider: PaymentProvider.MOCK,
      status: PaymentStatus.PENDING,
      amount: '85.90',
      currency: 'EUR',
      providerRef: 'seed-mock-payment-ref',
    },
  });
}

async function main() {
  const { customer } = await seedUsers();
  await seedCatalog();
  await seedCommerceData(customer.id);
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
