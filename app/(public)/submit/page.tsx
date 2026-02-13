import { SubmissionForm } from "@/components/submission-form"

export const metadata = {
  title: "Submit Project | AJCC",
  description: "Submit your team project for the Aptech Johar Coding Competition.",
}

export default function SubmitPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Project Submission</h1>
        <p className="mt-2 text-muted-foreground">
          Submit your project for evaluation. Ensure you have your team details ready.
        </p>
      </div>
      <SubmissionForm />
    </div>
  )
}
