import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch.",
}

export default function ContactPage() {
  const contactEmail = process.env.CONTACT_EMAIL?.trim()

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
        <p className="max-w-[48ch] text-body text-muted">
          {contactEmail ? (
            <>
              Questions or feedback? Email{" "}
              <a className="link" href={`mailto:${contactEmail}`}>
                {contactEmail}
              </a>
              .
            </>
          ) : (
            "The blog administrator has not configured a contact email yet."
          )}
        </p>
        <p className="mt-6 text-meta text-muted">
          To contribute, <Link href="/register" className="link">create an account</Link>{" "}
          and add an article.
        </p>
      </main>
    </div>
  )
}
