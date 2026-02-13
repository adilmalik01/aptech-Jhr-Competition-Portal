"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Search, Loader2, Trophy, Award, Printer } from "lucide-react"
import { Certificate } from "./certificate"

interface Member {
  id: string
  studentId: string
  name: string
  batch: string
  email: string
}

interface Evaluation {
  uiUx: number
  codeQuality: number
  folderStructure: number
  functionality: number
  innovation: number
  totalMarks: number
  percentage: number
  grade: string
  position: number | null
}

interface TeamResult {
  teamName: string
  teamId: string
  category: string
  members: Member[]
  evaluation: Evaluation
}

export function ResultChecker() {
  const [teamId, setTeamId] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<TeamResult | null>(null)
  const [error, setError] = useState("")
  const [printMember, setPrintMember] = useState<{ name: string; teamName: string; category: string; position: number | null } | null>(null)

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!teamId.trim()) return
    setLoading(true)
    setError("")
    setResult(null)
    try {
      const res = await fetch(`/api/results/${encodeURIComponent(teamId.trim())}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Not found")
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Not found")
      toast.error("Could not find results for this Team ID")
    } finally {
      setLoading(false)
    }
  }

  const positionLabels: Record<number, string> = { 1: "1st Place", 2: "2nd Place", 3: "3rd Place" }

  const criteria = result
    ? [
        { label: "UI / UX Design", score: result.evaluation.uiUx, max: 25 },
        { label: "Code Quality", score: result.evaluation.codeQuality, max: 25 },
        { label: "Folder Structure", score: result.evaluation.folderStructure, max: 20 },
        { label: "Functionality", score: result.evaluation.functionality, max: 20 },
        { label: "Innovation / Creativity", score: result.evaluation.innovation, max: 10 },
      ]
    : []

  if (printMember) {
    return (
      <div>
        <button
          onClick={() => setPrintMember(null)}
          className="no-print mb-4 rounded-md bg-secondary px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
        >
          Back to Results
        </button>
        <Certificate
          studentName={printMember.name}
          teamName={printMember.teamName}
          category={printMember.category}
          position={printMember.position}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSearch} className="flex gap-3">
        <input
          type="text"
          value={teamId}
          onChange={(e) => setTeamId(e.target.value)}
          placeholder="Enter Team ID (e.g. AJCC-WD-1023)"
          className="flex h-11 flex-1 rounded-lg border border-input bg-card px-4 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <button
          type="submit"
          disabled={!teamId.trim() || loading}
          className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          Search
        </button>
      </form>

      {error && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {result && (
        <div className="space-y-4">
          {/* Team Info Header */}
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-foreground">{result.teamName}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  <span className="font-mono text-primary">{result.teamId}</span> &middot; {result.category}
                </p>
              </div>
              {result.evaluation.position && result.evaluation.position <= 3 && (
                <div className="flex items-center gap-2 rounded-full bg-warning/10 px-3 py-1.5">
                  <Trophy className="h-4 w-4 text-warning" />
                  <span className="text-sm font-bold text-warning">{positionLabels[result.evaluation.position]}</span>
                </div>
              )}
            </div>
          </div>

          {/* Marks Breakdown */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Marks Breakdown</h3>
            <div className="space-y-3">
              {criteria.map((c) => (
                <div key={c.label}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-foreground">{c.label}</span>
                    <span className="font-medium text-foreground">{c.score}/{c.max}</span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${(c.score / c.max) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-center justify-between rounded-lg border-2 border-primary bg-primary/5 p-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Score</p>
                <p className="text-2xl font-bold text-primary">{result.evaluation.totalMarks}/100</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Grade</p>
                <p className="text-2xl font-bold text-foreground">{result.evaluation.grade}</p>
              </div>
            </div>
          </div>

          {/* Team Members with Certificate Buttons */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Team Members</h3>
            <div className="space-y-2">
              {result.members.map((member) => (
                <div key={member.id} className="flex items-center justify-between rounded-lg border border-border bg-background p-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">{member.name}</p>
                    <p className="text-xs text-muted-foreground">{member.studentId} &middot; {member.batch}</p>
                  </div>
                  <button
                    onClick={() =>
                      setPrintMember({
                        name: member.name,
                        teamName: result.teamName,
                        category: result.category,
                        position: result.evaluation.position,
                      })
                    }
                    className="inline-flex items-center gap-1.5 rounded-md bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent hover:bg-accent/20 transition-colors"
                  >
                    <Award className="h-3.5 w-3.5" />
                    Certificate
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
