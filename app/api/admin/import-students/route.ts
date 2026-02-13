import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyToken } from "@/lib/auth"
import * as XLSX from "xlsx"

export async function POST(req: NextRequest) {
  const adminId = await verifyToken()
  if (!adminId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }
    const buffer = Buffer.from(await file.arrayBuffer())
    const workbook = XLSX.read(buffer, { type: "buffer" })
    const sheetName = workbook.SheetNames[0]
    const sheet = workbook.Sheets[sheetName]
    const rows = XLSX.utils.sheet_to_json<Record<string, string>>(sheet)

    let imported = 0
    let skipped = 0
    const errors: string[] = []

    for (const row of rows) {
      const studentId = String(row["Student ID"] || row["student_id"] || row["StudentID"] || "").trim()
      const name = String(row["Student Name"] || row["Name"] || row["name"] || "").trim()
      const batch = String(row["Batch"] || row["batch"] || "").trim()
      const email = String(row["Email"] || row["email"] || "").trim()

      if (!studentId || !name || !batch || !email) {
        errors.push(`Row missing fields: ${JSON.stringify(row)}`)
        skipped++
        continue
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        errors.push(`Invalid email: ${email}`)
        skipped++
        continue
      }
      try {
        await prisma.student.upsert({
          where: { email },
          update: { studentId, name, batch },
          create: { studentId, name, batch, email },
        })
        imported++
      } catch {
        skipped++
        errors.push(`Duplicate or error for: ${email}`)
      }
    }
    return NextResponse.json({ imported, skipped, errors: errors.slice(0, 10) })
  } catch (error) {
    console.error("Import error:", error)
    return NextResponse.json({ error: "Import failed" }, { status: 500 })
  }
}
