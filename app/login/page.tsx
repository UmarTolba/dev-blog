import Link from "next/link"
import type { Metadata } from "next"
import AuthForm from "@/components/AuthForm"

export const metadata: Metadata = {
  title: "Sign in",
}

export default function LoginPage() {
  const adminConfigured = Boolean(
    process.env.ADMIN_EMAIL &&
      process.env.ADMIN_PASSWORD &&
      process.env.ADMIN_PASSWORD.length >= 12,
  )

  return (
    <main className="mx-auto max-w-shell px-6 py-12 md:px-10 md:py-16">
      <p className="label">Account</p>
      <h1 className="mt-4 font-display text-display">Sign in</h1>
      <p className="mt-4 text-muted">Sign in to create and manage your articles.</p>
      {!adminConfigured && (
        <p role="status" className="mt-6 max-w-xl border-l-2 border-accent pl-4 text-meta">
          Admin access is not configured on this server. Set <code>ADMIN_EMAIL</code>{" "}
          and an <code>ADMIN_PASSWORD</code> of at least 12 characters in{" "}
          <code>nextjs-blog/.env.local</code>, then restart the app.
        </p>
      )}
      <div className="mt-8">
        <AuthForm mode="login" />
      </div>
      <p className="mt-8 text-meta">
        New here? <Link href="/register" className="link">Create an account</Link>
      </p>
    </main>
  )
}
