"use client"

import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import { Eye, ClipboardEdit, X, Loader2, Trophy, Users } from "lucide-react"

interface Member {
  id: string
  studentId: string
  name: string
  batch: string
  email: string
}

interface Evaluation {
  id: string
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

interface Team {
  id: string
  teamName: string
  teamId: string
  category: string
  members: Member[]
  submission: { id: string } | null
  evaluation: Evaluation | null
  createdAt: string
}

export function TeamsTable() {
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [viewTeam, setViewTeam] = useState<Team | null>(null)
  const [evalTeam, setEvalTeam] = useState<Team | null>(null)

  const fetchTeams = useCallback(async () => {
    try {
      const res = await fetch("/api/teams")
      const data = await res.json()
      setTeams(data)
    } catch {
      toast.error("Failed to fetch teams")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchTeams() }, [fetchTeams])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (teams.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-12 text-center">
        <Users className="mx-auto h-10 w-10 text-muted-foreground/50" />
        <p className="mt-3 text-sm text-muted-foreground">No teams registered yet</p>
      </div>
    )
  }

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Team</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Team ID</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Category</th>
                <th className="px-4 py-3 text-center font-medium text-muted-foreground">Members</th>
                <th className="px-4 py-3 text-center font-medium text-muted-foreground">Submitted</th>
                <th className="px-4 py-3 text-center font-medium text-muted-foreground">Grade</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((team) => (
                <tr key={team.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-medium text-foreground">{team.teamName}</td>
                  <td className="px-4 py-3 font-mono text-xs text-primary">{team.teamId}</td>
                  <td className="px-4 py-3 text-muted-foreground">{team.category}</td>
                  <td className="px-4 py-3 text-center text-muted-foreground">{team.members.length}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${team.submission ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>
                      {team.submission ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {team.evaluation ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                        {team.evaluation.position && team.evaluation.position <= 3 && <Trophy className="h-3 w-3" />}
                        {team.evaluation.grade} ({team.evaluation.totalMarks})
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">--</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setViewTeam(team)}
                        className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                        aria-label="View team"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setEvalTeam(team)}
                        className="rounded-md p-1.5 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                        aria-label="Evaluate team"
                      >
                        <ClipboardEdit className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {viewTeam && <TeamViewModal team={viewTeam} onClose={() => setViewTeam(null)} />}
      {evalTeam && <EvaluationModal team={evalTeam} onClose={() => { setEvalTeam(null); fetchTeams() }} />}
    </>
  )
}

function TeamViewModal({ team, onClose }: { team: Team; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-foreground">{team.teamName}</h2>
          <button onClick={onClose} className="rounded-md p-1 text-muted-foreground hover:bg-muted" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-3">
          <div className="flex gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Team ID:</span>{" "}
              <span className="font-mono font-semibold text-primary">{team.teamId}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Category:</span>{" "}
              <span className="font-medium text-foreground">{team.category}</span>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-2">Members ({team.members.length})</h3>
            <div className="space-y-2">
              {team.members.map((m) => (
                <div key={m.id} className="rounded-lg border border-border bg-background p-3 text-sm">
                  <p className="font-medium text-foreground">{m.name}</p>
                  <p className="text-xs text-muted-foreground">{m.studentId} &middot; {m.batch} &middot; {m.email}</p>
                </div>
              ))}
            </div>
          </div>
          {team.evaluation && (
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
              <h3 className="text-sm font-semibold text-foreground mb-1">Evaluation</h3>
              <p className="text-sm text-muted-foreground">
                Total: <span className="font-bold text-primary">{team.evaluation.totalMarks}/100</span> &middot;
                Grade: <span className="font-bold">{team.evaluation.grade}</span>
                {team.evaluation.position && ` · Position: #${team.evaluation.position}`}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function EvaluationModal({ team, onClose }: { team: Team; onClose: () => void }) {
  const [scores, setScores] = useState({
    uiUx: team.evaluation?.uiUx || 0,
    codeQuality: team.evaluation?.codeQuality || 0,
    folderStructure: team.evaluation?.folderStructure || 0,
    functionality: team.evaluation?.functionality || 0,
    innovation: team.evaluation?.innovation || 0,
  })
  const [saving, setSaving] = useState(false)

  const total = scores.uiUx + scores.codeQuality + scores.folderStructure + scores.functionality + scores.innovation

  const criteria = [
    { key: "uiUx" as const, label: "UI / UX Design", max: 25 },
    { key: "codeQuality" as const, label: "Code Quality", max: 25 },
    { key: "folderStructure" as const, label: "Folder Structure", max: 20 },
    { key: "functionality" as const, label: "Functionality", max: 20 },
    { key: "innovation" as const, label: "Innovation / Creativity", max: 10 },
  ]

  async function handleSave() {
    setSaving(true)
    try {
      const res = await fetch("/api/admin/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamDbId: team.id, ...scores }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success("Evaluation saved!")
      onClose()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-foreground">Evaluate: {team.teamName}</h2>
            <p className="text-xs text-muted-foreground">{team.teamId} &middot; {team.category}</p>
          </div>
          <button onClick={onClose} className="rounded-md p-1 text-muted-foreground hover:bg-muted" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-4">
          {criteria.map((c) => (
            <div key={c.key} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <label className="font-medium text-foreground">{c.label}</label>
                <span className="text-xs text-muted-foreground">
                  {scores[c.key]} / {c.max}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={c.max}
                value={scores[c.key]}
                onChange={(e) => setScores({ ...scores, [c.key]: Number(e.target.value) })}
                className="w-full accent-primary"
              />
            </div>
          ))}
          <div className="flex items-center justify-between rounded-lg border-2 border-primary bg-primary/5 p-3">
            <span className="text-sm font-bold text-foreground">Total</span>
            <span className="text-lg font-bold text-primary">{total} / 100</span>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {saving ? "Saving..." : "Save Evaluation"}
          </button>
        </div>
      </div>
    </div>
  )
}
