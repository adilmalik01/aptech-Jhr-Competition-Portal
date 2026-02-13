"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Plus, Trash2, UserPlus, Loader2, CheckCircle } from "lucide-react"

interface Member {
  studentId: string
  name: string
  batch: string
  email: string
}

interface Student {
  id: string
  studentId: string
  name: string
  batch: string
  email: string
}

const emptyMember: Member = { studentId: "", name: "", batch: "", email: "" }

export function RegistrationForm() {
  const [teamName, setTeamName] = useState("")
  const [category, setCategory] = useState("")
  const [members, setMembers] = useState<Member[]>([{ ...emptyMember }, { ...emptyMember }])
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState<{ teamId: string; teamName: string } | null>(null)

  useEffect(() => {
    fetch("/api/students")
      .then((r) => r.json())
      .then(setStudents)
      .catch(() => {})
  }, [])

  function updateMember(index: number, field: keyof Member, value: string) {
    const updated = [...members]
    updated[index] = { ...updated[index], [field]: value }
    setMembers(updated)
  }

  function selectStudent(index: number, studentId: string) {
    const student = students.find((s) => s.id === studentId)
    if (student) {
      const updated = [...members]
      updated[index] = {
        studentId: student.studentId,
        name: student.name,
        batch: student.batch,
        email: student.email,
      }
      setMembers(updated)
    }
  }

  function addMember() {
    if (members.length < 4) {
      setMembers([...members, { ...emptyMember }])
    }
  }

  function removeMember(index: number) {
    if (members.length > 2) {
      setMembers(members.filter((_, i) => i !== index))
    }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const isValid =
    teamName.trim() &&
    category &&
    members.length >= 2 &&
    members.every((m) => m.studentId && m.name && m.batch && emailRegex.test(m.email)) &&
    new Set(members.map((m) => m.email)).size === members.length

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isValid) return
    setLoading(true)
    try {
      const res = await fetch("/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamName: teamName.trim(), category, members }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Registration failed")
      setSuccess({ teamId: data.teamId, teamName: data.teamName })
      toast.success("Team registered successfully!")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-success/10">
          <CheckCircle className="h-7 w-7 text-success" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Registration Successful!</h2>
        <p className="mt-2 text-muted-foreground">
          Your team <span className="font-semibold text-foreground">{success.teamName}</span> has been registered.
        </p>
        <div className="mt-4 inline-block rounded-lg bg-primary/10 px-4 py-2">
          <p className="text-xs text-muted-foreground">Your Team ID</p>
          <p className="text-lg font-bold tracking-wider text-primary">{success.teamId}</p>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">Save this Team ID to check your results later.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-border bg-card p-6">
      <div className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Team Information</h3>
        <div className="space-y-2">
          <label htmlFor="teamName" className="text-sm font-medium text-foreground">Team Name</label>
          <input
            id="teamName"
            type="text"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            placeholder="Enter a unique team name"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="category" className="text-sm font-medium text-foreground">Category</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">Select category</option>
            <option value="Full Stack Web Development">Full Stack Web Development</option>
            <option value="Web Designing">Web Designing</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Team Members ({members.length}/4)
          </h3>
          {members.length < 4 && (
            <button
              type="button"
              onClick={addMember}
              className="inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Member
            </button>
          )}
        </div>

        {members.map((member, i) => (
          <div key={i} className="relative space-y-3 rounded-lg border border-border bg-background p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserPlus className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">Member {i + 1}</span>
              </div>
              {members.length > 2 && (
                <button
                  type="button"
                  onClick={() => removeMember(i)}
                  className="rounded-md p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                  aria-label={`Remove member ${i + 1}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>

            {students.length > 0 && (
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Select from imported students</label>
                <select
                  onChange={(e) => selectStudent(i, e.target.value)}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  defaultValue=""
                >
                  <option value="">-- Or fill manually below --</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.studentId}) - {s.batch}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Student ID</label>
                <input
                  type="text"
                  value={member.studentId}
                  onChange={(e) => updateMember(i, "studentId", e.target.value)}
                  placeholder="e.g. STU-001"
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Name</label>
                <input
                  type="text"
                  value={member.name}
                  onChange={(e) => updateMember(i, "name", e.target.value)}
                  placeholder="Full name"
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Batch</label>
                <input
                  type="text"
                  value={member.batch}
                  onChange={(e) => updateMember(i, "batch", e.target.value)}
                  placeholder="e.g. 2024-A"
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Email</label>
                <input
                  type="email"
                  value={member.email}
                  onChange={(e) => updateMember(i, "email", e.target.value)}
                  placeholder="student@email.com"
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                {member.email && !emailRegex.test(member.email) && (
                  <p className="text-xs text-destructive">Invalid email format</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        type="submit"
        disabled={!isValid || loading}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Registering...
          </>
        ) : (
          "Register Team"
        )}
      </button>
    </form>
  )
}
