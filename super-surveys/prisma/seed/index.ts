import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await hash("admin123", 10);
  const user = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: { email: "admin@example.com", name: "Admin", passwordHash, role: "admin", points: 500 },
  });

  await prisma.achievement.upsert({
    where: { code: "first_withdrawal" },
    update: {},
    create: {
      code: "first_withdrawal",
      title: "Primeiro Saque",
      description: "Conclua seu primeiro saque Pix",
      pointsReward: 50,
    },
  });

  console.log("Seeded:", { user: user.email });
}

main().finally(async () => {
  await prisma.$disconnect();
});
