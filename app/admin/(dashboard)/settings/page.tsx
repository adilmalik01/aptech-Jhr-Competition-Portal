import { AdminSettings } from "@/components/admin-settings"

export default function AdminSettingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">Settings</h1>
      <p className="mt-1 text-sm text-muted-foreground">Manage competition settings and your account</p>
      <div className="mt-6">
        <AdminSettings />
      </div>
    </div>
  )
}
