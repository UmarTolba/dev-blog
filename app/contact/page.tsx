import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch.",
}

const field =
  "mt-2 w-full border border-rule bg-surface px-4 py-3 text-body focus:border-accent"

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-shell px-6 md:px-10">
      <header className="border-b border-ink pb-7 pt-10 md:pt-14">
        <Link href="/" className="link text-meta">
          ← Index
        </Link>
        <h1 className="mt-6 font-display text-display tracking-display">
          Say <span className="italic text-accent">hello</span>
        </h1>
      </header>

      <main className="py-12 md:py-16">
        {/* shortcut: opens the visitor's mail app, no backend; swap for an API route if you want in-site sending */}
        <form
          action="mailto:hello@example.com"
          method="post"
          encType="text/plain"
          className="flex max-w-xl flex-col gap-6"
        >
          <label className="label">
            Name
            <input name="name" required className={field} />
          </label>
          <label className="label">
            Email
            <input name="email" type="email" required className={field} />
          </label>
          <label className="label">
            Message
            <textarea name="message" rows={5} required className={field} />
          </label>
          <button
            type="submit"
            className="label self-start border border-ink bg-ink px-6 py-3 text-surface transition-colors hover:border-accent hover:bg-accent"
          >
            Send
          </button>
        </form>
      </main>
    </div>
  )
}
