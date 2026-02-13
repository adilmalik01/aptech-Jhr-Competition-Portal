import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest, { params }: { params: Promise<{ teamId: string }> }) {
  const { teamId } = await params
  try {
    const team = await prisma.team.findUnique({
      where: { teamId },
      include: { members: true, evaluation: true },
    })
    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 })
    }
    if (!team.evaluation) {
      return NextResponse.json({ error: "Results not yet available for this team" }, { status: 404 })
    }
    return NextResponse.json(team)
  } catch (error) {
    console.error("Result error:", error)
    return NextResponse.json({ error: "Failed to fetch result" }, { status: 500 })
  }
}
