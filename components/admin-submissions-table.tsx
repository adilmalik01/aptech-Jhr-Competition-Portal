"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Loader2, ExternalLink, FileText } from "lucide-react"

interface Submission {
  id: string
  teamEmail: string
  projectUrl: string
  notes: string | null
  createdAt: string
  team: {
    teamName: string
    teamId: string
    category: string
  }
}

export function SubmissionsTable() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/submissions")
      .then((r) => r.json())
      .then(setSubmissions)
      .catch(() => toast.error("Failed to load submissions"))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (submissions.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-12 text-center">
        <FileText className="mx-auto h-10 w-10 text-muted-foreground/50" />
        <p className="mt-3 text-sm text-muted-foreground">No submissions yet</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Team</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Team ID</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Email</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Submitted</th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">Project</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((sub) => (
              <tr key={sub.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 font-medium text-foreground">{sub.team.teamName}</td>
                <td className="px-4 py-3 font-mono text-xs text-primary">{sub.team.teamId}</td>
                <td className="px-4 py-3 text-muted-foreground">{sub.teamEmail}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {new Date(sub.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-right">
                  <a
                    href={sub.projectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-3 py-1 text-xs font-medium text-primary hover:bg-primary/20 transition-colors"
                  >
                    View Project
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
