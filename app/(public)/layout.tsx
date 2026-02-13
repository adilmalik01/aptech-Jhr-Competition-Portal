import { Navbar } from "@/components/navbar"

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-border bg-card py-8">
        <div className="mx-auto max-w-6xl px-4 text-center text-sm text-muted-foreground">
          <p>Aptech Johar Coding Competition &mdash; Innovate for Impact</p>
        </div>
      </footer>
    </div>
  )
}
