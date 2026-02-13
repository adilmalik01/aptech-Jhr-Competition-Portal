import { ResultChecker } from "@/components/result-checker"

export const metadata = {
  title: "Check Results | AJCC",
  description: "Check your team results for the Aptech Johar Coding Competition.",
}

export default function ResultsPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Check Your Result</h1>
        <p className="mt-2 text-muted-foreground">
          Enter your Team ID to view your evaluation results.
        </p>
      </div>
      <ResultChecker />
    </div>
  )
}
