import { SubmissionsTable } from "@/components/admin-submissions-table"

export default function AdminSubmissionsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">Submissions</h1>
      <p className="mt-1 text-sm text-muted-foreground">View all project submissions</p>
      <div className="mt-6">
        <SubmissionsTable />
      </div>
    </div>
  )
}
