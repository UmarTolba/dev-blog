import Link from "next/link"
import type { Metadata } from "next"
import { redirect } from "next/navigation"
import DeleteArticleButton from "@/components/DeleteArticleButton"
import { getCurrentUser } from "@/lib/auth"
import { database } from "@/lib/database"
import { getSortedArticles } from "@/lib/articles"
import { formatArticleDate } from "@/lib/formatDate"

export const metadata: Metadata = {
  title: "Admin",
}

export default async function AdminPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/login")
  if (user.role !== "admin") redirect("/")

  const articles = getSortedArticles().slice().reverse()
  const userCount = (
    database.prepare("SELECT COUNT(*) AS count FROM users").get() as {
      count: number
    }
  ).count

  return (
    <main className="mx-auto max-w-shell px-6 py-12 md:px-10 md:py-16">
      <header className="flex flex-wrap items-end justify-between gap-6 border-b border-ink pb-8">
        <div>
          <p className="label">Administration</p>
          <h1 className="mt-3 font-display text-display">Dashboard</h1>
        </div>
        <div className="flex gap-5 text-meta">
          <Link href="/add-article" className="link">Add an article</Link>
          <Link href="/upload-blog" className="link">Upload an article</Link>
        </div>
      </header>

      <section
        aria-label="Site totals"
        className="grid gap-4 border-b border-rule py-8 sm:grid-cols-2"
      >
        <p><span className="label">Articles</span><br />{articles.length}</p>
        <p><span className="label">Accounts</span><br />{userCount}</p>
      </section>

      <section className="py-8" aria-labelledby="admin-articles">
        <h2 id="admin-articles" className="label">Manage articles</h2>
        {articles.length === 0 ? (
          <p className="mt-5 text-muted">
            There are no articles yet.{" "}
            <Link href="/add-article" className="link">Create one</Link>.
          </p>
        ) : (
          <ul className="mt-5 border-t border-rule">
            {articles.map((article) => (
              <li
                key={article.id}
                className="flex flex-col gap-3 border-b border-rule py-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <Link href={`/${article.id}`} className="font-display text-display-sm hover:text-accent">
                    {article.title}
                  </Link>
                  <p className="text-meta text-muted">
                    {article.category} · {formatArticleDate(article.date)}
                  </p>
                </div>
                <div className="flex gap-5 text-meta">
                  <Link href={`/articles/${article.id}/edit`} className="link">Edit</Link>
                  <DeleteArticleButton slug={article.id} returnTo="/admin" />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}
