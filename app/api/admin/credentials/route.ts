import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyToken } from "@/lib/auth"
import bcrypt from "bcryptjs"

export async function PUT(req: NextRequest) {
  const adminId = await verifyToken()
  if (!adminId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const { username, currentPassword, newPassword } = await req.json()
    const admin = await prisma.admin.findUnique({ where: { id: adminId } })
    if (!admin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 })
    }
    const valid = await bcrypt.compare(currentPassword, admin.password)
    if (!valid) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 401 })
    }
    const data: Record<string, string> = {}
    if (username && username !== admin.username) data.username = username
    if (newPassword) data.password = await bcrypt.hash(newPassword, 12)
    if (Object.keys(data).length === 0) {
      return NextResponse.json({ message: "No changes" })
    }
    await prisma.admin.update({ where: { id: adminId }, data })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Credentials error:", error)
    return NextResponse.json({ error: "Update failed" }, { status: 500 })
  }
}
