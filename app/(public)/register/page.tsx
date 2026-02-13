import { RegistrationForm } from "@/components/registration-form"

export const metadata = {
  title: "Register Your Team | AJCC",
  description: "Register your team for the Aptech Johar Coding Competition.",
}

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Team Registration</h1>
        <p className="mt-2 text-muted-foreground">
          Register your team of 2-4 members. Solo registration is not allowed.
        </p>
      </div>
      <RegistrationForm />
    </div>
  )
}
