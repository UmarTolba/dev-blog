import Link from "next/link"
import { getSortedArticles } from "@/lib/articles"
import { formatArticleDate } from "@/lib/formatDate"

export const dynamic = "force-dynamic"

const HomePage = () => {
  const latest = getSortedArticles().slice(-3).reverse()

  return (
    <div className="mx-auto max-w-shell px-6 md:px-10">
      <header className="flex items-baseline justify-between border-b border-ink py-6">
        <p className="label">Minimal Blog</p>
        <nav className="flex gap-6 text-meta">
          <Link href="/articles" className="link">Articles</Link>
          <Link href="/about" className="link">About</Link>
          <Link href="/contact" className="link">Contact</Link>
        </nav>
      </header>

      <section className="border-b border-ink py-20 md:py-32">
        <h1 className="font-display text-display-xl tracking-display-tight">
          minimal <span className="italic text-accent">blog</span>
        </h1>
        <p className="mt-8 max-w-[40ch] text-body text-muted">
          Notes on code, books, and the business of building things. Written
          long, published rarely.
        </p>
        <Link
          href="/articles"
          className="label mt-10 inline-block border border-ink bg-ink px-6 py-3 text-surface transition-colors hover:border-accent hover:bg-accent"
        >
          Read the articles
        </Link>
      </section>

      <main className="py-12 md:py-16">
        <h2 className="label">
          <span className="mr-2 text-accent">01</span> Latest
        </h2>
        <ul className="mt-6 border-t border-rule">
          {latest.map((a) => (
            <li key={a.id} className="border-b border-rule">
              <Link
                href={`/${a.id}`}
                className="group flex flex-wrap items-baseline justify-between gap-x-8 gap-y-1 py-4"
              >
                <span className="font-display text-display-sm tracking-display transition-colors group-hover:text-accent">
                  {a.title}
                </span>
                <span className="text-meta tabular-nums text-muted">
                  {formatArticleDate(a.date)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  )
}

export default HomePage
