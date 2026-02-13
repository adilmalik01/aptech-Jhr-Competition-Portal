import { redirect } from "next/navigation"
import { verifyToken } from "@/lib/auth"
import { AdminSidebar } from "@/components/admin-sidebar"

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const adminId = await verifyToken()
  if (!adminId) {
    redirect("/admin/login")
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 overflow-auto bg-background">
        <div className="mx-auto max-w-6xl px-4 py-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  )
}
