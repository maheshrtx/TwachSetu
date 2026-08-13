import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Demo accounts (passwords are plain here for seed only; in real app hash them)
  const bcrypt = require("bcrypt");
  const pw = await bcrypt.hash("demo1234", 10);

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@twacha.local" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@twacha.local",
      passwordHash: pw,
      role: "ADMIN",
    },
  });

  const doctorUser = await prisma.user.upsert({
    where: { email: "doctor@twacha.local" },
    update: {},
    create: {
      name: "Demo Doctor",
      email: "doctor@twacha.local",
      passwordHash: pw,
      role: "DOCTOR",
    },
  });

  await prisma.doctorProfile.upsert({
    where: { userId: doctorUser.id },
    update: {},
    create: {
      userId: doctorUser.id,
      qualification: "MBBS, Dermatology (demo)",
      registrationNumber: "TS-DR-0001",
      specialization: "General Dermatology",
      verificationStatus: "VERIFIED",
    },
  });

  const patientUser = await prisma.user.upsert({
    where: { email: "patient@twacha.local" },
    update: {},
    create: {
      name: "Demo Patient",
      email: "patient@twacha.local",
      passwordHash: pw,
      role: "PATIENT",
    },
  });

  await prisma.patientProfile.upsert({
    where: { userId: patientUser.id },
    update: {},
    create: {
      userId: patientUser.id,
      dateOfBirth: new Date("1990-01-01"),
      gender: "female",
    },
  });

  console.log("Seed complete. Demo credentials (email/password):");
  console.log("admin@twacha.local / demo1234");
  console.log("doctor@twacha.local / demo1234");
  console.log("patient@twacha.local / demo1234");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
