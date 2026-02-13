import { prisma } from "@/lib/prisma"
import { Users, FileText, Trophy, BarChart3 } from "lucide-react"

export default async function AdminDashboardPage() {
  const [teamCount, submissionCount, evaluatedCount] = await Promise.all([
    prisma.team.count(),
    prisma.submission.count(),
    prisma.evaluation.count(),
  ])

  const settings = await prisma.settings.findFirst()
  const stats = [
    { label: "Total Teams", value: teamCount, icon: Users, color: "bg-primary/10 text-primary" },
    { label: "Submissions", value: submissionCount, icon: FileText, color: "bg-accent/10 text-accent" },
    { label: "Evaluated", value: evaluatedCount, icon: Trophy, color: "bg-warning/10 text-warning" },
    { label: "Submission Status", value: settings?.submissionsOpen ? "Open" : "Closed", icon: BarChart3, color: settings?.submissionsOpen ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive" },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">Overview of the competition</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${stat.color}`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-2 text-2xl font-bold text-foreground">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
