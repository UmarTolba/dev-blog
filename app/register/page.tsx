import Link from "next/link"
import type { Metadata } from "next"
import AuthForm from "@/components/AuthForm"

export const metadata: Metadata = {
  title: "Register",
}

export default function RegisterPage() {
  return (
    <main className="mx-auto max-w-shell px-6 py-12 md:px-10 md:py-16">
      <p className="label">Account</p>
      <h1 className="mt-4 font-display text-display">Create an account</h1>
      <p className="mt-4 text-muted">Your articles will be linked to your account.</p>
      <div className="mt-8">
        <AuthForm mode="register" />
      </div>
      <p className="mt-8 text-meta">
        Already registered? <Link href="/login" className="link">Sign in</Link>
      </p>
    </main>
  )
}
