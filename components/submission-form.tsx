"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Loader2, CheckCircle, XCircle, Send } from "lucide-react"

interface Team {
  id: string
  teamName: string
  teamId: string
  category: string
  submission: { id: string } | null
}

interface Settings {
  submissionsOpen: boolean
}

export function SubmissionForm() {
  const [teams, setTeams] = useState<Team[]>([])
  const [settings, setSettings] = useState<Settings | null>(null)
  const [selectedTeam, setSelectedTeam] = useState("")
  const [teamEmail, setTeamEmail] = useState("")
  const [projectUrl, setProjectUrl] = useState("")
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    Promise.all([
      fetch("/api/teams").then((r) => r.json()),
      fetch("/api/admin/settings").then((r) => r.json()),
    ]).then(([teamsData, settingsData]) => {
      setTeams(teamsData)
      setSettings(settingsData)
    }).catch(() => {})
  }, [])

  const team = teams.find((t) => t.teamName === selectedTeam)
  const alreadySubmitted = team?.submission

  if (settings && !settings.submissionsOpen) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
          <XCircle className="h-7 w-7 text-destructive" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Submissions Closed</h2>
        <p className="mt-2 text-muted-foreground">Submission is currently closed. Please check back later.</p>
      </div>
    )
  }

  if (success) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-success/10">
          <CheckCircle className="h-7 w-7 text-success" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Submitted Successfully!</h2>
        <p className="mt-2 text-muted-foreground">
          Your project has been submitted for evaluation. Results will be available after grading.
        </p>
      </div>
    )
  }

  const urlRegex = /^https?:\/\/.+/
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const isValid =
    selectedTeam &&
    !alreadySubmitted &&
    emailRegex.test(teamEmail) &&
    urlRegex.test(projectUrl)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isValid) return
    setLoading(true)
    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamName: selectedTeam, teamEmail, projectUrl, notes }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Submission failed")
      setSuccess(true)
      toast.success("Project submitted successfully!")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Submission failed")
    } finally {
      setLoading(false)
    }
  }

  const availableTeams = teams.filter((t) => !t.submission)

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border border-border bg-card p-6">
      <div className="space-y-2">
        <label htmlFor="team" className="text-sm font-medium text-foreground">Team Name</label>
        <select
          id="team"
          value={selectedTeam}
          onChange={(e) => setSelectedTeam(e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="">Select your team</option>
          {availableTeams.map((t) => (
            <option key={t.id} value={t.teamName}>
              {t.teamName} ({t.teamId})
            </option>
          ))}
        </select>
        {alreadySubmitted && (
          <p className="text-xs text-destructive">This team has already submitted a project.</p>
        )}
      </div>

      {team && (
        <div className="rounded-lg bg-primary/5 px-4 py-3">
          <p className="text-xs text-muted-foreground">Team ID</p>
          <p className="font-mono text-sm font-semibold text-primary">{team.teamId}</p>
          <p className="mt-1 text-xs text-muted-foreground">Category: {team.category}</p>
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-foreground">Team Email</label>
        <input
          id="email"
          type="email"
          value={teamEmail}
          onChange={(e) => setTeamEmail(e.target.value)}
          placeholder="team@email.com"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="projectUrl" className="text-sm font-medium text-foreground">Project URL</label>
        <input
          id="projectUrl"
          type="url"
          value={projectUrl}
          onChange={(e) => setProjectUrl(e.target.value)}
          placeholder="https://github.com/your-repo or live URL"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="notes" className="text-sm font-medium text-foreground">
          Notes <span className="text-muted-foreground">(optional)</span>
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="Any additional notes for the judges..."
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      <button
        type="submit"
        disabled={!isValid || loading}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            Submit Project
          </>
        )}
      </button>
    </form>
  )
}
