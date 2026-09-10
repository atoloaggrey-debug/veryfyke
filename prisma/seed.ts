import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const professionals = [
    {
      registrationNo: "VK-LND-001",
      name: "John Kamau",
      profession: "SURVEYOR",
      organization: "VeryfyKe Test Surveyors",
      status: "ACTIVE",
    },
    {
      registrationNo: "VK-LND-002",
      name: "Mary Wanjiku",
      profession: "LAND_VALUER",
      organization: "VeryfyKe Test Valuers",
      status: "ACTIVE",
    },
    {
      registrationNo: "VK-LND-003",
      name: "Peter Mwangi",
      profession: "REGISTRAR",
      organization: "VeryfyKe Test Land Registry",
      status: "ACTIVE",
    },
    {
      registrationNo: "VK-LND-004",
      name: "Jane Akinyi",
      profession: "CLERK",
      organization: "VeryfyKe Test Land Registry",
      status: "ACTIVE",
    },
    {
      registrationNo: "VK-LND-005",
      name: "David Otieno",
      profession: "LAND_ADMINISTRATION_OFFICER",
      organization: "VeryfyKe Test Land Administration",
      status: "ACTIVE",
    },
  ];

  for (const professional of professionals) {
    await prisma.landProfessional.upsert({
      where: {
        registrationNo: professional.registrationNo,
      },
      update: professional,
      create: professional,
    });
  }

  const judicialPersonnel = [
    {
      credentialNo: "VK-MAG-001",
      name: "Grace Njeri",
      position: "MAGISTRATE",
      court: "VeryfyKe Test Magistrates Court",
      status: "ACTIVE",
    },
    {
      credentialNo: "VK-JUD-002",
      name: "Samuel Ochieng",
      position: "JUDICIAL_OFFICER",
      court: "VeryfyKe Test High Court",
      status: "ACTIVE",
    },
    {
      credentialNo: "VK-CRT-003",
      name: "Ruth Wambui",
      position: "COURT_PERSONNEL",
      court: "VeryfyKe Test Law Courts",
      status: "ACTIVE",
    },
    {
      credentialNo: "VK-JAD-004",
      name: "Daniel Kiptoo",
      position: "JUDICIAL_ADMINISTRATION_OFFICER",
      court: "VeryfyKe Test Judiciary Administration",
      status: "ACTIVE",
    },
  ];

  for (const personnel of judicialPersonnel) {
    await prisma.judicialPersonnel.upsert({
      where: {
        credentialNo: personnel.credentialNo,
      },
      update: personnel,
      create: personnel,
    });
  }

  console.log("Land professional test data created successfully.");
  console.log("Judicial personnel test data created successfully.");
}

main()
  .catch((error) => {
    console.error("Seed error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });