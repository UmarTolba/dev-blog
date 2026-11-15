"use client"

import { FormEvent, useState } from "react"
import { useRouter } from "next/navigation"

export default function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter()
  const [message, setMessage] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitting(true)
    setMessage("")

    const formData = new FormData(event.currentTarget)
    try {
      const response = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(formData)),
      })
      const result = (await response.json()) as { message?: string }
      if (!response.ok) {
        setMessage(result.message ?? "Please check your details and try again.")
        return
      }

      router.push(mode === "register" ? "/add-article" : "/")
      router.refresh()
    } catch {
      setMessage("Could not connect. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const field =
    "mt-2 w-full border border-rule bg-surface px-4 py-3 text-body focus:border-accent"

  return (
    <form onSubmit={submit} className="flex max-w-xl flex-col gap-6">
      {mode === "register" && (
        <label className="label">
          Name
          <input name="name" autoComplete="name" required maxLength={80} className={field} />
        </label>
      )}
      <label className="label">
        Email
        <input
          name="email"
          type="email"
          autoComplete="email"
          required
          className={field}
        />
      </label>
      <label className="label">
        Password
        <input
          name="password"
          type="password"
          autoComplete={mode === "register" ? "new-password" : "current-password"}
          minLength={8}
          maxLength={128}
          required
          className={field}
        />
      </label>
      <div className="flex flex-wrap items-center gap-5">
        <button
          type="submit"
          disabled={submitting}
          className="label border border-ink bg-ink px-6 py-3 text-surface transition-colors hover:border-accent hover:bg-accent disabled:opacity-50"
        >
          {submitting ? "Please wait…" : mode === "register" ? "Create account" : "Sign in"}
        </button>
        <p role="status" className="text-meta text-accent">{message}</p>
      </div>
    </form>
  )
}
