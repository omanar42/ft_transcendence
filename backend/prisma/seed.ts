// prisma/seed.ts

import { PrismaClient } from '@prisma/client';

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {

	const user1 = await prisma.user.upsert({
		where: { username: 'omanar' },
		update: {},
		create: {
			// id: faker.datatype.uuid(),
			oauthId: 'hj4gjh123g5hgk2315jg',
			username: 'omanar',
			password: '123456',
			// avatar: faker.image.avatar(),
			twoFactor: false,
			status: 'ACTIVE',
			wins: 0,
			losses: 0,
			// friends: [],
			// friendOf: [],
			// matches: [],
		}
	});

	const user2 = await prisma.user.upsert({
		where: { username: 'omanar2' },
		update: {},
		create: {
			// id: faker.datatype.uuid(),
			oauthId: 'jk5g1jh2g35jhg1kj5g115hkg',
			username: 'omanar2',
			password: '123456',
			// avatar: faker.image.avatar(),
			twoFactor: false,
			status: 'ACTIVE',
			wins: 0,
			losses: 0,
			// friends: [],
			// friendOf: [],
			// matches: [],
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
