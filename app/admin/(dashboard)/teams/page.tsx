import { TeamsTable } from "@/components/admin-teams-table"

export default function AdminTeamsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">Teams Management</h1>
      <p className="mt-1 text-sm text-muted-foreground">View and evaluate all registered teams</p>
      <div className="mt-6">
        <TeamsTable />
      </div>
    </div>
  )
}
