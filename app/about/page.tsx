import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About",
  description: "What this blog is about.",
}

const topics = [
  ["01", "Code", "Clean code, small tools, and lessons from shipping."],
  ["02", "Books", "Notes on the books worth reading twice."],
  ["03", "Business", "Side hustles, starting up, and staying curious."],
]

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-shell px-6 md:px-10">
      <header className="border-b border-ink pb-7 pt-10 md:pt-14">
        <Link href="/" className="link text-meta">
          ← Index
        </Link>
        <h1 className="mt-6 font-display text-display tracking-display">
          About this <span className="italic text-accent">blog</span>
        </h1>
      </header>

      <main className="py-12 md:py-16">
        <p className="max-w-[48ch] text-body">
          A small, quiet place for long notes on code, books, and the business
          of building things. Written long, published rarely.
        </p>

        <ul className="mt-12 border-t border-rule">
          {topics.map(([n, title, text]) => (
            <li
              key={n}
              className="grid gap-2 border-b border-rule py-6 md:grid-cols-[6rem_12rem_1fr]"
            >
              <span className="label text-accent">{n}</span>
              <h2 className="font-display text-display-sm tracking-display">{title}</h2>
              <p className="text-meta text-muted">{text}</p>
            </li>
          ))}
        </ul>
      </main>
    </div>
  )
}
