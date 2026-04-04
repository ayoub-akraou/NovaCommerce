import 'dotenv/config';
import { readFile } from 'node:fs/promises';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, UserRole } from '@prisma/client';
import slugify from 'slugify';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is required to run the seed script.');
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const DEFAULT_PASSWORD_HASH =
  '$2b$12$3qAzf5aQ53GH3Ik2N08qduLSdA35J5IhXCTITVEWilR92pT9XyM3m';

async function loadCatalogFromFile() {
  const file = new URL('./decathlon-catalog.json', import.meta.url);
  const raw = await readFile(file, 'utf8');
  const catalog = JSON.parse(raw);

  if (!Array.isArray(catalog) || catalog.length !== 5) {
    throw new Error('decathlon-catalog.json must contain exactly 5 categories.');
  }

  const totalProducts = catalog.reduce(
    (sum, category) => sum + category.products.length,
    0,
  );

  if (totalProducts !== 60) {
    throw new Error(
      `decathlon-catalog.json must contain exactly 60 products (found ${totalProducts}).`,
    );
  }

  return catalog;
}

function assertThreeUniqueImagesPerProduct(catalog) {
  for (const category of catalog) {
    for (const product of category.products) {
      if (!Array.isArray(product.images) || product.images.length !== 3) {
        throw new Error(
          `Product "${product.title}" must have exactly 3 images.`,
        );
      }

      if (new Set(product.images).size !== 3) {
        throw new Error(
          `Product "${product.title}" must have 3 unique image URLs.`,
        );
      }
    }
  }
}

async function resetData() {
  await prisma.payment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
}

async function seedUsers() {
  await prisma.user.upsert({
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

  await prisma.user.upsert({
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
}

async function seedCatalog() {
  const catalog = await loadCatalogFromFile();
  assertThreeUniqueImagesPerProduct(catalog);

  const categories = await Promise.all(
    catalog.map((category) =>
      prisma.category.create({
        data: {
          name: category.name,
          slug: category.slug,
        },
      }),
    ),
  );

  const categoryIdBySlug = Object.fromEntries(
    categories.map((category) => [category.slug, category.id]),
  );

  const productData = catalog.flatMap((category) =>
    category.products.map((product) => ({
      categoryId: categoryIdBySlug[category.slug],
      title: product.title,
      slug: slugify(`${category.slug}-${product.title}`, {
        lower: true,
        strict: true,
      }),
      description: product.description,
      price: product.price,
      stock: product.stock,
      images: product.images,
    })),
  );

  await prisma.product.createMany({ data: productData });
}

async function main() {
  await resetData();
  await seedUsers();
  await seedCatalog();
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
