import Image from "next/image"
import Link from "next/link"
import { getSortedArticles } from "@/lib/articles"
import { formatArticleDate } from "@/lib/formatDate"

export const dynamic = "force-dynamic"

const HomePage = () => {
  const latest = getSortedArticles().slice(-3).reverse()

  return (
    <main className="mx-auto max-w-shell px-6 md:px-10">
      <section className="grid items-center gap-10 border-b border-ink py-14 md:grid-cols-[1.2fr_0.8fr] md:py-20">
        <div>
          <p className="label">Notes on making things</p>
          <h1 className="mt-5 font-display text-display-xl tracking-display-tight">
            minimal <span className="italic text-accent">blog</span>
          </h1>
          <p className="mt-6 max-w-[40ch] text-body text-muted">
            Ideas on code, books, and the business of building things.
            Thoughtful notes, published one article at a time.
          </p>
          <div className="mt-8 flex flex-wrap gap-5">
            <Link
              href="/articles"
              className="label border border-ink bg-ink px-6 py-3 text-surface transition-colors hover:border-accent hover:bg-accent"
            >
              Browse articles
            </Link>
            <Link href="/about" className="link self-center text-meta">
              About the blog
            </Link>
          </div>
        </div>
        <figure>
          <Image
            src="/merchant.jpeg"
            alt="Historical painted portrait of a merchant in his study"
            width={1200}
            height={1369}
            priority
            className="max-h-[28rem] w-full border border-rule object-cover object-center"
          />
          <figcaption className="mt-2 text-meta text-muted">
            A portrait from the blog’s reading and history collection.
          </figcaption>
        </figure>
      </section>

      <section className="py-12 md:py-16" aria-labelledby="latest-heading">
        <h2 id="latest-heading" className="label">
          <span className="mr-2 text-accent">01</span> Latest articles
        </h2>
        {latest.length > 0 ? (
          <ul className="mt-6 border-t border-rule">
            {latest.map((article) => (
              <li key={article.id} className="border-b border-rule">
                <Link
                  href={`/${article.id}`}
                  className="group flex flex-wrap items-baseline justify-between gap-x-8 gap-y-1 py-4"
                >
                  <span className="font-display text-display-sm tracking-display transition-colors group-hover:text-accent">
                    {article.title}
                  </span>
                  <span className="text-meta tabular-nums text-muted">
                    {formatArticleDate(article.date)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-6 border-t border-rule py-8">
            <p className="font-display text-display-sm">No articles yet.</p>
            <p className="mt-2 text-meta text-muted">
              Sign in to write the first article or upload a Markdown file.
            </p>
            <div className="mt-4 flex gap-5">
              <Link href="/add-article" className="link text-meta">Add an article</Link>
              <Link href="/upload-blog" className="link text-meta">Upload an article</Link>
            </div>
          </div>
        )}
      </section>
    </main>
  )
}

export default HomePage
