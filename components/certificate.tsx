"use client"

import { Printer } from "lucide-react"

interface CertificateProps {
  studentName: string
  teamName: string
  category: string
  position: number | null
}

const positionText: Record<number, string> = {
  1: "First Place",
  2: "Second Place",
  3: "Third Place",
}

export function Certificate({ studentName, teamName, category, position }: CertificateProps) {
  function handlePrint() {
    window.print()
  }

  return (
    <div>
      <div className="no-print mb-4 flex justify-end">
        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Printer className="h-4 w-4" />
          Print Certificate
        </button>
      </div>

      <div
        className="mx-auto aspect-[1.414/1] max-w-3xl overflow-hidden rounded-xl border-[3px] border-primary/30 bg-card shadow-2xl"
        style={{ printColorAdjust: "exact", WebkitPrintColorAdjust: "exact" }}
      >
        <div className="relative flex h-full flex-col items-center justify-center p-10 text-center">
          {/* Decorative borders */}
          <div className="absolute inset-4 rounded-lg border-2 border-primary/10" />
          <div className="absolute inset-6 rounded-lg border border-primary/5" />

          {/* Top decorative bar */}
          <div className="absolute left-0 right-0 top-0 h-2 bg-primary" />

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-primary">
              Aptech Johar Coding Competition
            </p>

            <div className="my-6">
              <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
                Certificate
              </h1>
              <p className="mt-1 text-lg text-muted-foreground">of {position ? "Achievement" : "Participation"}</p>
            </div>

            <p className="text-sm text-muted-foreground">This is proudly presented to</p>

            <h2 className="mt-3 text-3xl font-bold text-primary md:text-4xl">
              {studentName}
            </h2>

            <div className="mx-auto my-6 h-px w-48 bg-border" />

            <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
              For participating in the <span className="font-semibold text-foreground">Aptech Johar Coding Competition</span> as
              a member of team <span className="font-semibold text-foreground">{teamName}</span> in the{" "}
              <span className="font-semibold text-foreground">{category}</span> category.
            </p>

            {position && position <= 3 && (
              <div className="mt-4 inline-flex items-center gap-2 rounded-full border-2 border-warning/30 bg-warning/10 px-5 py-2">
                <span className="text-base font-bold text-warning">{positionText[position]}</span>
              </div>
            )}

            <p className="mt-6 text-xs text-muted-foreground">
              Theme: <span className="italic">Innovate for Impact</span>
            </p>

            <div className="mt-8 flex items-center gap-16">
              <div className="text-center">
                <div className="mb-1 h-px w-28 bg-foreground/30" />
                <p className="text-xs text-muted-foreground">Date</p>
              </div>
              <div className="text-center">
                <div className="mb-1 h-px w-28 bg-foreground/30" />
                <p className="text-xs text-muted-foreground">Signature</p>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-primary" />
        </div>
      </div>
    </div>
  )
}
