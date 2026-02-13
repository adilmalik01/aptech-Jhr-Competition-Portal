"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Upload, Loader2, ToggleLeft, ToggleRight, Key, FileSpreadsheet } from "lucide-react"

export function AdminSettings() {
  const [submissionsOpen, setSubmissionsOpen] = useState(false)
  const [settingsLoading, setSettingsLoading] = useState(true)
  const [toggleLoading, setToggleLoading] = useState(false)

  // File upload
  const [uploading, setUploading] = useState(false)
  const [importResult, setImportResult] = useState<{ imported: number; skipped: number } | null>(null)

  // Credentials
  const [username, setUsername] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [credLoading, setCredLoading] = useState(false)

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data) => setSubmissionsOpen(data.submissionsOpen))
      .catch(() => {})
      .finally(() => setSettingsLoading(false))

    fetch("/api/admin/me")
      .then((r) => r.json())
      .then((data) => setUsername(data.username || ""))
      .catch(() => {})
  }, [])

  async function toggleSubmissions() {
    setToggleLoading(true)
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submissionsOpen: !submissionsOpen }),
      })
      if (!res.ok) throw new Error("Failed")
      setSubmissionsOpen(!submissionsOpen)
      toast.success(`Submissions ${!submissionsOpen ? "opened" : "closed"}`)
    } catch {
      toast.error("Failed to update")
    } finally {
      setToggleLoading(false)
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setImportResult(null)
    try {
      const formData = new FormData()
      formData.append("file", file)
      const res = await fetch("/api/admin/import-students", { method: "POST", body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setImportResult({ imported: data.imported, skipped: data.skipped })
      toast.success(`Imported ${data.imported} students`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Import failed")
    } finally {
      setUploading(false)
      e.target.value = ""
    }
  }

  async function handleCredentials(e: React.FormEvent) {
    e.preventDefault()
    if (!currentPassword) {
      toast.error("Current password is required")
      return
    }
    setCredLoading(true)
    try {
      const res = await fetch("/api/admin/credentials", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, currentPassword, newPassword: newPassword || undefined }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success("Credentials updated!")
      setCurrentPassword("")
      setNewPassword("")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed")
    } finally {
      setCredLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Submission Toggle */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-base font-semibold text-foreground">Submission Control</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {submissionsOpen ? "Submissions are currently open. Teams can submit projects." : "Submissions are closed. Teams cannot submit."}
            </p>
          </div>
          <button
            onClick={toggleSubmissions}
            disabled={settingsLoading || toggleLoading}
            className="flex-shrink-0 text-foreground transition-colors hover:text-primary disabled:opacity-50"
            aria-label={submissionsOpen ? "Close submissions" : "Open submissions"}
          >
            {settingsLoading || toggleLoading ? (
              <Loader2 className="h-8 w-8 animate-spin" />
            ) : submissionsOpen ? (
              <ToggleRight className="h-8 w-8 text-success" />
            ) : (
              <ToggleLeft className="h-8 w-8 text-muted-foreground" />
            )}
          </button>
        </div>
      </div>

      {/* Excel Import */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10">
            <FileSpreadsheet className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">Import Students</h3>
            <p className="text-sm text-muted-foreground">Upload an Excel file (.xlsx) with Student ID, Student Name, Batch, Email columns</p>
          </div>
        </div>
        <label className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed border-border px-6 py-8 transition-colors hover:border-primary/50 hover:bg-primary/5">
          {uploading ? (
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          ) : (
            <Upload className="h-8 w-8 text-muted-foreground" />
          )}
          <span className="text-sm font-medium text-foreground">
            {uploading ? "Uploading..." : "Click to upload .xlsx file"}
          </span>
          <input type="file" accept=".xlsx,.xls" onChange={handleFileUpload} className="hidden" disabled={uploading} />
        </label>
        {importResult && (
          <div className="mt-3 rounded-lg bg-success/10 px-4 py-2 text-sm">
            <span className="font-medium text-success">{importResult.imported} imported</span>
            {importResult.skipped > 0 && (
              <span className="text-muted-foreground"> &middot; {importResult.skipped} skipped</span>
            )}
          </div>
        )}
      </div>

      {/* Credentials */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-warning/10">
            <Key className="h-5 w-5 text-warning" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">Change Credentials</h3>
            <p className="text-sm text-muted-foreground">Update your admin username and password</p>
          </div>
        </div>
        <form onSubmit={handleCredentials} className="space-y-3">
          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Required to make changes"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground">New Password <span className="text-muted-foreground">(leave blank to keep current)</span></label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New password"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <button
            type="submit"
            disabled={credLoading || !currentPassword}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {credLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            {credLoading ? "Updating..." : "Update Credentials"}
          </button>
        </form>
      </div>
    </div>
  )
}
