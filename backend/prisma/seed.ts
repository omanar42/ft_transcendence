// prisma/seed.ts

import { PrismaClient } from '@prisma/client';

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {

	const user1 = await prisma.user.upsert({
		where: { email: 'alice@mail.com' },
		update: {},
		create: {
			username: 'Alice',
			email: 'alice@mail.com',
			password: 'alice',
		}
	});

	const user2 = await prisma.user.upsert({
		where: { email: 'bob@mail.com' },
		update: {},
		create: {
			username: 'Bob',
			email: 'bob@mail.com',
			password: 'bob',
		}
	});

  console.log({ user1, user2 });
}

// execute the main function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close Prisma Client at the end
    await prisma.$disconnect();
  });
