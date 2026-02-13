import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyToken } from "@/lib/auth"

export async function GET() {
  const adminId = await verifyToken()
  if (!adminId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const admin = await prisma.admin.findUnique({
    where: { id: adminId },
    select: { id: true, username: true },
  })
  return NextResponse.json(admin)
}
