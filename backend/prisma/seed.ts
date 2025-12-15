import { PrismaClient, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const cafe = await prisma.cafe.create({
    data: {
      name: "Demo Cafe",
      slug: "demo-cafe",
      startParam: "demo",
      botUsername: "demo_bot",
      settings: {
        create: {
          language: "ua",
          currency: "UAH",
          themeMode: "LIGHT",
        },
      },
    },
  });

  const owner = await prisma.user.create({
    data: {
      name: "Cafe Owner",
      telegramId: BigInt(123456789),
    },
  });

  await prisma.cafeUser.create({
    data: {
      cafeId: cafe.id,
      userId: owner.id,
      role: UserRole.OWNER,
    },
  });

  console.log("✅ Seed completed");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
