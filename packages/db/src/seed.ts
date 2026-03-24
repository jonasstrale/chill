import { prisma } from './index.js';

async function main() {
  await prisma.ledger.upsert({
    where: { slug: 'personal' },
    update: {},
    create: { name: 'Personal', slug: 'personal' }
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
