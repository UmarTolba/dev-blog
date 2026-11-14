import Link from "next/link"
import ArticleItemList from "@/components/ArticleListItem"
import { getCategorisedArticles } from "@/lib/articles"

export const dynamic = "force-dynamic"

const ArticlesPage = () => {
  const articles = getCategorisedArticles()
  const categories = Object.keys(articles)
  const total = categories.reduce((sum, key) => sum + articles[key].length, 0)

  return (
    <div className="mx-auto max-w-shell px-6 md:px-10">
      <header className="grid gap-8 border-b border-ink pb-7 pt-16 md:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] md:items-end md:pt-28">
        <div>
          <p className="label">
            Index — {total} {total === 1 ? "entry" : "entries"}
          </p>
          <h1 className="mt-5 font-display text-display-xl tracking-display-tight">
            minimal <span className="italic text-accent">blog</span>
          </h1>
        </div>

        <div className="md:border-l md:border-rule md:pb-3 md:pl-8">
          <p className="max-w-[34ch] text-meta text-muted">
            Notes on code, books, and the business of building things. Written
            long, published rarely.
          </p>
          <nav className="mt-5 flex gap-6 text-meta">
            <Link href="/" className="link">Home</Link>
            <Link href="/about" className="link">About</Link>
            <Link href="/contact" className="link">Contact</Link>
            <Link href="/upload-blog" className="link">Upload an entry</Link>
          </nav>
        </div>
      </header>

      <main>
        {categories.length === 0 ? (
          <p className="py-20 font-display text-display-sm tracking-display text-muted">
            Nothing published yet.{" "}
            <Link href="/upload-blog" className="text-accent underline underline-offset-4">
              Add the first entry
            </Link>
            .
          </p>
        ) : (
          categories.map((category, index) => (
            <ArticleItemList
              category={category}
              articles={articles[category]}
              index={index}
              key={category}
            />
          ))
        )}
      </main>

      <footer className="flex flex-wrap items-baseline justify-between gap-4 border-t border-ink py-8">
        <p className="label">Minimal Blog</p>
        <p className="label">Set in Instrument Serif &amp; IBM Plex Mono</p>
      </footer>
    </div>
  )
}

export default ArticlesPage
