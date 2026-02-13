import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  // Create default admin
  const existingAdmin = await prisma.admin.findFirst()
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash("admin123", 12)
    await prisma.admin.create({
      data: {
        username: "admin",
        password: hashedPassword,
      },
    })
    console.log("Admin created: username=admin, password=admin123")
  } else {
    console.log("Admin already exists, skipping.")
  }

  // Create default settings
  const existingSettings = await prisma.settings.findFirst()
  if (!existingSettings) {
    await prisma.settings.create({
      data: {
        submissionsOpen: false,
      },
    })
    console.log("Settings created with submissions closed.")
  } else {
    console.log("Settings already exist, skipping.")
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
