import { PrismaClient } from '@/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

const decks = [
  {
    name: 'Fibonacci',
    cards: [
      '0',
      '1',
      '2',
      '3',
      '5',
      '8',
      '13',
      '21',
      '34',
      '55',
      '89',
      '?',
      '☕',
    ],
  },
  {
    name: 'Fibonacci Flat',
    cards: [
      '0',
      '0.5',
      '1',
      '2',
      '3',
      '5',
      '8',
      '13',
      '20',
      '40',
      '100',
      '?',
      '☕',
    ],
  },
  {
    name: 'T-Shirt Sizes',
    cards: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '?', '☕'],
  },
  {
    name: 'Powers of 2',
    cards: ['0', '1', '2', '4', '8', '16', '32', '64', '?', '☕'],
  },
  {
    name: 'Hours',
    cards: ['2', '4', '8', '16', '24', '?', '☕'],
  },
];

async function main() {
  console.log('🌱 Seeding decks...\n');

  for (const deck of decks) {
    const result = await prisma.deck.upsert({
      where: { name: deck.name },
      update: { cards: deck.cards },
      create: { name: deck.name, cards: deck.cards },
    });

    console.log(`  ✓ ${result.name} (${result.cards.length} cards)`);
  }

  console.log('\n✅ Seeding complete.');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
