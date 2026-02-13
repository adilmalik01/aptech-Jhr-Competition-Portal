import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST() {
  try {
    const existingAdmin = await prisma.admin.findFirst()
    if (existingAdmin) {
      return NextResponse.json({ message: "Admin already exists" })
    }
    const hashedPassword = await bcrypt.hash("123456", 10)
    await prisma.admin.create({
      data: { username: "admin", password: hashedPassword },
    })
    const existingSettings = await prisma.settings.findFirst()
    if (!existingSettings) {
      await prisma.settings.create({
        data: { submissionsOpen: false },
      })
    }
    return NextResponse.json({ message: "Admin seeded successfully. Username: admin, Password: admin123" })
  } catch (error) {
    console.error("Seed error:", error)
    return NextResponse.json({ error: "Seed failed" }, { status: 500 })
  }
}
