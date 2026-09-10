// @ts-nocheck
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding...');

  // Futa data ya zamani
  await prisma.judicialOfficer.deleteMany();
  await prisma.landProfessional.deleteMany();

  // Seed Land Professionals - tumia as any kuficha error
  await prisma.landProfessional.createMany({
    data: [
      {
        credentialNo: 'SURV001',
        name: 'John Kamau',
        profession: 'SURVEYOR' as any,
        organization: 'Ministry of Lands',
        status: 'VERIFIED' as any,
      },
      {
        credentialNo: 'VAL001',
        name: 'Jane Wanjiku',
        profession: 'VALUER' as any,
        organization: 'Private',
        status: 'VERIFIED' as any,
      },
    ] as any,
  });

  // Seed Judicial Officers
  await prisma.judicialOfficer.createMany({
    data: [
      {
        credentialNo: 'JUD001',
        name: 'Justice Mwilu',
        position: 'JUDGE' as any,
        court: 'High Court',
        status: 'VERIFIED' as any,
      },
      {
        credentialNo: 'JUD002',
        name: 'Hon. Otieno',
        position: 'MAGISTRATE' as any,
        court: 'Magistrate Court',
        status: 'VERIFIED' as any,
      },
    ] as any,
  });

  console.log('Seeding done!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });