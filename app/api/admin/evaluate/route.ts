import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyToken } from "@/lib/auth"

function getGrade(percentage: number): string {
  if (percentage >= 90) return "A+"
  if (percentage >= 80) return "A"
  if (percentage >= 70) return "B"
  if (percentage >= 60) return "C"
  return "Fail"
}

export async function POST(req: NextRequest) {
  const adminId = await verifyToken()
  if (!adminId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const { teamDbId, uiUx, codeQuality, folderStructure, functionality, innovation } = await req.json()

    if (!teamDbId) {
      return NextResponse.json({ error: "Team ID required" }, { status: 400 })
    }

    const totalMarks = (uiUx || 0) + (codeQuality || 0) + (folderStructure || 0) + (functionality || 0) + (innovation || 0)
    const percentage = totalMarks
    const grade = getGrade(percentage)

    const evaluation = await prisma.evaluation.upsert({
      where: { teamDbId },
      update: { uiUx, codeQuality, folderStructure, functionality, innovation, totalMarks, percentage, grade },
      create: { teamDbId, uiUx, codeQuality, folderStructure, functionality, innovation, totalMarks, percentage, grade },
    })

    // Recalculate positions for this category
    const team = await prisma.team.findUnique({ where: { id: teamDbId } })
    if (team) {
      const categoryTeams = await prisma.team.findMany({
        where: { category: team.category },
        include: { evaluation: true },
      })

      const evaluated = categoryTeams
        .filter((t) => t.evaluation)
        .sort((a, b) => (b.evaluation!.totalMarks) - (a.evaluation!.totalMarks))

      for (let i = 0; i < evaluated.length; i++) {
        const position = i < 3 ? i + 1 : null
        await prisma.evaluation.update({
          where: { teamDbId: evaluated[i].id },
          data: { position },
        })
      }
    }

    return NextResponse.json(evaluation)
  } catch (error) {
    console.error("Evaluation error:", error)
    return NextResponse.json({ error: "Evaluation failed" }, { status: 500 })
  }
}
