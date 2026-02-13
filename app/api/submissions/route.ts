import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const submissions = await prisma.submission.findMany({
      include: { team: true },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(submissions)
  } catch (error) {
    console.error("Submissions fetch error:", error)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const settings = await prisma.settings.findFirst()
    if (!settings?.submissionsOpen) {
      return NextResponse.json({ error: "Submissions are currently closed" }, { status: 403 })
    }

    const { teamName, teamEmail, projectUrl, notes } = await req.json()
    if (!teamName || !teamEmail || !projectUrl) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const team = await prisma.team.findUnique({ where: { teamName }, include: { submission: true } })
    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 })
    }
    if (team.submission) {
      return NextResponse.json({ error: "Team has already submitted" }, { status: 400 })
    }

    const submission = await prisma.submission.create({
      data: {
        teamDbId: team.id,
        teamEmail,
        projectUrl,
        notes: notes || null,
      },
      include: { team: true },
    })

    return NextResponse.json(submission, { status: 201 })
  } catch (error) {
    console.error("Submission error:", error)
    return NextResponse.json({ error: "Submission failed" }, { status: 500 })
  }
}
