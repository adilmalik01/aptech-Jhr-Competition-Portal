import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

function generateTeamId(category: string): string {
  const prefix = category === "Full Stack Web Development" ? "AJCC-WD" : "AJCC-DS"
  const num = Math.floor(1000 + Math.random() * 9000)
  return `${prefix}-${num}`
}

export async function GET() {
  try {
    const teams = await prisma.team.findMany({
      include: { members: true, submission: true, evaluation: true },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(teams)
  } catch (error) {
    console.error("Teams fetch error:", error)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { teamName, category, members } = await req.json()

    if (!teamName || !category || !members || members.length < 2 || members.length > 4) {
      return NextResponse.json({ error: "Invalid data. Team needs 2-4 members." }, { status: 400 })
    }

    const existing = await prisma.team.findUnique({ where: { teamName } })
    if (existing) {
      return NextResponse.json({ error: "Team name already exists" }, { status: 400 })
    }

    // Check for duplicate emails within request
    const emails = members.map((m: { email: string }) => m.email)
    if (new Set(emails).size !== emails.length) {
      return NextResponse.json({ error: "Duplicate emails in team" }, { status: 400 })
    }

    // Check if any member is already in another team
    for (const member of members) {
      const existingMember = await prisma.teamMember.findFirst({
        where: { email: member.email },
      })
      if (existingMember) {
        return NextResponse.json({ error: `${member.email} is already in another team` }, { status: 400 })
      }
    }

    let teamId = generateTeamId(category)
    while (await prisma.team.findUnique({ where: { teamId } })) {
      teamId = generateTeamId(category)
    }

    const team = await prisma.team.create({
      data: {
        teamName,
        teamId,
        category,
        members: {
          create: members.map((m: { studentId: string; name: string; batch: string; email: string }) => ({
            studentId: m.studentId,
            name: m.name,
            batch: m.batch,
            email: m.email,
          })),
        },
      },
      include: { members: true },
    })

    return NextResponse.json(team, { status: 201 })
  } catch (error) {
    console.error("Team create error:", error)
    return NextResponse.json({ error: "Registration failed" }, { status: 500 })
  }
}
