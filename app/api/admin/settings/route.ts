import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyToken } from "@/lib/auth"

async function getOrCreateSettings() {
  let settings = await prisma.settings.findFirst()
  if (!settings) {
    settings = await prisma.settings.create({ data: { submissionsOpen: false } })
  }
  return settings
}

export async function GET() {
  try {
    const settings = await getOrCreateSettings()
    return NextResponse.json(settings)
  } catch (error) {
    console.error("Settings fetch error:", error)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  const adminId = await verifyToken()
  if (!adminId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const { submissionsOpen } = await req.json()
    const settings = await getOrCreateSettings()
    const updated = await prisma.settings.update({
      where: { id: settings.id },
      data: { submissionsOpen },
    })
    return NextResponse.json(updated)
  } catch (error) {
    console.error("Settings update error:", error)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
