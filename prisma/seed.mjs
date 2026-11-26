import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { randomBytes, scryptSync } from "node:crypto";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const derived = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derived}`;
}

async function main() {
  // 1. Ensure default restaurant settings row exists
  await prisma.restaurantSetting.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      restaurantEmail: "hello@cravora.com",
      restaurantPhone: "+91 98765 43210",
      restaurantAddress: "42 Spice Courtyard, Bengaluru",
      lunchStart: "12:00",
      lunchEnd: "15:00",
      dinnerStart: "19:00",
      dinnerEnd: "22:00",
      acceptOnlineOrders: true,
      acceptDiningReservations: true,
    },
  });

  // 2. Ensure default operations admin user exists
  const username = process.env.OPS_ADMIN_USERNAME || "admin";
  const email = process.env.OPS_ADMIN_EMAIL || "admin@cravora.com";
  const password = process.env.OPS_ADMIN_PASSWORD || "CravoraAdmin123!";

  await prisma.staffUser.upsert({
    where: { username },
    update: {},
    create: {
      username,
      email,
      name: "Administrator",
      role: "admin",
      passwordHash: hashPassword(password),
      isActive: true,
    },
  });

  // 3. Seed menu items from import-menu.sql if menu_items is empty
  const existingMenuCount = await prisma.menuItem.count();
  const sqlPath = join(process.cwd(), "import-menu.sql");

  if (existingMenuCount === 0 && existsSync(sqlPath)) {
    const rawSql = readFileSync(sqlPath, "utf8");
    const statements = rawSql
      .split(/;\s*\r?\n/)
      .map((s) => s.trim())
      .filter((s) => s && !/^BEGIN$/i.test(s) && !/^COMMIT$/i.test(s));

    for (const stmt of statements) {
      await prisma.$executeRawUnsafe(stmt);
    }
    console.log("Seeded menu catalog from import-menu.sql.");
  }

  console.log("Cravora database seed completed.");
}

main()
  .catch((error) => {
    console.error("Seed error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
