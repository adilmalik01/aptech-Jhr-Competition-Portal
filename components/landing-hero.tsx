import Link from "next/link"
import { ArrowRight, Code2, Trophy, Users, Send, Zap, Terminal, Braces } from "lucide-react"

export function LandingHero() {
  return (
    <section className="relative overflow-hidden">
      {/* Animated grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(225_15%_16%/0.4)_1px,transparent_1px),linear-gradient(to_bottom,hsl(225_15%_16%/0.4)_1px,transparent_1px)] bg-[size:60px_60px]" />
      {/* Radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center_top,hsl(190_95%_50%/0.12),transparent_60%)]" />
      <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-primary/5 blur-[100px]" />
      <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-accent/5 blur-[80px]" />

      <div className="relative mx-auto max-w-6xl px-4 py-24 lg:py-36">
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            <Zap className="h-4 w-4" />
            <span className="tracking-wide">Innovate for Impact</span>
          </div>
          <h1 className="glow-text max-w-4xl text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-7xl">
            Aptech Johar{" "}
            <span className="text-primary">Coding</span>{" "}
            Competition
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
            Build projects that solve real-world problems, showcase creativity, and demonstrate clean code. Compete in{" "}
            <span className="font-medium text-foreground">Full Stack Web Development</span> or{" "}
            <span className="font-medium text-foreground">Web Designing</span>.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/register"
              className="glow-primary inline-flex items-center gap-2 rounded-lg bg-primary px-7 py-3.5 text-sm font-bold text-primary-foreground transition-all hover:brightness-110"
            >
              Register Your Team
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/results"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-7 py-3.5 text-sm font-semibold text-foreground transition-colors hover:border-primary/30 hover:bg-secondary"
            >
              Check Results
            </Link>
          </div>

          {/* Floating code-like decoration */}
          <div className="mt-16 flex items-center gap-3 rounded-lg border border-border bg-card/50 px-5 py-3 font-mono text-sm text-muted-foreground backdrop-blur-sm">
            <Terminal className="h-4 w-4 text-primary" />
            <span className="text-primary">{'>'}</span>
            <span>ajcc</span>
            <span className="text-accent">--register</span>
            <span className="text-muted-foreground/50">--team</span>
            <span className="animate-pulse text-primary">_</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export function LandingFeatures() {
  const features = [
    {
      icon: Users,
      title: "Team-Based Competition",
      description: "Form teams of 2-4 members. Collaborate, code, and compete together for top positions.",
    },
    {
      icon: Braces,
      title: "Two Categories",
      description: "Choose between Full Stack Web Development and Web Designing. Each category has its own top 3 positions.",
    },
    {
      icon: Trophy,
      title: "Graded Evaluation",
      description: "Projects are evaluated on UI/UX, Code Quality, Folder Structure, Functionality, and Innovation.",
    },
    {
      icon: Send,
      title: "Online Submissions",
      description: "Submit your project with a GitHub or live URL when submissions open. Track your results online.",
    },
  ]

  return (
    <section className="border-t border-border py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">How It Works</h2>
          <p className="mt-3 text-muted-foreground">From registration to certificates, everything happens on this platform.</p>
        </div>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <div key={i} className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:glow-primary">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20 transition-colors group-hover:bg-primary group-hover:text-primary-foreground group-hover:ring-primary">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold text-foreground">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function LandingCriteria() {
  const criteria = [
    { label: "UI / UX Design", max: 25 },
    { label: "Code Quality", max: 25 },
    { label: "Folder Structure", max: 20 },
    { label: "Functionality", max: 20 },
    { label: "Innovation / Creativity", max: 10 },
  ]

  return (
    <section className="border-t border-border py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Evaluation Criteria</h2>
          <p className="mt-3 text-muted-foreground">Projects are scored out of 100 across five categories.</p>
        </div>
        <div className="mx-auto mt-12 max-w-lg space-y-3">
          {criteria.map((c) => (
            <div key={c.label} className="flex items-center justify-between rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/20">
              <span className="text-sm font-medium text-foreground">{c.label}</span>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-bold text-primary ring-1 ring-primary/20">
                {c.max} pts
              </span>
            </div>
          ))}
          <div className="glow-primary flex items-center justify-between rounded-lg border border-primary/40 bg-primary/5 p-4">
            <span className="text-sm font-bold text-foreground">Total</span>
            <span className="rounded-full bg-primary px-3 py-1 text-sm font-bold text-primary-foreground">100 pts</span>
          </div>
        </div>
      </div>
    </section>
  )
}
