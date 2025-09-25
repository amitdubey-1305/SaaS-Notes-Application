const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');

  // --- Create Tenants ---
  const acmeTenant = await prisma.tenant.create({
    data: {
      name: 'Acme',
      slug: 'acme',
    },
  });

  const globexTenant = await prisma.tenant.create({
    data: {
      name: 'Globex',
      slug: 'globex',
    },
  });

  console.log('Created tenants:', acmeTenant, globexTenant);

  // --- Hash the common password ---
  const password = 'password';
  const hashedPassword = await bcrypt.hash(password, 10);

  // --- Create Users ---
  const users = [
    // Acme Users
    {
      email: 'admin@acme.test',
      password: hashedPassword,
      role: 'ADMIN',
      tenantId: acmeTenant.id,
    },
    {
      email: 'user@acme.test',
      password: hashedPassword,
      role: 'MEMBER',
      tenantId: acmeTenant.id,
    },
    // Globex Users
    {
      email: 'admin@globex.test',
      password: hashedPassword,
      role: 'ADMIN',
      tenantId: globexTenant.id,
    },
    {
      email: 'user@globex.test',
      password: hashedPassword,
      role: 'MEMBER',
      tenantId: globexTenant.id,
    },
  ];

  for (const user of users) {
    await prisma.user.create({
      data: user,
    });
  }

  console.log(`Created ${users.length} users.`);

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });